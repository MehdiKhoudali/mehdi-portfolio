# Design QA

- Source visual truth: `C:\Users\mehdi\AppData\Local\Temp\codex-clipboard-61f5e045-0dd6-45fd-9b45-a0e4895f1b79.png`
- Implementation screenshot: `C:\Users\mehdi\AppData\Local\Temp\benchmark-gpt-reasoning-selector-visible.png`
- Compare-all screenshot: `C:\Users\mehdi\AppData\Local\Temp\benchmark-model-selector-fixed-viewport.png`
- Combined comparison: `C:\Users\mehdi\AppData\Local\Temp\benchmark-model-selector-comparison.png`
- Source pixels: 1894 x 932, including Chrome UI; implementation pixels and CSS viewport: 1266 x 712 at device scale 1.
- State: SaaS landing-page task, desktop, Luna selected at Low reasoning; compare-all verified separately with six result panels.
- Density normalization: both captures were fit proportionally into equal 1052 x 690 comparison panels without stretching.

## Findings

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: the existing compact uppercase provider labels, model names, status labels, and task typography are preserved. The new `Reasoning` label follows the same optical size, weight, and tracking as the previous run-profile label.
- Spacing and layout rhythm: all six models share one horizontally scrollable strip. The reasoning control occupies the former profile-control area only for GPT models, so the existing Focus / Compare all alignment and border rhythm remain intact.
- Colors and visual tokens: selected tabs, selected reasoning, borders, text opacity, pass states, and black/off-white surfaces continue using the portfolio's established tokens.
- Image quality and asset fidelity: the benchmark builds are live HTML/CSS/JS previews rather than placeholder imagery. Their nested Vite assets now resolve relative to each published preview directory.
- Copy and content: OpenCode Go and GPT-5.6 provider labels are visible together. OpenCode models use `Default profile`; GPT models expose Low, Medium, and High reasoning only after selection.

## Full-view and Focused Evidence

- The combined comparison shows the reported state with three blank OpenCode frames beside the implementation with the unified model selector, contextual GPT reasoning, and a rendered build.
- The focused implementation capture keeps the selector and preview legible in one viewport, so no additional crop was required.
- The compare-all capture confirms the same selector contains Grok 4.5, Kimi K3, GLM 5.2, Luna, Terra, and Sol; six top-level comparison panels are rendered.

## Comparison History

1. Initial source: all OpenCode preview frames were blank because generated entry files requested `/assets/...` from the site root.
   - Fix: the revision-locked publisher now rewrites generated asset references to `./assets/...` while publishing.
   - Post-fix evidence: the Grok build renders inside the task page, and all seven published OpenCode entry assets return HTTP 200.
2. Initial source: only the three OpenCode models were visible while a global Default / Low / Medium / High selector swapped the entire model group.
   - Fix: all six models now remain in one list. Selecting Luna, Terra, or Sol reveals Low / Medium / High; selecting an OpenCode model hides reasoning and restores its Default result.
   - Post-fix evidence: browser interaction checks passed for Luna selection, Low reasoning, returning to Grok, and Compare all with six panels.

## Interaction and Runtime Checks

- OpenCode selection hides the reasoning control.
- GPT selection reveals the reasoning control and defaults to Medium unless the user already chose another reasoning level.
- Low / Medium / High switches the selected GPT preview and evidence.
- Compare all renders six model panels, using Default for OpenCode and the chosen reasoning level for GPT.
- Seven published OpenCode previews and their entry JavaScript assets return HTTP 200.
- No application-attributed console errors were recorded; the browser harness emitted an unscoped MutationObserver warning.
- `npm run lint` passed.
- `npm run build` passed.

final result: passed
