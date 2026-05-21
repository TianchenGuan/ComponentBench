# Public Results

Drop one JSON or JSON-Lines file per (model, mode, version) here. Each row should conform to [`schema/result.schema.json`](../../schema/result.schema.json).

File-name convention: `<model>-<mode>-<version>.json`, e.g.

- `gpt-5.4-pixel-v1.json`
- `gemini-3-flash-ax_tree-v2.json`
- `ui-tars-1.5-7b-pixel-v1.json`

Include a short methods note alongside (model identifier, decoding settings, max_steps, anything non-default). PRs welcome.

The headline numbers in the paper / website come from results submitted here. See [`docs/evaluation-protocol.md`](../../docs/evaluation-protocol.md) for the reporting contract.
