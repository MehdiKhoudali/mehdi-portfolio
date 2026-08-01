# Coding model field-test pipeline

This directory contains the repeatable runner behind the portfolio's coding-model task gallery. It runs a versioned task through either the locally authenticated Codex CLI or OpenCode Go and preserves the evidence needed to inspect the result.

The first task is `saas-landing-page@1.0.0`.

## What a run controls

Every run records and standardizes:

- exact task id, version, and SHA-256 package hash;
- exact model id, runner revision, reasoning profile, CLI version, and authentication mode;
- starter repository, detailed brief, installed dependencies, and protected files;
- setup, model, and acceptance-command time limits;
- attempt number and timestamps;
- the full model-visible prompt.

Each attempt starts in a fresh Git repository. The runner installs the locked dependencies before the selected coding agent starts and never repairs the result. Codex uses its workspace-write sandbox; OpenCode uses a locked project configuration with network, external-directory, subagent, and loop-recovery permissions denied.

## Prerequisites

- Node.js 18 or newer.
- Git.
- Codex CLI installed and authenticated (`codex login status`).
- A model id available to that Codex account.
- OpenCode CLI 1.18.5 or newer for OpenCode Go runs.
- An OpenCode Go API key connected through `/connect` in the OpenCode TUI.

The runner reuses the saved CLI authentication. It does not read, copy, or store authentication files.

## Commands

List task packages:

```powershell
npm run benchmark:list
```

Validate the complete plan without creating a workspace or invoking a model:

```powershell
npm run benchmark:dry-run
```

Run one real attempt:

```powershell
npm run benchmark:run -- --task saas-landing-page@1.0.0 --model <model-id> --attempt 1
```

Preview the fixed nine-run OpenCode Go matrix without invoking any model:

```powershell
npm run benchmark:plan:opencode
```

Run one OpenCode Go attempt (never retried automatically):

```powershell
npm run benchmark:run:opencode -- --task saas-landing-page@1.0.0 --model opencode-go/kimi-k3 --attempt 1
```

OpenCode runs use a project-local harness configuration that disables sharing, network tools, external-directory access, subagents, questions, and doom-loop recovery. The build agent is capped at 32 steps. OpenCode model variants are not inferred; pass `--effort <variant>` only when the selected model explicitly supports that variant. The harness declares a Kimi K3 `low` variant because Kimi defaults to `max` reasoning and OpenCode 1.18.10 does not yet include the provider's newer low/high presets in its catalog:

```powershell
npm run benchmark:run:opencode -- --task saas-landing-page@1.0.0 --model opencode-go/kimi-k3 --effort low --attempt 2
```

Override reasoning effort or the recorded timeout when a comparison protocol calls for it:

```powershell
npm run benchmark:run -- --task saas-landing-page@1.0.0 --model <model-id> --effort medium --attempt 1 --timeout-minutes 30
```

Preserve the temporary working repository for debugging:

```powershell
npm run benchmark:run -- --task saas-landing-page@1.0.0 --model <model-id> --attempt 1 --keep-workspace
```

Run the pipeline tests:

```powershell
npm run benchmark:test
```

## Evidence produced

Generated runs are kept locally under `benchmarks/results/<task>/<run-id>/` and are ignored by Git. A run can contain:

```text
metadata.json          Machine-readable run result and pass/fail state
run-plan.json          Inputs and execution plan resolved before the run
prompt.md              Exact model-visible task prompt
trace.jsonl            Full model-runner JSONL event stream
codex.stderr.log       Codex progress and diagnostic output (Codex runs)
opencode.stderr.log    OpenCode progress and diagnostic output (OpenCode runs)
final-message.md       Last model message
changes.patch          Binary-capable Git patch from the starter baseline
git-status.txt         Final working-tree status
setup/                 Dependency setup logs
acceptance/            Build and verification logs
source/                Final source without dependencies or build output
dist/                  Verified production build when one was produced
```

`functionalPassed` is true only when the selected coding agent exits normally, every acceptance command passes, the run does not time out, and no protected task file changes.
The task may also require a minimum number of source changes, including newly created files. This prevents an untouched, already-buildable starter from being recorded as a successful implementation.

## Fair-comparison protocol

- Use the same task version and runner commit for every compared model.
- Use the same reasoning effort where the models support it.
- Run at least three independent attempts per model.
- Do not manually repair failed outputs.
- Publish individual attempts, not only the strongest result.
- Treat build checks as objective evidence and keep visual/UX review separate.
- Record any CLI upgrade as a harness change; do not mix runner versions silently.

## Adding a task

Create `benchmarks/tasks/<task-id>/<version>/` containing:

- `task.json` — commands, protected paths, and limits;
- `brief.md` — the complete model-facing requirements;
- `starter/` — a locked, buildable Git baseline with `AGENTS.md`.

Changing any file changes the computed task hash. If published runs already use a package, create a new version instead of rewriting it in place.
