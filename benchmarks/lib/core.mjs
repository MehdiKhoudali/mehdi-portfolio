import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

export const BENCHMARK_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const requiredTaskFields = [
  "id",
  "version",
  "title",
  "brief",
  "starter",
  "setupCommands",
  "acceptanceCommands",
  "protectedPaths",
  "minimumChangedFiles",
  "limits",
];

export function parseArgs(argv) {
  const options = {
    attempt: 1,
    dryRun: false,
    keepWorkspace: false,
    list: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--dry-run") options.dryRun = true;
    else if (argument === "--keep-workspace") options.keepWorkspace = true;
    else if (argument === "--list") options.list = true;
    else if (argument === "--task") options.task = argv[++index];
    else if (argument === "--model") options.model = argv[++index];
    else if (argument === "--effort") options.effort = argv[++index];
    else if (argument === "--attempt") options.attempt = Number(argv[++index]);
    else if (argument === "--timeout-minutes") options.timeoutMinutes = Number(argv[++index]);
    else if (argument === "--help" || argument === "-h") options.help = true;
    else throw new Error(`Unknown argument: ${argument}`);
  }

  if (!Number.isInteger(options.attempt) || options.attempt < 1) {
    throw new Error("--attempt must be a positive integer");
  }

  if (
    options.timeoutMinutes !== undefined &&
    (!Number.isFinite(options.timeoutMinutes) || options.timeoutMinutes <= 0)
  ) {
    throw new Error("--timeout-minutes must be greater than zero");
  }

  return options;
}

export function parseTaskReference(reference) {
  const [id, version] = String(reference ?? "").split("@");
  if (!id) throw new Error("A task id is required");
  return { id, version: version || null };
}

export async function listTasks(benchmarkRoot = BENCHMARK_ROOT) {
  const tasksRoot = path.join(benchmarkRoot, "tasks");
  const taskDirectories = await safeDirectories(tasksRoot);
  const tasks = [];

  for (const taskId of taskDirectories) {
    for (const version of await safeDirectories(path.join(tasksRoot, taskId))) {
      const manifestPath = path.join(tasksRoot, taskId, version, "task.json");
      try {
        const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
        tasks.push({ id: manifest.id, version: manifest.version, title: manifest.title });
      } catch {
        // Invalid task folders are surfaced by loadTask; listing remains best-effort.
      }
    }
  }

  return tasks.sort((left, right) =>
    `${left.id}@${left.version}`.localeCompare(`${right.id}@${right.version}`),
  );
}

export async function loadTask(reference, benchmarkRoot = BENCHMARK_ROOT) {
  const { id, version } = parseTaskReference(reference);
  const taskRoot = path.join(benchmarkRoot, "tasks", id);
  const versions = await safeDirectories(taskRoot);

  if (versions.length === 0) throw new Error(`Unknown task: ${id}`);

  const resolvedVersion = version ?? versions.sort(compareVersions).at(-1);
  if (!versions.includes(resolvedVersion)) {
    throw new Error(`Unknown task version: ${id}@${resolvedVersion}`);
  }

  const directory = path.join(taskRoot, resolvedVersion);
  const manifestPath = path.join(directory, "task.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

  for (const field of requiredTaskFields) {
    if (!(field in manifest)) throw new Error(`Task manifest is missing '${field}'`);
  }

  if (manifest.id !== id || manifest.version !== resolvedVersion) {
    throw new Error("Task folder and manifest identity do not match");
  }

  for (const field of ["setupCommands", "acceptanceCommands"]) {
    if (!Array.isArray(manifest[field]) || manifest[field].some((command) => !isCommand(command))) {
      throw new Error(`Task '${field}' must be an array of command arrays`);
    }
  }

  if (!Number.isInteger(manifest.minimumChangedFiles) || manifest.minimumChangedFiles < 0) {
    throw new Error("Task 'minimumChangedFiles' must be a non-negative integer");
  }

  const briefPath = path.resolve(directory, manifest.brief);
  const starterPath = path.resolve(directory, manifest.starter);
  assertInside(directory, briefPath, "brief");
  assertInside(directory, starterPath, "starter");

  const [brief, starterStat] = await Promise.all([
    fs.readFile(briefPath, "utf8"),
    fs.stat(starterPath),
  ]);
  if (!starterStat.isDirectory()) throw new Error("Task starter must be a directory");

  const taskHash = await hashTask(directory);

  return {
    ...manifest,
    directory,
    manifestPath,
    briefPath,
    starterPath,
    brief,
    taskHash,
  };
}

export async function hashTask(directory) {
  const hash = createHash("sha256");
  const files = await walkFiles(directory);

  for (const file of files) {
    const relative = path.relative(directory, file).replaceAll(path.sep, "/");
    if (relative.includes("/node_modules/") || relative.startsWith("node_modules/")) continue;
    if (relative.includes("/dist/") || relative.startsWith("dist/")) continue;
    hash.update(relative);
    hash.update("\0");
    hash.update(await fs.readFile(file));
    hash.update("\0");
  }

  return hash.digest("hex");
}

export function buildPrompt(task, run) {
  return `# Controlled coding task\n\nYou are taking part in a repeatable coding-model field test. Work autonomously in the current repository and implement the task below.\n\n## Run contract\n\n- Task: ${task.id}@${task.version}\n- Attempt: ${run.attempt}\n- You may edit application source files inside this repository.\n- Do not edit AGENTS.md, BRIEF.md, package.json, package-lock.json, or benchmark metadata.\n- Do not install or upgrade dependencies. Everything required is already installed.\n- Do not use the network or external services.\n- Do not ask questions. Resolve ambiguity using the brief and document assumptions in your final response.\n- Run the available build command before finishing.\n- Do not commit changes.\n\n## Detailed brief\n\n${task.brief.trim()}\n\n## Final response\n\nSummarize what you built, the verification commands you ran, and any known limitations. The files in the repository are the primary deliverable.`;
}

export function buildCodexArgs({
  model,
  effort,
  workspace,
  finalMessagePath,
  capabilities = {},
  platform = process.platform,
}) {
  const args = ["exec", "--json", "--model", model, "--sandbox", "workspace-write"];

  if (capabilities.ignoreUserConfig) args.push("--ignore-user-config");
  if (capabilities.ignoreRules) args.push("--ignore-rules");
  if (capabilities.ephemeral) args.push("--ephemeral");
  if (capabilities.ignoreUserConfig) {
    args.push("-c", 'approval_policy="never"');
    if (platform === "win32") args.push("-c", 'windows.sandbox="unelevated"');
  }
  if (effort) args.push("-c", `model_reasoning_effort=${JSON.stringify(effort)}`);

  args.push("-C", workspace, "--output-last-message", finalMessagePath, "-");
  return args;
}

export function detectExecCapabilities(helpText) {
  return {
    ephemeral: helpText.includes("--ephemeral"),
    ignoreRules: helpText.includes("--ignore-rules"),
    ignoreUserConfig: helpText.includes("--ignore-user-config"),
  };
}

export function createRunId({ taskId, version, model, attempt, date = new Date() }) {
  const timestamp = date.toISOString().replace(/[:.]/g, "-");
  return [taskId, version, slug(model), `attempt-${attempt}`, timestamp].join("__");
}

export function slug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "unknown";
}

export function usageFromJsonl(contents) {
  let threadId = null;
  let usage = null;
  const events = {};

  for (const line of contents.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const event = JSON.parse(line);
      events[event.type] = (events[event.type] ?? 0) + 1;
      if (event.type === "thread.started") threadId = event.thread_id ?? threadId;
      if (event.type === "turn.completed" && event.usage) usage = event.usage;
    } catch {
      events.unparseable = (events.unparseable ?? 0) + 1;
    }
  }

  return { events, threadId, usage };
}

async function safeDirectories(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function walkFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const resolved = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walkFiles(resolved)));
    else if (entry.isFile()) files.push(resolved);
  }

  return files;
}

function assertInside(parent, child, label) {
  const relative = path.relative(parent, child);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Task ${label} must stay inside its version directory`);
  }
}

function isCommand(command) {
  return (
    Array.isArray(command) &&
    command.length > 0 &&
    command.every((part) => typeof part === "string" && part.length > 0)
  );
}

function compareVersions(left, right) {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
}
