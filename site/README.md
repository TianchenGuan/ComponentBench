# ComponentBench v0.2

A component-level web benchmark for evaluating UI agents on common web interface patterns.

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Open http://localhost:3002
```

## Overview

ComponentBench provides a systematic benchmark for testing UI agents on 97 canonical component types across 14 families. Each component type has associated tasks that test different interaction patterns.

### Key Features

- **97 Canonical Component Types**: Comprehensive coverage of common UI patterns
- **14 Component Families**: Organized by interaction pattern
- **3 UI Libraries**: Ant Design, Material UI, and Mantine implementations
- **Factor-based Filtering**: 8 environmental factors for task variation
- **BrowserGym Integration**: Standardized success signaling for automation

## Factor System

Tasks can be filtered by 8 environmental factors:

| Factor | Values |
|--------|--------|
| E1: Theme | light, dark, high_contrast |
| E2: Spacing | comfortable, compact, condensed |
| E3: Layout | isolated_card, form_section, settings_panel, dashboard, table_cell, modal_flow, drawer_flow |
| E4: Placement | center, top_left, top_right, bottom_left, bottom_right |
| E5: Scale | default, small, large |
| E6: Instances | 1, 2, 3, 4 |
| E7: Guidance | text, visual, mixed |
| E8: Clutter | none, low, medium, high |

## Library Toggle

Switch between three UI library implementations:
- **antd**: Ant Design (default)
- **mui**: Material UI
- **mantine**: Mantine

## View Modes

ComponentBench supports two view modes:

- **Presentation mode** (`?view=presentation`): Full UI with navigation header, goal display, and expandable task details. Ideal for demos and manual testing.
- **Benchmark mode** (`?view=benchmark`): Clean UI with only the component rendered. Designed for BrowserGym agent testing with minimal visual clutter.

## Running Benchmarks

### Local Smoke Test

```bash
# Terminal 1: Start the site in production mode
export BENCHMARK_BUILD=1
npm run build
PORT=3002 npm run start

# Terminal 2: Run a smoke test (2 tasks)
cd ../..  # Go to InterfaceGym root
python scripts/run_componentbench_benchmark.py \
  --mode pixel \
  --canonical_types button \
  --libraries antd \
  --max_tasks 2 \
  --base_url http://127.0.0.1:3002 \
  --output_dir /tmp/cb_smoke
```

### Duke CS Cluster

Use the polite submission helper (max 2 nodes, waits if busy):

```bash
# From InterfaceGym root
bash scripts/submit_componentbench.sh

# Or with options
BENCHMARK_MODE=ax_tree BENCHMARK_MAX_TASKS=50 bash scripts/submit_componentbench.sh
```

The Slurm script automatically:
1. Builds the site in production mode (`BENCHMARK_BUILD=1`)
2. Starts vLLM with Qwen3-VL-235B (tensor-parallel=4)
3. Runs the benchmark with sharding support
4. Saves results to `/usr/project/xtmp/$USER/interfacegym-results/componentbench/`

See [docs/experiment_plan.md](../../docs/experiment_plan.md) for the full experiment matrix.

## Success Signaling

When a task is completed, the system signals success via:

1. `document.documentElement.dataset.taskDone = "true"`
2. `window.__COMPONENT_BENCH_TASK_DONE__ = true`
3. CustomEvent `componentbench:task-success` with `{ detail: { taskId } }`
4. Visual success banner with `id="cb-success-banner"` (detectable via `document.querySelector('#cb-success-banner')`)

## Benchmark Integrity

ComponentBench implements measures to prevent DOM-based agent cheating:

### API Sanitization

The `/api/tasks/[canonicalType]` endpoint returns sanitized task specs by default:
- Stripped fields: `success_trigger`, `negative_cases`, `expected_interaction_path`, `notes`
- These fields contain answer-key information that agents should not access

For local debugging, set the environment variable to get full specs:
```bash
COMPONENTBENCH_FULL_SPECS=1 npm run dev
```

### Data Attribute Stripping

Production builds automatically strip semantic `data-*` attributes:
- `data-testid`
- `data-task-id`
- `data-canonical-type`
- `data-library`
- `data-view-mode`
- `data-reference-id`

Preserved attributes: `id`, `data-cb`, all `aria-*` attributes.

## Performance

### Dynamic Import Runners

Task runners are loaded dynamically using `next/dynamic` with code-splitting by canonical type. This significantly reduces the initial JavaScript bundle size - only the runner needed for the current task is loaded.

The `RunnerMap` in `app/task/[taskId]/page.tsx` maps canonical types to dynamically imported runner components with `{ ssr: false }` to ensure client-side rendering.

## Adding New Components

### 1. Create Task YAML

Add a YAML file in `data/tasks_v1/{canonical_type}.yaml`:

```yaml
- id: {canonical_type}-{lib}-T01
  name: Task name
  canonical_type: {canonical_type}
  implementation_source: antd | mui | mantine
  browsergym_goal: Description of what to do
  scene_context:
    theme: light
    spacing: comfortable
    layout: isolated_card
    placement: center
    scale: default
    instances: 1
    guidance: text
    clutter: none
  # ... other fields
```

### 2. Create Task Runner

Add a runner in `src/runners/{CanonicalType}TaskRunner.tsx`.

### 3. Register in Task Page

Update `app/task/[taskId]/page.tsx` to handle the new canonical type.

### 4. Mark as Implemented

Update `src/registry/componentRegistry.ts` to include the type in `IMPLEMENTED_COMPONENTS`.

## Project Structure

```
sites/componentbench/
├── app/
│   ├── api/tasks/[canonicalType]/route.ts  # Task API
│   ├── task/[taskId]/page.tsx              # Task execution page
│   └── page.tsx                            # Dashboard
├── src/
│   ├── ontology/ontology.ts                # 14 families, 97 components
│   ├── registry/
│   │   ├── componentRegistry.ts            # Implementation status
│   │   └── taskRegistry.ts                 # Task loading/filtering
│   ├── runners/
│   │   └── ButtonTaskRunner.tsx            # Button task runner
│   ├── types/index.ts                      # TypeScript types
│   └── utils/
│       └── finishTask.ts                   # Success signaling
└── data/tasks_v1/
    └── button.yaml                         # Button tasks
```

## Canonical Component Types (97 total)

### 1. Command & Navigation (10)
| Type | Status |
|------|--------|
| button | ✅ Implemented |
| icon_button | ⬜ TODO |
| link | ⬜ TODO |
| menu_button | ⬜ TODO |
| split_button | ⬜ TODO |
| toolbar | ⬜ TODO |
| breadcrumb | ⬜ TODO |
| pagination | ⬜ TODO |
| stepper | ⬜ TODO |
| tabs | ⬜ TODO |

### 2. Disclosure & Progressive (5)
| Type | Status |
|------|--------|
| accordion | ⬜ TODO |
| collapsible_disclosure | ⬜ TODO |
| carousel | ⬜ TODO |
| feed_infinite_scroll | ⬜ TODO |
| window_splitter | ⬜ TODO |

### 3. Text Entry & Structured Field Input (10)
| Type | Status |
|------|--------|
| text_input | ⬜ TODO |
| textarea | ⬜ TODO |
| password_input | ⬜ TODO |
| search_input | ⬜ TODO |
| number_input_spinbutton | ⬜ TODO |
| masked_input | ⬜ TODO |
| pin_input_otp | ⬜ TODO |
| tags_input | ⬜ TODO |
| mentions_input | ⬜ TODO |
| inline_editable_text | ⬜ TODO |

### 4. Discrete Choice (9)
| Type | Status |
|------|--------|
| checkbox | ⬜ TODO |
| checkbox_tristate | ⬜ TODO |
| checkbox_group | ⬜ TODO |
| radio_group | ⬜ TODO |
| switch | ⬜ TODO |
| segmented_control | ⬜ TODO |
| toggle_button | ⬜ TODO |
| toggle_button_group_multi | ⬜ TODO |
| rating | ⬜ TODO |

### 5. List-based Selection (Flat) (7)
| Type | Status |
|------|--------|
| listbox_single | ⬜ TODO |
| listbox_multi | ⬜ TODO |
| select_native | ⬜ TODO |
| select_custom_single | ⬜ TODO |
| select_custom_multi | ⬜ TODO |
| select_with_search | ⬜ TODO |
| transfer_list | ⬜ TODO |

### 6. Combobox & Autocomplete (4)
| Type | Status |
|------|--------|
| combobox_editable_single | ⬜ TODO |
| combobox_editable_multi | ⬜ TODO |
| autocomplete_restricted | ⬜ TODO |
| autocomplete_freeform | ⬜ TODO |

### 7. Hierarchical Selection & Navigation (7)
| Type | Status |
|------|--------|
| menu | ⬜ TODO |
| menubar | ⬜ TODO |
| context_menu | ⬜ TODO |
| tree_view | ⬜ TODO |
| tree_select | ⬜ TODO |
| tree_grid | ⬜ TODO |
| cascader | ⬜ TODO |

### 8. Continuous & High-Precision Input (8)
| Type | Status |
|------|--------|
| slider_single | ⬜ TODO |
| slider_range | ⬜ TODO |
| meter | ⬜ TODO |
| progress_bar | ⬜ TODO |
| color_swatch_picker | ⬜ TODO |
| color_text_input | ⬜ TODO |
| color_picker_2d | ⬜ TODO |
| alpha_slider | ⬜ TODO |

### 9. Date & Time (8)
| Type | Status |
|------|--------|
| date_input_text | ⬜ TODO |
| date_picker_single | ⬜ TODO |
| date_picker_range | ⬜ TODO |
| time_input_text | ⬜ TODO |
| time_picker | ⬜ TODO |
| datetime_picker_single | ⬜ TODO |
| datetime_picker_range | ⬜ TODO |
| calendar_embedded | ⬜ TODO |

### 10. Overlays & Transient UI (9)
| Type | Status |
|------|--------|
| dialog_modal | ⬜ TODO |
| alert_dialog_confirm | ⬜ TODO |
| drawer | ⬜ TODO |
| popover | ⬜ TODO |
| tooltip | ⬜ TODO |
| hover_card | ⬜ TODO |
| toast_snackbar | ⬜ TODO |
| notification_center | ⬜ TODO |
| tour_teaching_tip | ⬜ TODO |

### 11. Structured Data Display (7)
| Type | Status |
|------|--------|
| table_static | ⬜ TODO |
| data_table_sortable | ⬜ TODO |
| data_table_filterable | ⬜ TODO |
| data_table_paginated | ⬜ TODO |
| data_grid_editable | ⬜ TODO |
| data_grid_row_selection | ⬜ TODO |
| virtual_list | ⬜ TODO |

### 12. Files, Clipboard, Downloads (5)
| Type | Status |
|------|--------|
| file_upload_button | ⬜ TODO |
| file_dropzone | ⬜ TODO |
| file_list_manager | ⬜ TODO |
| download_trigger | ⬜ TODO |
| clipboard_copy | ⬜ TODO |

### 13. Drag/Drop & Workspace Interactions (4)
| Type | Status |
|------|--------|
| drag_drop_sortable_list | ⬜ TODO |
| drag_drop_between_lists | ⬜ TODO |
| kanban_board_drag_drop | ⬜ TODO |
| resizable_columns | ⬜ TODO |

### 14. Advanced Editors (4)
| Type | Status |
|------|--------|
| rich_text_editor | ⬜ TODO |
| code_editor | ⬜ TODO |
| markdown_editor | ⬜ TODO |
| json_editor | ⬜ TODO |

## Task Templates

Each component type has recommended task templates:

| Template | Description |
|----------|-------------|
| activate | Click/press to trigger an action |
| navigate_to | Navigate to a specific destination |
| disclose | Expand/collapse disclosure |
| open_overlay | Open/close overlay |
| confirm_cancel | Respond to confirm dialog |
| toggle_state | Set boolean/tri-state |
| enter_text | Enter exact string |
| enter_formatted | Enter structured value |
| select_one | Select one option |
| select_many | Select multiple options |
| open_and_select | Open popup then select |
| search_and_select | Type to filter then select |
| set_scalar | Set numeric value |
| set_range | Set value range |
| match_reference | Match a reference state |
| clear_reset | Clear/reset state |
| hierarchical_path_select | Select via hierarchy |
| table_operation | Operate on table |
| file_upload | Upload file |
| file_manage | Manage files |
| drag_operation | Drag to reorder/move |
| editor_operation | Edit rich content |
| scroll_find | Scroll to find target |
| transfer_move | Move between containers |

## License

MIT
