# Methodology

This document summarizes how ComponentBench was constructed. The full write-up appears in the paper (`ComponentBench: Diagnosing Component-Level Failures in Computer-Use Agents`).

## Ontology — 97 canonical types

We surveyed widely used React component libraries (Ant Design, MUI, Mantine) and consolidated overlapping primitives into a single ontology of **97 canonical types** organized into **14 interaction families**:

| Family | Examples |
|---|---|
| Buttons & triggers | button, icon_button, toggle, segmented_control |
| Selection | checkbox, radio, switch, select, combobox |
| Text input | text_input, password_input, number_input, autocomplete |
| Date/time | date_picker_single, date_picker_range, datetime_picker |
| Navigation | breadcrumb, tabs, pagination, stepper |
| Disclosure | accordion, collapsible_disclosure, popover, tooltip |
| Tables & grids | data_table_sortable, data_table_paginated, data_grid_editable |
| Trees | tree_view, tree_select, cascader |
| Drag & drop | drag_drop_sortable_list, drag_drop_between_lists, kanban_card |
| Continuous precision | slider, range_slider, color_picker_2d, alpha_slider |
| Overlays | dialog_modal, drawer, alert_dialog_confirm, context_menu |
| Upload | dropzone, file_input |
| Rich editors | code_editor, json_editor, rich_text_editor, markdown |
| Composite | wizard, settings_panel, search_filters |

The mapping from canonical type to family and to per-library implementation lives in `data/releases/<version>/metadata/canonical_components.csv`.

## Task generation

Each canonical type is instantiated as concrete tasks via **24 templates** (e.g. *activate*, *select_value*, *toggle_set*, *reorder*, *fill_form*). Templates fix the goal pattern; the variant parameters (target value, distractor count, theme, density, etc.) vary across tasks.

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

A separate **realized difficulty audit** measures these axes from the rendered DOM and human traces, providing per-task feature values and aggregate axis scores. See `data/releases/<version>/metadata/difficulty_axes.csv` and the Hugging Face dataset at `TianchenGuan/ComponentBench` for the audit outputs.

## Human reference trajectories

Annotators completed every task through the site's `/record` interface (in the private platform repo). Mouse events, keystrokes, and DOM mutations were captured and normalized:

- Adjacent character-by-character typing was merged into single `type` actions so step counts are comparable with agents that paste in one step.
- The better of two recordings per task was kept (fewer normalized steps, then shorter duration).

Result: a near-optimal trajectory per task, available under `data/releases/<version>/human_traces/`.

## Construction validity

- Programmatic predicates (not LLM judges) determine pass/fail.
- Semantic `data-*` attributes that could leak the answer are stripped from production HTML by `next.config.js` (preserved: `id`, `aria-*`, `data-cb`).
- The public `/api/tasks/[canonicalType]` route serves a sanitized version of each spec — answer keys are not exposed at runtime.
- Multiple observation modes use the same task set, so cross-mode differences are not confounded by task identity.
