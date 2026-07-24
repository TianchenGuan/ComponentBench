# Methodology

This document summarizes how ComponentBench was constructed. The full write-up appears in the paper (`ComponentBench: Diagnosing Component-Level Failures in Computer-Use Agents`).

## Ontology — 97 canonical types

We surveyed widely used React component libraries (Ant Design, MUI, Mantine) and consolidated overlapping primitives into a single ontology of **97 canonical types** organized into **14 interaction families**:

| Family | Examples |
|---|---|
| Command & Navigation | button, icon_button, tabs, pagination, breadcrumb, stepper |
| Disclosure & Progressive | accordion, collapsible_disclosure, carousel, window_splitter |
| Text Entry & Structured Field Input | text_input, password_input, masked_input, pin_input_otp |
| Discrete Choice | checkbox, radio_group, switch, segmented_control, rating |
| List-based Selection (Flat) | listbox_single, select_native, select_with_search, transfer_list |
| Combobox & Autocomplete | combobox_editable_single, autocomplete_restricted |
| Hierarchical Selection & Navigation | menu, context_menu, tree_view, tree_select, cascader |
| Continuous & High-Precision Input | slider_single, slider_range, meter, color_picker_2d, alpha_slider |
| Date & Time | date_picker_single, date_picker_range, datetime_picker_single |
| Overlays & Transient UI | dialog_modal, drawer, alert_dialog_confirm, tooltip, toast_snackbar |
| Structured Data Display | data_table_sortable, data_table_filterable, data_grid_editable |
| Files, Clipboard, Downloads | file_upload_button, file_dropzone, clipboard_copy |
| Drag/Drop & Workspace Interactions | drag_drop_sortable_list, kanban_board_drag_drop, resizable_columns |
| Advanced Editors | rich_text_editor, code_editor, markdown_editor, json_editor |

The mapping from canonical type to family and to per-library implementation lives in `data/metadata/canonical_components.csv`.

## Task generation

Each canonical type is instantiated as concrete tasks via **24 templates** (e.g. *activate*, *select_one*, *toggle_state*, *drag_operation*, *enter_formatted* — full list in `data/metadata/task_templates.csv`). Templates fix the goal pattern; the variant parameters (target value, distractor count, theme, density, etc.) vary across tasks.

For each (canonical type × library × template × variant), a Next.js page is generated that:
1. Renders the underlying component with controlled scene context.
2. Exposes a `#cb-success-banner` element that fires only when the canonical predicate is satisfied.

Tasks are stored as YAML (one task per record) and joined to the live site by `id`.

## Difficulty axes

Tasks are scored on **7 difficulty axes** (1–5 each):

1. **precision_requirement** — fine-grained spatial precision needed.
2. **target_acquisition** — how hard the target is to identify visually.
3. **density_choice_interference** — competing/lookalike elements.
4. **depth_layering** — multi-step disclosure (popovers, modals, drawers).
5. **feedback_dynamics** — timing/animation/transient feedback.
6. **semantic_observability** — whether internal state is visible from the screen.
7. **disambiguation_load** — selecting the right instance among many.

Aggregating these places each task in a tier (L0–L3) and bucket (easy / mid / hard).

A separate **realized difficulty audit** measures these axes from the rendered DOM and human traces, providing per-task feature values and aggregate axis scores. See `data/metadata/difficulty_axes.csv` and the Hugging Face dataset at `TianchenGuan/ComponentBench` for the audit outputs.

## Human reference trajectories

Annotators completed every task through the site's `/record` interface (a local version ships in this repo: `cd site && npm run record`). Mouse events, keystrokes, and DOM mutations were captured and normalized:

- Adjacent character-by-character typing was merged into single `type` actions so step counts are comparable with agents that paste in one step.
- The better of two recordings per task was kept (fewer normalized steps, then shorter duration).

Result: a near-optimal trajectory per task, available under `data/human_traces/`.

## Construction validity

- Programmatic predicates (not LLM judges) determine pass/fail.
- Semantic `data-*` attributes that could leak the answer are stripped from production HTML by `next.config.js` (preserved: `id`, `aria-*`, `data-cb`).
- The public `/api/tasks/[canonicalType]` route serves a sanitized version of each spec — answer keys are not exposed at runtime.
- Multiple observation modes use the same task set, so cross-mode differences are not confounded by task identity.
