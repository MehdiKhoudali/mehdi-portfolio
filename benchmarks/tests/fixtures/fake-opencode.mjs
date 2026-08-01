import { promises as fs } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

if (args.includes("--version")) {
  console.log("opencode fixture 1.0.0");
  process.exit(0);
}

if (args[0] === "providers" && args[1] === "list") {
  console.log("OpenCode Go api");
  process.exit(0);
}

if (args[0] === "models" && args[1] === "opencode-go") {
  console.log("opencode-go/fixture-model");
  process.exit(0);
}

if (args[0] === "run" && args.includes("--help")) {
  console.log("--format --model --agent --dir --file --title --variant");
  process.exit(0);
}

if (args[0] !== "run") {
  console.error(`Unexpected fake OpenCode invocation: ${args.join(" ")}`);
  process.exit(2);
}

const workspace = valueAfter("--dir");
const prompt = workspace
  ? await fs.readFile(path.join(workspace, "BENCHMARK_PROMPT.md"), "utf8")
  : "";

if (!workspace || !prompt.includes("Controlled coding task")) {
  console.error("Fake OpenCode did not receive the expected run contract");
  process.exit(3);
}

await fs.writeFile(
  path.join(workspace, "src", "App.jsx"),
  `export function App() {\n  return <main><h1>Relay OpenCode fixture build</h1></main>;\n}\n`,
);

console.log(JSON.stringify({ type: "session", sessionID: "fixture-opencode-session" }));
console.log(
  JSON.stringify({
    type: "step_finish",
    sessionID: "fixture-opencode-session",
    part: {
      tokens: { input: 120, output: 25, reasoning: 4, cache: { read: 20 } },
    },
  }),
);
console.log(
  JSON.stringify({
    type: "text",
    sessionID: "fixture-opencode-session",
    part: { type: "text", text: "Fixture OpenCode run completed successfully." },
  }),
);

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1];
}
