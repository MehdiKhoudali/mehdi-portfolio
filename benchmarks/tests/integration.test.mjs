import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { BENCHMARK_ROOT } from "../lib/core.mjs";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const runner = path.join(BENCHMARK_ROOT, "bin", "run.mjs");
const fakeCodex = path.join(testDirectory, "fixtures", "fake-codex.mjs");

test("runs the evidence pipeline end to end without contacting a model", { timeout: 120_000 }, async () => {
  let resultDirectory;

  try {
    const result = spawnSync(
      process.execPath,
      [
        runner,
        "--task",
        "saas-landing-page@1.0.0",
        "--model",
        "fixture-model",
        "--attempt",
        "1",
      ],
      {
        cwd: path.resolve(BENCHMARK_ROOT, ".."),
        encoding: "utf8",
        env: { ...process.env, BENCHMARK_CODEX_RUNTIME: fakeCodex },
        timeout: 120_000,
        windowsHide: true,
      },
    );

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const summary = JSON.parse(result.stdout);
    resultDirectory = summary.resultDirectory;

    assert.equal(summary.status, "completed");
    assert.equal(summary.functionalPassed, true);

    const metadata = JSON.parse(
      await fs.readFile(path.join(resultDirectory, "metadata.json"), "utf8"),
    );
    assert.equal(metadata.functionalPassed, true);
    assert.equal(metadata.integrity.passed, true);
    assert.equal(metadata.usage.threadId, "fixture-thread");
    assert.equal(metadata.usage.usage.output_tokens, 20);
    assert.ok(metadata.acceptance.every((command) => command.exitCode === 0));

    const patch = await fs.readFile(path.join(resultDirectory, "changes.patch"), "utf8");
    assert.match(patch, /Relay fixture build/);
    assert.match(
      await fs.readFile(path.join(resultDirectory, "source", "src", "App.jsx"), "utf8"),
      /Relay fixture build/,
    );
  } finally {
    if (resultDirectory) {
      await fs.rm(resultDirectory, { recursive: true, force: true });
      const taskResults = path.dirname(resultDirectory);
      const remaining = await fs.readdir(taskResults).catch(() => []);
      if (remaining.length === 0) await fs.rm(taskResults, { recursive: true, force: true });
    }
  }
});

test("rejects an unchanged starter even when every acceptance command passes", { timeout: 120_000 }, async () => {
  let resultDirectory;

  try {
    const result = spawnSync(
      process.execPath,
      [
        runner,
        "--task",
        "saas-landing-page@1.0.0",
        "--model",
        "fixture-no-change",
        "--attempt",
        "1",
      ],
      {
        cwd: path.resolve(BENCHMARK_ROOT, ".."),
        encoding: "utf8",
        env: { ...process.env, BENCHMARK_CODEX_RUNTIME: fakeCodex },
        timeout: 120_000,
        windowsHide: true,
      },
    );

    assert.equal(result.status, 1, result.stderr || result.stdout);
    const summary = JSON.parse(result.stdout);
    resultDirectory = summary.resultDirectory;

    assert.equal(summary.status, "failed");
    assert.equal(summary.functionalPassed, false);

    const metadata = JSON.parse(
      await fs.readFile(path.join(resultDirectory, "metadata.json"), "utf8"),
    );
    assert.equal(metadata.changeSet.passed, false);
    assert.equal(metadata.changeSet.minimumRequired, 1);
    assert.deepEqual(metadata.changeSet.changedPaths, []);
    assert.ok(metadata.acceptance.every((command) => command.exitCode === 0));
    assert.equal((await fs.readFile(path.join(resultDirectory, "changes.patch"), "utf8")), "");
  } finally {
    if (resultDirectory) {
      await fs.rm(resultDirectory, { recursive: true, force: true });
      const taskResults = path.dirname(resultDirectory);
      const remaining = await fs.readdir(taskResults).catch(() => []);
      if (remaining.length === 0) await fs.rm(taskResults, { recursive: true, force: true });
    }
  }
});
