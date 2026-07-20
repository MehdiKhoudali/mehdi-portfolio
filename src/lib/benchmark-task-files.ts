import { readFileSync } from "node:fs";
import path from "node:path";

export function readBenchmarkTaskBrief(taskId: string, version: string) {
  return readFileSync(
    path.join(process.cwd(), "benchmarks", "tasks", taskId, version, "brief.md"),
    "utf8",
  );
}
