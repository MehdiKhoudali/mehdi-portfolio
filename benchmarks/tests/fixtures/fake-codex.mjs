import { promises as fs } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

if (args.includes("--version")) {
  console.log("codex-cli fixture");
  process.exit(0);
}

if (args[0] === "login" && args[1] === "status") {
  console.log("Logged in using test fixture");
  process.exit(0);
}

if (args[0] === "exec" && args.includes("--help")) {
  console.log("--json --model --sandbox --cd --output-last-message");
  process.exit(0);
}

if (args[0] !== "exec") {
  console.error(`Unexpected fake Codex invocation: ${args.join(" ")}`);
  process.exit(2);
}

const workspace = valueAfter("-C");
const finalMessagePath = valueAfter("--output-last-message");
let prompt = "";
for await (const chunk of process.stdin) prompt += chunk;

if (!workspace || !finalMessagePath || !prompt.includes("Controlled coding task")) {
  console.error("Fake Codex did not receive the expected run contract");
  process.exit(3);
}

await fs.writeFile(
  path.join(workspace, "src", "App.jsx"),
  `export function App() {\n  return <main><h1>Relay fixture build</h1></main>;\n}\n`,
);
await fs.writeFile(finalMessagePath, "Fixture run completed successfully.\n");

console.log(JSON.stringify({ type: "thread.started", thread_id: "fixture-thread" }));
console.log(JSON.stringify({ type: "turn.started" }));
console.log(
  JSON.stringify({
    type: "turn.completed",
    usage: {
      input_tokens: 100,
      cached_input_tokens: 0,
      output_tokens: 20,
      reasoning_output_tokens: 5,
    },
  }),
);

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1];
}
