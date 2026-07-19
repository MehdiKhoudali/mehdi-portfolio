#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createWriteStream, existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { finished } from "node:stream/promises";
import {
  BENCHMARK_ROOT,
  buildCodexArgs,
  buildPrompt,
  createRunId,
  detectExecCapabilities,
  listTasks,
  loadTask,
  parseArgs,
  usageFromJsonl,
} from "../lib/core.mjs";

const HELP = `Usage:
  npm run benchmark:list
  npm run benchmark:dry-run
  npm run benchmark:run -- --task <id@version> --model <model> [options]

Options:
  --task <id@version>       Versioned task package to run
  --model <model>           Exact Codex model id
  --effort <effort>         Optional reasoning effort override
  --attempt <number>        Attempt number (default: 1)
  --timeout-minutes <n>     Override the task timeout; recorded in metadata
  --keep-workspace          Preserve the temporary workspace after the run
  --dry-run                 Validate and print the run plan without invoking Codex
  --list                    List available task packages
`;

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  console.log(HELP);
  process.exit(0);
}

if (options.list) {
  console.log(JSON.stringify(await listTasks(), null, 2));
  process.exit(0);
}

if (!options.task || !options.model) {
  console.error(HELP);
  throw new Error("--task and --model are required");
}

const task = await loadTask(options.task);
const startedAt = new Date();
const timeoutMinutes = options.timeoutMinutes ?? task.limits.timeoutMinutes;
const run = {
  attempt: options.attempt,
  effort: options.effort ?? task.limits.reasoningEffort ?? null,
  model: options.model,
  timeoutMinutes,
};

const codexRuntime = resolveCodexRuntime();
const [versionResult, authResult, helpResult] = await Promise.all([
  runCommand({
    command: codexRuntime.command,
    args: [...codexRuntime.argsPrefix, "--version"],
    timeoutMs: 10_000,
  }),
  runCommand({
    command: codexRuntime.command,
    args: [...codexRuntime.argsPrefix, "login", "status"],
    timeoutMs: 10_000,
  }),
  runCommand({
    command: codexRuntime.command,
    args: [...codexRuntime.argsPrefix, "exec", "--help"],
    timeoutMs: 10_000,
  }),
]);

if (versionResult.exitCode !== 0) throw new Error("Codex CLI is not available");
if (authResult.exitCode !== 0) throw new Error("Codex CLI is not authenticated");

const capabilities = detectExecCapabilities(helpResult.stdout);
const runId = createRunId({
  taskId: task.id,
  version: task.version,
  model: run.model,
  attempt: run.attempt,
  date: startedAt,
});
const resultDirectory = path.join(BENCHMARK_ROOT, "results", task.id, runId);
const workspaceContainer = path.join(BENCHMARK_ROOT, ".runs", runId);
const workspace = path.join(workspaceContainer, "workspace");
const finalMessagePath = path.join(resultDirectory, "final-message.md");
const prompt = buildPrompt(task, run);
const codexArgs = buildCodexArgs({
  model: run.model,
  effort: run.effort,
  workspace,
  finalMessagePath,
  capabilities,
});

const plan = {
  schemaVersion: 1,
  runId,
  dryRun: options.dryRun,
  task: {
    id: task.id,
    version: task.version,
    title: task.title,
    hash: task.taskHash,
  },
  model: run.model,
  effort: run.effort,
  attempt: run.attempt,
  timeoutMinutes,
  codex: {
    executable: codexRuntime.display,
    version: firstLine(versionResult.stdout),
    authentication: firstLine(authResult.stdout || authResult.stderr),
    capabilities,
    args: codexArgs.map((argument) =>
      argument === workspace || argument === finalMessagePath
        ? path.relative(BENCHMARK_ROOT, argument)
        : argument,
    ),
  },
  setupCommands: task.setupCommands,
  acceptanceCommands: task.acceptanceCommands,
  protectedPaths: task.protectedPaths,
  promptSha256: sha256(prompt),
};

if (options.dryRun) {
  console.log(JSON.stringify(plan, null, 2));
  process.exit(0);
}

await fs.mkdir(resultDirectory, { recursive: true });
await fs.mkdir(workspaceContainer, { recursive: true });
await fs.writeFile(path.join(resultDirectory, "run-plan.json"), `${JSON.stringify(plan, null, 2)}\n`);
await fs.writeFile(path.join(resultDirectory, "prompt.md"), `${prompt}\n`);

const metadata = {
  ...plan,
  dryRun: false,
  startedAt: startedAt.toISOString(),
  finishedAt: null,
  durationMs: null,
  status: "running",
  functionalPassed: false,
  setup: [],
  acceptance: [],
  integrity: null,
  codexResult: null,
  usage: null,
  error: null,
  artifacts: {
    finalMessage: "final-message.md",
    patch: "changes.patch",
    prompt: "prompt.md",
    source: "source",
    trace: "trace.jsonl",
  },
};

try {
  await fs.cp(task.starterPath, workspace, {
    recursive: true,
    filter: (entry) =>
      ![".git", "node_modules", "dist", ".next"].includes(path.basename(entry)),
  });
  await fs.writeFile(path.join(workspace, "BRIEF.md"), `${task.brief.trim()}\n`);
  await initializeRepository(workspace);

  metadata.setup = await runCommandGroup({
    commands: task.setupCommands,
    cwd: workspace,
    directory: path.join(resultDirectory, "setup"),
    timeoutMs: minutesToMs(task.limits.commandTimeoutMinutes ?? 10),
  });

  if (metadata.setup.some((result) => result.exitCode !== 0)) {
    throw new Error("Task setup failed; Codex was not invoked");
  }

  const tracePath = path.join(resultDirectory, "trace.jsonl");
  const codexStderrPath = path.join(resultDirectory, "codex.stderr.log");
  const codexStartedAt = Date.now();
  const codexResult = await runCommand({
    command: codexRuntime.command,
    args: [...codexRuntime.argsPrefix, ...codexArgs],
    cwd: workspace,
    stdin: prompt,
    stdoutPath: tracePath,
    stderrPath: codexStderrPath,
    timeoutMs: minutesToMs(timeoutMinutes),
  });

  metadata.codexResult = {
    exitCode: codexResult.exitCode,
    signal: codexResult.signal,
    timedOut: codexResult.timedOut,
    durationMs: Date.now() - codexStartedAt,
    stderrTail: tail(codexResult.stderr),
  };

  const trace = await fs.readFile(tracePath, "utf8").catch(() => "");
  metadata.usage = usageFromJsonl(trace);

  metadata.acceptance = await runCommandGroup({
    commands: task.acceptanceCommands,
    cwd: workspace,
    directory: path.join(resultDirectory, "acceptance"),
    timeoutMs: minutesToMs(task.limits.commandTimeoutMinutes ?? 10),
  });

  metadata.integrity = await checkIntegrity(workspace, task.protectedPaths);

  await runCommand({
    command: resolveExecutable("git"),
    args: ["diff", "--binary", "HEAD"],
    cwd: workspace,
    stdoutPath: path.join(resultDirectory, "changes.patch"),
    timeoutMs: 30_000,
  });

  const statusResult = await runCommand({
    command: resolveExecutable("git"),
    args: ["status", "--porcelain=v1"],
    cwd: workspace,
    timeoutMs: 30_000,
  });
  await fs.writeFile(path.join(resultDirectory, "git-status.txt"), statusResult.stdout);

  await copySource(workspace, path.join(resultDirectory, "source"));

  const acceptancePassed = metadata.acceptance.every((result) => result.exitCode === 0);
  metadata.functionalPassed =
    metadata.codexResult.exitCode === 0 &&
    !metadata.codexResult.timedOut &&
    acceptancePassed &&
    metadata.integrity.passed;
  metadata.status = metadata.codexResult.timedOut
    ? "timed_out"
    : metadata.functionalPassed
      ? "completed"
      : "failed";
} catch (error) {
  metadata.status = "failed";
  metadata.error = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : null,
  };

  if (await exists(workspace)) {
    await copySource(workspace, path.join(resultDirectory, "source")).catch(() => {});
  }
} finally {
  const finishedAt = new Date();
  metadata.finishedAt = finishedAt.toISOString();
  metadata.durationMs = finishedAt.getTime() - startedAt.getTime();
  await fs.writeFile(
    path.join(resultDirectory, "metadata.json"),
    `${JSON.stringify(metadata, null, 2)}\n`,
  );

  if (!options.keepWorkspace) {
    await fs.rm(workspaceContainer, { recursive: true, force: true });
  }
}

console.log(
  JSON.stringify(
    {
      runId,
      status: metadata.status,
      functionalPassed: metadata.functionalPassed,
      resultDirectory,
    },
    null,
    2,
  ),
);

if (!metadata.functionalPassed) process.exitCode = 1;

async function initializeRepository(cwd) {
  const git = resolveExecutable("git");
  const commands = [
    ["init", "--quiet"],
    ["config", "user.name", "Coding Model Field Tests"],
    ["config", "user.email", "benchmarks@local.invalid"],
    ["add", "--all"],
    ["commit", "--quiet", "-m", "benchmark baseline"],
  ];

  for (const args of commands) {
    const result = await runCommand({ command: git, args, cwd, timeoutMs: 30_000 });
    if (result.exitCode !== 0) {
      throw new Error(`Could not initialize benchmark repository: git ${args.join(" ")}`);
    }
  }
}

async function runCommandGroup({ commands, cwd, directory, timeoutMs }) {
  await fs.mkdir(directory, { recursive: true });
  const results = [];

  for (let index = 0; index < commands.length; index += 1) {
    const [command, ...args] = commands[index];
    const prefix = `${String(index + 1).padStart(2, "0")}-${safeFileName(command)}`;
    const startedAt = Date.now();
    const runtime = resolveTaskRuntime(command);
    const result = await runCommand({
      command: runtime.command,
      args: [...runtime.argsPrefix, ...args],
      cwd,
      stdoutPath: path.join(directory, `${prefix}.stdout.log`),
      stderrPath: path.join(directory, `${prefix}.stderr.log`),
      timeoutMs,
      useCommandShell:
        process.platform === "win32" && runtime.command.toLowerCase().endsWith(".cmd"),
    });

    results.push({
      command: [command, ...args],
      exitCode: result.exitCode,
      signal: result.signal,
      timedOut: result.timedOut,
      durationMs: Date.now() - startedAt,
      stdoutTail: tail(result.stdout),
      stderrTail: tail(result.stderr),
    });
  }

  return results;
}

async function checkIntegrity(cwd, protectedPaths) {
  const result = await runCommand({
    command: resolveExecutable("git"),
    args: ["diff", "--name-only", "HEAD", "--", ...protectedPaths],
    cwd,
    timeoutMs: 30_000,
  });
  const changedPaths = result.stdout.split(/\r?\n/).filter(Boolean);
  return { passed: result.exitCode === 0 && changedPaths.length === 0, changedPaths };
}

async function copySource(source, destination) {
  await fs.rm(destination, { recursive: true, force: true });
  await fs.cp(source, destination, {
    recursive: true,
    filter: (entry) => {
      const name = path.basename(entry);
      return ![".git", "node_modules", "dist", ".next"].includes(name);
    },
  });
}

async function runCommand({
  command,
  args = [],
  cwd = process.cwd(),
  stdin,
  timeoutMs = 60_000,
  stdoutPath,
  stderrPath,
  useCommandShell = false,
}) {
  if (stdoutPath) await fs.mkdir(path.dirname(stdoutPath), { recursive: true });
  if (stderrPath) await fs.mkdir(path.dirname(stderrPath), { recursive: true });

  const invocation = commandInvocation(
    command,
    args,
    useCommandShell ||
      (process.platform === "win32" && command.toLowerCase().endsWith(".cmd")),
  );
  const child = spawn(invocation.command, invocation.args, {
    cwd,
    env: process.env,
    shell: false,
    windowsHide: true,
    stdio: ["pipe", "pipe", "pipe"],
  });

  const stdoutChunks = [];
  const stderrChunks = [];
  let timedOut = false;
  const stdoutStream = stdoutPath ? createWriteStream(stdoutPath) : null;
  const stderrStream = stderrPath ? createWriteStream(stderrPath) : null;

  child.stdout.on("data", (chunk) => {
    appendLimited(stdoutChunks, chunk);
    if (stdoutStream) stdoutStream.write(chunk);
  });
  child.stderr.on("data", (chunk) => {
    appendLimited(stderrChunks, chunk);
    if (stderrStream) stderrStream.write(chunk);
  });

  if (stdin !== undefined) child.stdin.end(stdin);
  else child.stdin.end();

  const timer = setTimeout(() => {
    timedOut = true;
    terminateProcessTree(child.pid);
  }, timeoutMs);

  const outcome = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (exitCode, signal) => resolve({ exitCode, signal }));
  }).finally(() => clearTimeout(timer));

  if (stdoutStream) stdoutStream.end();
  if (stderrStream) stderrStream.end();
  await Promise.all([
    stdoutStream ? finished(stdoutStream) : Promise.resolve(),
    stderrStream ? finished(stderrStream) : Promise.resolve(),
  ]);

  return {
    ...outcome,
    timedOut,
    stdout: Buffer.concat(stdoutChunks).toString("utf8"),
    stderr: Buffer.concat(stderrChunks).toString("utf8"),
  };
}

function resolveExecutable(command) {
  if (process.platform !== "win32") return command;
  const result = spawnSync("where.exe", [command], { encoding: "utf8", windowsHide: true });
  const candidates = result.stdout?.split(/\r?\n/).filter(Boolean) ?? [];
  return (
    candidates.find(
      (candidate) =>
        candidate.toLowerCase().endsWith(".exe") &&
        !candidate.toLowerCase().includes("\\windowsapps\\"),
    ) ??
    candidates.find((candidate) => candidate.toLowerCase().endsWith(".cmd")) ??
    candidates.find((candidate) => candidate.toLowerCase().endsWith(".exe")) ??
    command
  );
}

function resolveCodexRuntime() {
  if (process.env.BENCHMARK_CODEX_RUNTIME) {
    const script = path.resolve(process.env.BENCHMARK_CODEX_RUNTIME);
    if (!existsSync(script)) throw new Error(`Benchmark Codex runtime not found: ${script}`);
    return {
      command: process.execPath,
      argsPrefix: [script],
      display: `${process.execPath} ${script}`,
    };
  }

  if (process.platform !== "win32") {
    return { command: "codex", argsPrefix: [], display: "codex" };
  }

  const result = spawnSync("where.exe", ["codex"], { encoding: "utf8", windowsHide: true });
  const candidates = result.stdout?.split(/\r?\n/).filter(Boolean) ?? [];
  const commandShim = candidates.find((candidate) => candidate.toLowerCase().endsWith(".cmd"));

  if (commandShim) {
    const script = path.join(
      path.dirname(commandShim),
      "node_modules",
      "@openai",
      "codex",
      "bin",
      "codex.js",
    );
    if (existsSync(script)) {
      return {
        command: process.execPath,
        argsPrefix: [script],
        display: `${process.execPath} ${script}`,
      };
    }
  }

  const executable = candidates.find(
    (candidate) =>
      candidate.toLowerCase().endsWith(".exe") &&
      !candidate.toLowerCase().includes("\\windowsapps\\"),
  );
  if (executable) return { command: executable, argsPrefix: [], display: executable };

  throw new Error("Could not resolve the Codex CLI runtime");
}

function resolveTaskRuntime(command) {
  if (process.platform !== "win32") return { command, argsPrefix: [] };
  const result = spawnSync("where.exe", [command], { encoding: "utf8", windowsHide: true });
  const candidates = result.stdout?.split(/\r?\n/).filter(Boolean) ?? [];
  const executable = candidates.find((candidate) => candidate.toLowerCase().endsWith(".exe"));
  if (executable) return { command: executable, argsPrefix: [] };

  const commandShim = candidates.find((candidate) => candidate.toLowerCase().endsWith(".cmd"));
  if (commandShim && ["npm", "npx"].includes(command.toLowerCase())) {
    const cliScript = path.join(
      path.dirname(commandShim),
      "node_modules",
      "npm",
      "bin",
      `${command.toLowerCase()}-cli.js`,
    );
    if (existsSync(cliScript)) return { command: process.execPath, argsPrefix: [cliScript] };
  }

  return { command: commandShim ?? command, argsPrefix: [] };
}

function commandInvocation(command, args, useCommandShell) {
  if (!useCommandShell || process.platform !== "win32") return { command, args };
  const commandLine = [command, ...args].map(quoteWindowsArgument).join(" ");
  return {
    command: process.env.ComSpec || "cmd.exe",
    // cmd.exe /s strips the first and last quote. The extra pair preserves the
    // quoted executable path when Node or npm lives under a directory with spaces.
    args: ["/d", "/s", "/c", `"${commandLine}"`],
  };
}

function quoteWindowsArgument(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function terminateProcessTree(pid) {
  if (!pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill.exe", ["/PID", String(pid), "/T", "/F"], { windowsHide: true });
  } else {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // The process already exited.
    }
  }
}

function appendLimited(chunks, chunk) {
  const currentSize = chunks.reduce((total, item) => total + item.length, 0);
  if (currentSize < 2_000_000) chunks.push(Buffer.from(chunk));
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function minutesToMs(minutes) {
  return Math.round(minutes * 60_000);
}

function firstLine(value) {
  return String(value ?? "").trim().split(/\r?\n/)[0] ?? "";
}

function tail(value, length = 2_000) {
  const text = String(value ?? "");
  return text.length > length ? text.slice(-length) : text;
}

function safeFileName(value) {
  return String(value).replace(/[^a-z0-9._-]+/gi, "-").toLowerCase();
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}
