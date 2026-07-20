import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PRESETS, createSimulation } from "../src/simulation.js";

const dist = path.resolve("dist");
const index = await fs.readFile(path.join(dist, "index.html"), "utf8");
const assets = await fs.readdir(path.join(dist, "assets"));

assert.ok(index.includes('<div id="root"></div>'), "production HTML is missing the React root");
assert.ok(assets.some((file) => file.endsWith(".js")), "production build is missing JavaScript");
assert.ok(assets.some((file) => file.endsWith(".css")), "production build is missing CSS");
assert.deepEqual(Object.keys(PRESETS), ["balanced", "algaeBloom", "predatorSurge", "coldCurrent", "rapidEvolution"]);

function run(values = {}, seconds = 420) {
  const simulation = createSimulation(values);
  for (let index = 0; index < seconds * 4; index += 1) simulation.step(0.25);
  return simulation.getSnapshot();
}

const replayA = run({ ...PRESETS.balanced.values, seed: 4455 });
const replayB = run({ ...PRESETS.balanced.values, seed: 4455 });
assert.deepEqual(replayA.history, replayB.history, "same seed and settings must reproduce identical history");
assert.deepEqual(replayA.stats, replayB.stats, "same seed and settings must reproduce identical events");

for (const preset of Object.values(PRESETS)) {
  const result = run(preset.values);
  assert.ok(result.history.length >= 400, `${preset.label}: expected recorded history`);
  assert.ok(Number.isFinite(result.algae) && result.algae >= 0, `${preset.label}: algae must stay finite and non-negative`);
  assert.ok(result.grazers >= 0 && result.grazers <= 200, `${preset.label}: grazers must remain bounded`);
  assert.ok(result.hunters >= 0 && result.hunters <= 200, `${preset.label}: hunters must remain bounded`);
  assert.ok(result.creatures.every((creature) => Number.isFinite(creature.energy) && Number.isFinite(creature.age)), `${preset.label}: creature state must stay finite`);
}

assert.ok(replayA.stats.algaeConsumed > 0, "balanced reef must record real grazing events");
assert.ok(replayA.stats.hunts > 0, "balanced reef must record real hunting events");
assert.ok(replayA.stats.births > 0, "balanced reef must record reproduction");

console.log("Verified production artifacts and deterministic Pocket Reef simulation behavior.");
