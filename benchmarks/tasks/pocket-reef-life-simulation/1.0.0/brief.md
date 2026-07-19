# Pocket Reef — life simulation benchmark

Build a polished browser-based living ecosystem called **Pocket Reef**. It should feel like a beautiful observation toy: a miniature underwater world whose inhabitants move, feed, reproduce, age, and die according to a real deterministic simulation.

The central question is: **Can you make a small world feel genuinely alive?**

## Product direction

- Product name: **Pocket Reef**
- Editorial line: **A world in one tide.**
- Supporting copy: **Tune the current. Watch life answer.**
- The experience is observational rather than score-driven. The player changes environmental conditions and watches stories emerge.
- Aim for a distinctive, portfolio-quality interface—not a generic admin dashboard or a conventional pixel game.

## The living world

Present the reef as a contained miniature habitat: a round tank, glass dish, cutaway reef, or similarly legible diorama. It can use DOM, SVG, Canvas, or a combination, but it must remain self-contained.

The ecosystem contains three visible layers:

1. **Algae and reef growth** absorb light and provide food.
2. **Luminous grazers** consume algae, move in groups, reproduce, age, and flee danger.
3. **Hunters** pursue grazers, gain energy through successful hunts, reproduce, age, and decline when prey becomes scarce.

Creatures should visibly choose actions such as grazing, wandering, schooling, hunting, fleeing, resting, or reproducing. Use motion and small feedback moments—pulses, trails, bubbles, feeding pauses, offspring emergence, fading, or light changes—to communicate cause and effect.

## Supplied simulation foundation

`src/simulation.js` contains a deterministic seeded foundation and the public engine contract used by verification. You may improve or replace its internal behavior, but preserve these exports and shapes:

- `DEFAULT_CONFIG`
- `PRESETS`
- `createSimulation(config)`
- The returned object must expose `step(dtSeconds)`, `getSnapshot()`, `setConfig(next)`, and `reset(next)`.
- A snapshot must include `time`, `algae`, `grazers`, `hunters`, `creatures`, `history`, `stats`, and `config`.

The interface and charts must use this live simulation state. Do not draw invented population curves or disconnected decorative creatures.

## Required controls

- Play and pause
- Single-step
- Reset
- Randomize seed
- Simulation speed: 1×, 2×, 4×, and 8×
- Five presets: **Balanced Reef**, **Algae Bloom**, **Predator Surge**, **Cold Current**, and **Rapid Evolution**
- Adjustable light level, algae growth, grazer energy use, hunter energy use, reproduction cost, mutation rate, starting grazers, starting hunters, and random seed
- Changing a control or preset must clearly affect the running or reset simulation

## Observation and data

- Clicking or selecting a creature opens an inspector with its species, age, energy, current action, speed, vision, generation, and parent information.
- Show a live event stream with meaningful events such as feeding, hunting, births, deaths, population pressure, or extinction.
- Show a real recorded timeline for algae, grazers, and hunters.
- Include at least one additional analytical view: a grazer-versus-hunter phase plot, trait trend, generational family view, or ecosystem summary.
- Provide a concise dynamic interpretation such as “Grazers expanded after the algae bloom” or “Hunters declined after prey became scarce.”

## Simulation expectations

- The same seed and settings must produce the same history.
- Moving and waiting consume energy.
- Feeding or hunting restores energy.
- Reproduction consumes stored energy; populations cannot grow for free.
- Algae returns over time rather than instantly.
- Creatures have finite lifetimes.
- Populations remain bounded and can decline or become extinct.
- Balanced settings should produce ongoing activity across all three layers rather than immediate collapse.
- Presets should create meaningfully different outcomes.

## Visual and interaction quality

- Make the world the visual focus, with the controls and data supporting it.
- Create an original reef identity using only code-generated shapes, gradients, textures, particles, typography, and icons.
- Include a day/light or current atmosphere that visibly responds to settings or simulation time.
- Provide polished hover, selected, paused, running, birth, death, and empty states.
- Support `prefers-reduced-motion` without hiding important state changes.
- All controls must be keyboard accessible with visible focus states.

## Responsive requirements

- **390px:** the habitat remains playable and controls remain reachable without horizontal page scrolling.
- **768px:** reorganize the inspector, charts, and controls coherently.
- **1440px:** use the full canvas intentionally without leaving the simulation feeling lost in empty space.

## Technical constraints

- Use the supplied React/Vite starter and installed dependencies only.
- Do not use the network, external images, external fonts, APIs, CDNs, or newly installed packages.
- Keep all content and functionality inside the repository.
- Preserve the protected benchmark files.
- `npm run build` and `npm run verify` must pass.

## Completion standard

Deliver a complete, responsive, interactive life simulation—not a static concept, mockup, or collection of counters. Prioritize believable emergent behavior, understandable cause and effect, charming animation, and a coherent observation experience.
