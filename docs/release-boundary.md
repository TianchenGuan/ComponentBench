# Release Boundary

ComponentBench (this repository) is the **public, downstream artifact**. InterfaceGym is the **private, upstream platform** that generates and maintains it.

## What's in scope here

| Kind | Where |
|---|---|
| Task specifications | `data/releases/<version>/tasks_v{1,2}/` |
| Human reference trajectories | `data/releases/<version>/human_traces/` |
| Ontology + difficulty axes + task templates | `data/releases/<version>/metadata/` |
| Schemas | `schema/*.schema.json` |
| Benchmark runner (Python) | `benchmark/`, `scripts/run_benchmark.py`, `scripts/eval_*.sh`, `scripts/slurm/` |
| Agent configs and base prompts (public-safe) | `configs/` |
| Examples | `examples/minimal-runner/` |
| Documentation | `docs/`, this file |
| Published results | `results/public/` |
| License + citation | `LICENSE`, `CITATION.cff` |

## What's not in scope (and why)

| Kind | Lives in | Why it's not here |
|---|---|---|
| The interactive benchmark website | `interfacegym/apps/componentbench-web/` | Contains private Task Lab, log viewer, recording UIs, and auth. The public deploy is `componentbench.com`. |
| Task generation prompts / drafts | `interfacegym/` (TBD) | Internal authoring artifacts; would compromise integrity if exposed pre-release. |
| Recording UI source | `interfacegym/apps/componentbench-web/app/record/` | Internal annotation tooling. |
| Log viewer + auth | `interfacegym/apps/componentbench-web/app/logs/`, `/api/logs/` | Requires platform credentials. |
| Builder workers / moderation tooling | `interfacegym/` | Operational tooling, not part of the benchmark. |
| Secrets, env files | nowhere in source | Configured per deploy via env vars. |

## How releases get here

Releases flow **one-way** from InterfaceGym to this repository via `scripts/export-componentbench-release.mjs` (in InterfaceGym). That script:

1. Reads from `packages/componentbench-data/` (the upstream source-of-truth).
2. Copies into `data/releases/<version>/` here.
3. Writes a `data/releases/<version>/manifest.json` recording exactly what was copied and when.
4. Refuses to touch anything on its built-in deny-list (website code, TaskLab internals, private prompts, env files, internal docs).

## What this means for contributors

- **Bugs in tasks:** open an issue or PR here. Fixes land here first, then get reconciled upstream.
- **New tasks / new templates:** authored upstream in InterfaceGym (Task Lab), exported here as a new release.
- **Runner improvements:** PRs welcome here; they may also be ported into the upstream runner.
- **Site bugs:** report at https://www.interfacegym.com — those don't apply to this repo.

## Versioning

- The release directory name (`data/releases/0.5.0/`) is the source of truth for the data version.
- Schemas use a separate semver line in their `$id` if/when they evolve.
- Published results filename pattern: `<model>-<mode>-<version>.json` under `results/public/`.

## Editing this repository

- Do not hand-edit files under `data/releases/<version>/`. Update upstream and re-export.
- Schemas, docs, examples, and runner code can be edited here directly.
- Always run `python scripts/validate-release.py --version <v>` before opening a release-touching PR.
