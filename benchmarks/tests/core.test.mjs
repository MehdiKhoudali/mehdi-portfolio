import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCodexArgs,
  buildOpenCodeArgs,
  createRunId,
  detectExecCapabilities,
  finalMessageFromOpenCodeJsonl,
  listTasks,
  loadTask,
  parseArgs,
  usageFromJsonl,
  usageFromOpenCodeJsonl,
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
      id: "design-canvas",
      title: "Mini design canvas from a detailed brief",
      version: "1.0.0",
    },
    {
      id: "pocket-reef-life-simulation",
      title: "Pocket Reef life simulation from a detailed brief",
      version: "1.0.0",
    },
    {
      id: "project-command-center",
      title: "Project command center from a detailed brief",
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

test("builds a non-interactive OpenCode invocation", () => {
  assert.deepEqual(
    buildOpenCodeArgs({
      model: "opencode-go/kimi-k3",
      variant: null,
      workspace: "C:/work",
      runId: "test-run",
    }),
    [
      "run",
      "--format",
      "json",
      "--model",
      "opencode-go/kimi-k3",
      "--agent",
      "build",
      "--dir",
      "C:/work",
      "--title",
      "test-run",
      "Read BENCHMARK_PROMPT.md and follow the complete controlled coding-task instructions exactly. Work autonomously, make the required source changes, verify the build, and then stop.",
    ],
  );
});

test("reads OpenCode JSON events without assuming one provider schema", () => {
  const trace = [
    '{"type":"session","sessionID":"session-1"}',
    '{"type":"step_finish","part":{"tokens":{"input":100,"output":20,"reasoning":3,"cache":{"read":40}}}}',
    '{"type":"text","part":{"type":"text","text":"Done."}}',
  ].join("\n");

  assert.deepEqual(usageFromOpenCodeJsonl(trace), {
    events: { session: 1, step_finish: 1, text: 1 },
    sessionId: "session-1",
    usage: {
      input_tokens: 100,
      cached_input_tokens: 40,
      output_tokens: 20,
      reasoning_output_tokens: 3,
    },
  });
  assert.equal(finalMessageFromOpenCodeJsonl(trace), "Done.");
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
