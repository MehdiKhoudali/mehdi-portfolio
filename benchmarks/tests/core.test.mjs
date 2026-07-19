import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCodexArgs,
  createRunId,
  detectExecCapabilities,
  listTasks,
  loadTask,
  parseArgs,
  usageFromJsonl,
} from "../lib/core.mjs";

test("parses a benchmark run request", () => {
  assert.deepEqual(
    parseArgs([
      "--task",
      "saas-landing-page@1.0.0",
      "--model",
      "gpt-example",
      "--effort",
      "high",
      "--attempt",
      "2",
      "--dry-run",
    ]),
    {
      attempt: 2,
      dryRun: true,
      effort: "high",
      keepWorkspace: false,
      list: false,
      model: "gpt-example",
      task: "saas-landing-page@1.0.0",
    },
  );
});

test("loads, hashes, and lists the task packages", async () => {
  const task = await loadTask("saas-landing-page@1.0.0");
  assert.equal(task.id, "saas-landing-page");
  assert.equal(task.version, "1.0.0");
  assert.match(task.brief, /Relay/);
  assert.match(task.taskHash, /^[a-f0-9]{64}$/);

  const tasks = await listTasks();
  assert.deepEqual(tasks, [
    {
      id: "award-winning-creative-site",
      title: "Award-winning creative site from a detailed brief",
      version: "1.0.0",
    },
    {
      id: "pocket-reef-life-simulation",
      title: "Pocket Reef life simulation from a detailed brief",
      version: "1.0.0",
    },
    {
      id: "saas-landing-page",
      title: "SaaS landing page from a detailed brief",
      version: "1.0.0",
    },
  ]);
});

test("builds capability-aware Codex arguments", () => {
  assert.deepEqual(
    buildCodexArgs({
      model: "gpt-example",
      effort: "medium",
      workspace: "C:/work",
      finalMessagePath: "C:/result/final.md",
      capabilities: {
        ephemeral: true,
        ignoreRules: true,
        ignoreUserConfig: true,
      },
      platform: "win32",
    }),
    [
      "exec",
      "--json",
      "--model",
      "gpt-example",
      "--sandbox",
      "workspace-write",
      "--ignore-user-config",
      "--ignore-rules",
      "--ephemeral",
      "-c",
      'approval_policy="never"',
      "-c",
      'windows.sandbox="unelevated"',
      "-c",
      'model_reasoning_effort="medium"',
      "-C",
      "C:/work",
      "--output-last-message",
      "C:/result/final.md",
      "-",
    ],
  );
});

test("detects optional flags from the installed CLI help", () => {
  assert.deepEqual(detectExecCapabilities("--ephemeral --ignore-user-config"), {
    ephemeral: true,
    ignoreRules: false,
    ignoreUserConfig: true,
  });
});

test("creates stable run ids and reads JSONL usage", () => {
  const runId = createRunId({
    taskId: "task",
    version: "1.0.0",
    model: "GPT Example",
    attempt: 3,
    date: new Date("2026-07-19T12:34:56.000Z"),
  });
  assert.equal(runId, "task__1.0.0__gpt-example__attempt-3__2026-07-19T12-34-56-000Z");

  assert.deepEqual(
    usageFromJsonl(
      [
        '{"type":"thread.started","thread_id":"thread-1"}',
        '{"type":"turn.started"}',
        '{"type":"turn.completed","usage":{"input_tokens":100,"output_tokens":20}}',
      ].join("\n"),
    ),
    {
      events: {
        "thread.started": 1,
        "turn.completed": 1,
        "turn.started": 1,
      },
      threadId: "thread-1",
      usage: { input_tokens: 100, output_tokens: 20 },
    },
  );
});
