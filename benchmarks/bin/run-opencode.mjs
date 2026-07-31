#!/usr/bin/env node

process.env.BENCHMARK_ENGINE = "opencode";
await import("./run.mjs");
