#!/usr/bin/env node

const tasks = [
  "saas-landing-page@1.0.0",
  "award-winning-creative-site@1.0.0",
  "pocket-reef-life-simulation@1.0.0",
  "project-command-center@1.0.0",
];

const models = [
  "opencode-go/grok-4.5",
  "opencode-go/kimi-k3",
  "opencode-go/glm-5.2",
  "opencode-go/deepseek-v4-pro",
  "opencode-go/deepseek-v4-flash",
];

const runs = tasks.flatMap((task) =>
  models.map((model) => ({
    task,
    model,
    attempt: 1,
    command: `npm run benchmark:run:opencode -- --task ${task} --model ${model} --attempt 1`,
  })),
);

console.log(
  JSON.stringify(
    {
      provider: "OpenCode Go",
      retryPolicy: "No automatic retries",
      runCount: runs.length,
      runs,
    },
    null,
    2,
  ),
);
