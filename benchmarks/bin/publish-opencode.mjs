#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { BENCHMARK_ROOT, slug } from "../lib/core.mjs";

const projectRoot = path.resolve(BENCHMARK_ROOT, "..");
const revision = valueAfter("--revision");
const expectedTasks = [
  "saas-landing-page",
  "award-winning-creative-site",
  "pocket-reef-life-simulation",
];
const modelDetails = {
  "opencode-go/grok-4.5": { key: "grok-4-5", label: "Grok 4.5" },
  "opencode-go/kimi-k3": { key: "kimi-k3", label: "Kimi K3" },
  "opencode-go/glm-5.2": { key: "glm-5-2", label: "GLM 5.2" },
};

if (!revision) {
  throw new Error("Usage: npm run benchmark:publish:opencode -- --revision <runner-commit>");
}

const candidates = await loadCandidates();
const expectedRunCount = expectedTasks.length * Object.keys(modelDetails).length;
if (candidates.length !== expectedRunCount) {
  throw new Error(
    `Expected exactly ${expectedRunCount} OpenCode results for runner ${revision}, found ${candidates.length}`,
  );
}

const duplicateKeys = candidates
  .map((candidate) => `${candidate.metadata.task.id}:${candidate.metadata.model}`)
  .filter((key, index, keys) => keys.indexOf(key) !== index);
if (duplicateKeys.length > 0) {
  throw new Error(`Refusing to publish duplicate task/model results: ${duplicateKeys.join(", ")}`);
}

const publishedResults = Object.fromEntries(expectedTasks.map((task) => [task, []]));

for (const candidate of candidates) {
  const { metadata, directory } = candidate;
  const model = modelDetails[metadata.model];
  const passed = metadata.functionalPassed === true;
  const destination = path.join(
    projectRoot,
    "public",
    "benchmarks",
    metadata.task.id,
    model.key,
  );
  assertInside(path.join(projectRoot, "public", "benchmarks"), destination);

  await fs.rm(destination, { recursive: true, force: true });
  if (passed) {
    const buildDirectory = path.join(directory, "dist");
    await fs.access(path.join(buildDirectory, "index.html"));
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.cp(buildDirectory, destination, { recursive: true });
    await normalizePublishedAssets(destination);
  }

  const usage = metadata.usage?.usage ?? {};
  const cachedInputTokens = number(usage.cached_input_tokens);
  const uncachedInputTokens = number(usage.input_tokens);
  const changedFiles = metadata.changeSet?.changedPaths?.length ?? 0;
  publishedResults[metadata.task.id].push({
    id: model.key,
    modelKey: model.key,
    label: model.label,
    model: metadata.model,
    provider: "OpenCode Go",
    status: passed ? "Passed" : "Failed",
    attempt: metadata.attempt,
    effort: "Default",
    durationMs: metadata.durationMs,
    inputTokens: uncachedInputTokens + cachedInputTokens,
    cachedInputTokens,
    outputTokens: number(usage.output_tokens),
    reasoningTokens: number(usage.reasoning_output_tokens),
    changedFiles,
    ...(passed
      ? {
          previewUrl: `/benchmarks/${metadata.task.id}/${model.key}/index.html`,
          summary: `${model.label} completed this task in one OpenCode Go attempt and passed the production build, task verifier, integrity, and source-change checks.`,
        }
      : {
          summary: `${model.label} completed the attempt without producing a qualifying implementation. The unchanged starter was rejected by the source-change guard.`,
          failureReason:
            "The model made no qualifying source changes. The buildable starter is intentionally rejected and no preview is published.",
        }),
  });
}

for (const results of Object.values(publishedResults)) {
  results.sort((left, right) =>
    ["grok-4-5", "kimi-k3", "glm-5-2"].indexOf(left.modelKey) -
    ["grok-4-5", "kimi-k3", "glm-5-2"].indexOf(right.modelKey),
  );
}

const outputPath = path.join(projectRoot, "src", "data", "opencode-benchmark-results.json");
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(
  outputPath,
  `${JSON.stringify(
    {
      schemaVersion: 1,
      provider: "OpenCode Go",
      runnerRevision: revision,
      results: publishedResults,
    },
    null,
    2,
  )}\n`,
);

console.log(
  JSON.stringify(
    {
      revision,
      published: candidates.filter((candidate) => candidate.metadata.functionalPassed).length,
      failed: candidates.filter((candidate) => !candidate.metadata.functionalPassed).length,
      output: path.relative(projectRoot, outputPath),
    },
    null,
    2,
  ),
);

async function loadCandidates() {
  const results = [];
  for (const task of expectedTasks) {
    const taskDirectory = path.join(BENCHMARK_ROOT, "results", task);
    for (const entry of await fs.readdir(taskDirectory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const directory = path.join(taskDirectory, entry.name);
      const metadataPath = path.join(directory, "metadata.json");
      try {
        const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"));
        if (
          metadata.engine === "opencode" &&
          metadata.runner?.revision === revision &&
          metadata.attempt === 1 &&
          modelDetails[metadata.model]
        ) {
          results.push({ directory, metadata });
        }
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
  }
  return results;
}

async function normalizePublishedAssets(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await normalizePublishedAssets(filePath);
    } else if (/\.(?:css|html|js)$/u.test(entry.name)) {
      const source = await fs.readFile(filePath, "utf8");
      await fs.writeFile(filePath, source.replace(/\r\n?|\u2028|\u2029/gu, "\n"));
    }
  }
}

function valueAfter(flag) {
  const index = process.argv.indexOf(flag);
  return index === -1 ? null : process.argv[index + 1];
}

function number(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function assertInside(parent, child) {
  const relative = path.relative(parent, child);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Unsafe publish destination: ${slug(child)}`);
  }
}
