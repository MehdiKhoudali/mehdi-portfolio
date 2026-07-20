export const DEFAULT_CONFIG = Object.freeze({
  seed: 2847,
  light: 0.72,
  algaeGrowth: 2.8,
  algaeCapacity: 180,
  grazerEnergyUse: 0.42,
  hunterEnergyUse: 0.56,
  reproductionCost: 32,
  mutationRate: 0.08,
  startGrazers: 18,
  startHunters: 5,
});

export const PRESETS = Object.freeze({
  balanced: { label: "Balanced Reef", values: {} },
  algaeBloom: { label: "Algae Bloom", values: { light: 0.92, algaeGrowth: 4.8, startGrazers: 22, startHunters: 4, seed: 9182 } },
  predatorSurge: { label: "Predator Surge", values: { algaeGrowth: 3.4, startGrazers: 26, startHunters: 12, hunterEnergyUse: 0.48, seed: 6731 } },
  coldCurrent: { label: "Cold Current", values: { light: 0.45, algaeGrowth: 1.65, grazerEnergyUse: 0.3, hunterEnergyUse: 0.4, seed: 4319 } },
  rapidEvolution: { label: "Rapid Evolution", values: { mutationRate: 0.28, reproductionCost: 25, startGrazers: 24, startHunters: 7, seed: 2501 } },
});

function makeRng(seed) {
  let state = (Number(seed) || 1) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createSimulation(initial = {}) {
  let config;
  let rng;
  let state;
  let nextId;
  let historyClock;

  function creature(kind, generation = 0, parents = []) {
    return {
      id: `${kind}-${nextId++}`,
      kind,
      age: 0,
      energy: kind === "grazer" ? 68 : 72,
      action: "wandering",
      speed: (kind === "grazer" ? 0.8 : 0.92) * (0.92 + rng() * 0.16),
      vision: (kind === "grazer" ? 0.58 : 0.7) * (0.92 + rng() * 0.16),
      generation,
      parents,
      x: rng() * 2 - 1,
      y: rng() * 2 - 1,
    };
  }

  function snapshot() {
    const creatures = [...state.grazers, ...state.hunters].map((item) => ({ ...item, parents: [...item.parents] }));
    return {
      time: state.time,
      algae: state.algae,
      grazers: state.grazers.length,
      hunters: state.hunters.length,
      creatures,
      history: state.history.map((point) => ({ ...point })),
      stats: { ...state.stats },
      config: { ...config },
    };
  }

  function reset(next = {}) {
    config = { ...DEFAULT_CONFIG, ...initial, ...next };
    config.seed = Math.max(1, Math.round(Number(config.seed) || DEFAULT_CONFIG.seed));
    rng = makeRng(config.seed);
    nextId = 1;
    historyClock = 0;
    state = {
      time: 0,
      algae: config.algaeCapacity * 0.62,
      grazers: [],
      hunters: [],
      history: [],
      stats: { algaeConsumed: 0, hunts: 0, births: 0, deaths: 0 },
    };
    for (let i = 0; i < config.startGrazers; i += 1) state.grazers.push(creature("grazer"));
    for (let i = 0; i < config.startHunters; i += 1) state.hunters.push(creature("hunter"));
    state.history.push({ time: 0, algae: state.algae, grazers: state.grazers.length, hunters: state.hunters.length });
    return snapshot();
  }

  function updateCreatures(list, kind, dt) {
    const births = [];
    const survivors = [];
    for (const item of list) {
      item.age += dt;
      item.energy -= (kind === "grazer" ? config.grazerEnergyUse : config.hunterEnergyUse) * dt;
      item.x = clamp(item.x + (rng() - 0.5) * item.speed * dt * 0.22, -1, 1);
      item.y = clamp(item.y + (rng() - 0.5) * item.speed * dt * 0.22, -1, 1);
      item.action = "wandering";

      if (kind === "grazer" && state.algae > 0.2 && item.energy < 82 && rng() < 0.24 * dt) {
        const bite = Math.min(state.algae, 2.8 + rng() * 2.2);
        state.algae -= bite;
        item.energy = Math.min(100, item.energy + bite * 3.4);
        state.stats.algaeConsumed += bite;
        item.action = "grazing";
      }

      if (kind === "hunter" && state.grazers.length && item.energy < 84 && rng() < 0.12 * dt) {
        const target = state.grazers[Math.floor(rng() * state.grazers.length)];
        target.energy -= 18;
        item.energy = Math.min(100, item.energy + 24);
        item.action = "hunting";
        target.action = "fleeing";
        state.stats.hunts += 1;
      }

      const threshold = kind === "grazer" ? 82 : 86;
      if (item.energy > threshold && list.length + births.length < 180 && rng() < 0.035 * dt) {
        item.energy -= config.reproductionCost;
        const child = creature(kind, item.generation + 1, [item.id]);
        child.x = item.x;
        child.y = item.y;
        births.push(child);
        state.stats.births += 1;
        item.action = "reproducing";
      }

      const lifespan = kind === "grazer" ? 230 : 280;
      if (item.energy > 0 && item.age < lifespan) survivors.push(item);
      else state.stats.deaths += 1;
    }
    return survivors.concat(births);
  }

  function step(dtSeconds = 0.25) {
    const dt = clamp(Number(dtSeconds) || 0.25, 0.01, 2);
    state.time += dt;
    state.algae = Math.min(config.algaeCapacity, state.algae + config.algaeGrowth * config.light * dt);
    state.grazers = updateCreatures(state.grazers, "grazer", dt).filter((item) => item.energy > 0);
    state.hunters = updateCreatures(state.hunters, "hunter", dt).filter((item) => item.energy > 0);
    historyClock += dt;
    if (historyClock >= 1) {
      historyClock -= 1;
      state.history.push({ time: state.time, algae: state.algae, grazers: state.grazers.length, hunters: state.hunters.length });
      if (state.history.length > 900) state.history.shift();
    }
    return snapshot();
  }

  function setConfig(next = {}) {
    config = { ...config, ...next };
    return snapshot();
  }

  reset();
  return { step, getSnapshot: snapshot, setConfig, reset };
}
