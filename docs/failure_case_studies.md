# ComponentBench — Mechanistic Failure Case Studies

*Trace-grounded failure taxonomy with aggregate evidence and 20 representative case studies, released alongside the benchmark (see the camera-ready paper's failure-analysis section). Built on the per-task and per-component diagnostic reports the benchmark already produces — not a new benchmark.*

## How to resolve trace pointers

Every case study below ends with a *Trace* pointer of the form

```
<tar on the HF dataset>  ->  <episode directory inside the tar>
```

The tars live in the [Hugging Face dataset](https://huggingface.co/datasets/TianchenGuan/ComponentBench) under `runs/` (full episodes incl. screenshots) and `runs_lite/` (same episodes, JSON/text only). Entries inside each tar are prefixed with `<model>/<mode>/` (e.g. `gpt-5.4-mini/pixel/`); the pointer below is the path after that prefix. Each episode directory contains `experiment.log`, `raw_response_step_*.txt` (the agent's thinking + action per step), `screenshot_step_*.png` (in `runs/` only), and `summary_info.json` (reward, steps, termination reason).

The adversarial verification workflow that re-checked each case is released as [`docs/case_study_workflow.js`](case_study_workflow.js).

## Scope & method

- **Data:** 5 agent models × 4 observation/action modes (Pixel, SoM, AX-tree, Browser-Use) × 2,910 v1 tasks = 50,764 agent runs, plus the cleaned human reference run and the per-trace (Layer-2) / per-component (Layer-3) diagnostic reports.
- **Two independent failure labelings, reported side by side:**
  1. *Deterministic trace-feature taxonomy* over **all 5 models** (8,864 failed pixel/SoM/AX-tree traces): each failed trace is parsed into its action sequence and assigned the most specific component/task mechanism, refined by trace features (drag emitted?, interacted-with-control?, repeated-coordinate?, typed-value?). Component-driven prior refined by evidence.
  2. *Layer-2 LLM labels* (a strong LLM read every trace for **gemini-3.1-flash-lite**, 2,752 failure run-observations): we map its `primary_failure_family` + `secondary_failure_tags` onto the same 9 categories.
- **Honesty guardrails:** a no-progress *loop* is treated as a co-occurring **symptom**, not a root cause; cases that look like benchmark artifacts are labelled as such; anything the trace does not support is `other_or_unclear`.

## 1. Failure taxonomy (aggregate counts)

| Category | Deterministic (5 models, n=8,864) | Layer-2 (gemini-flash-lite, n=2,752) |
|---|--:|--:|
| target_acquisition_or_wrong_instance | 994 (11.2%) | 871 (31.6%) |
| continuous_calibration_error | 1790 (20.2%) | — |
| drag_execution_failure | 383 (4.3%) | — |
| transient_state_loss | 1767 (19.9%) | 414 (15.0%) |
| missing_commit_or_confirmation | 1024 (11.6%) | 550 (20.0%) |
| widget_specific_procedure_missing | 847 (9.6%) | 662 (24.1%) |
| repetition_or_no_progress_loop | 996 (11.2%) | 155 (5.6%) |
| semantic_value_error | 319 (3.6%) | 92 (3.3%) |
| other_or_unclear | 744 (8.4%) | 8 (0.3%) |

- **Both methods agree on the dominant mechanisms**: continuous calibration, transient-state loss, target acquisition / wrong-instance, and missing widget-specific procedure together account for the majority of failures in each labeling. They differ in proportions (deterministic is component-driven across 5 models; Layer-2 is an LLM read of one model), but the *ranking of big buckets* is consistent.
- **Looping is a symptom, not a root cause:** 55.8% of all failed traces end in a repeated-action no-progress loop, but that loop is distributed across every mechanism (≈48–67% within each category) — agents loop *because* they are stuck on the underlying component mechanism. We therefore report looping as a co-occurring flag and reserve the `repetition_or_no_progress_loop` root category for the minority of cases with no component-specific signal.

## 2. Aggregate failure table (by component family)

| Family | n | Pass% | Fail% | Median steps (succ) | Timeout% | Human median steps |
|---|--:|--:|--:|--:|--:|--:|
| dragdrop_workspace | 2040 | 47.6 | 52.4 | 2.0 | 40.8 | 1.0 |
| continuous_precision | 4271 | 62.4 | 37.6 | 3 | 29.9 | 2 |
| advanced_editors | 2100 | 64.3 | 35.7 | 3.0 | 23.6 | 3.0 |
| datetime | 4140 | 72.1 | 27.9 | 3 | 20.6 | 3.0 |
| structured_data | 3684 | 75.6 | 24.4 | 3 | 17.2 | 3.0 |
| disclosure_progressive | 2730 | 76.4 | 23.6 | 2.0 | 18.9 | 1.0 |
| list_selection | 3570 | 77.9 | 22.1 | 3 | 16.4 | 2.0 |
| hierarchical_navigation | 3659 | 82.9 | 17.1 | 3 | 13.2 | 2 |
| combobox_autocomplete | 2220 | 83.9 | 16.1 | 2.0 | 11.4 | 2.0 |
| text_entry | 5100 | 85.1 | 14.9 | 3 | 9.2 | 3.0 |
| files_clipboard | 2610 | 85.5 | 14.5 | 2.0 | 11.6 | 2.0 |
| discrete_choice | 4770 | 87.2 | 12.8 | 2 | 8.3 | 1.0 |
| overlays_transient | 4650 | 90.9 | 9.1 | 2 | 7.0 | 1.0 |
| command_navigation | 5220 | 92.8 | 7.2 | 2 | 5.5 | 1.0 |

- **Spatial-manipulation and drag families fail most**: `dragdrop_workspace` and `continuous_precision` are the two worst, followed by `advanced_editors` — yet humans solve these in a median of 1–2 steps.

## 3. Human-easy / agent-hard (human ≤ 2 steps, agent pass < 60%)

These are the strongest diagnostic cases: trivial for humans, hard for agents.

| Component | Mode | Human median steps | n | Agent pass% |
|---|---|--:|--:|--:|
| select_native | pixel | 1.0 | 120 | 0.0 |
| window_splitter | som | 0.5 | 120 | 6.7 |
| resizable_columns | ax_tree | 1.0 | 120 | 10.0 |
| kanban_board_drag_drop | som | 1.0 | 120 | 15.0 |
| resizable_columns | som | 1.0 | 120 | 16.7 |
| kanban_board_drag_drop | browser_use | 1.0 | 150 | 26.7 |
| slider_range | som | 1.0 | 120 | 26.7 |
| resizable_columns | pixel | 1.0 | 120 | 31.7 |
| drag_drop_sortable_list | browser_use | 1.0 | 150 | 32.0 |
| alpha_slider | som | 1.0 | 150 | 32.0 |
| meter | som | 1.0 | 120 | 32.5 |
| meter | ax_tree | 1.0 | 120 | 34.2 |
| drag_drop_between_lists | browser_use | 1.0 | 150 | 36.7 |
| color_picker_2d | ax_tree | 2.0 | 150 | 41.3 |
| resizable_columns | browser_use | 1.0 | 150 | 41.3 |
| color_picker_2d | pixel | 2.0 | 120 | 44.2 |
| context_menu | pixel | 1.0 | 120 | 45.0 |
| slider_range | ax_tree | 1.0 | 120 | 45.8 |

- 35 component×mode cells qualify. Spatial manipulation (`window_splitter`, `resizable_columns`, sliders, `meter`, `color_picker_2d`) and drag (`kanban_board_drag_drop`, `drag_drop_*`) dominate the list — humans finish in ≤1–2 steps; agents fail 60–100% of the time.

## 4. Clutter sensitivity

| Mode | none | low | medium | high | drop (none→high) |
|---|--:|--:|--:|--:|--:|
| pixel | 71.6 | 70.3 | 56.9 | 54.5 | +17.1 pp |
| som | 78.6 | 79.4 | 67.5 | 67.1 | +11.5 pp |
| ax_tree | 80.6 | 82.0 | 80.3 | 77.0 | +3.6 pp |
| browser_use | 89.2 | 89.6 | 88.3 | 89.1 | +0.1 pp |

- **Clutter sensitivity is ordered by reliance on visual grounding:** pixel degrades most (none→high), then SoM, then AX-tree; **Browser-Use is essentially clutter-immune** (flat ~89%) because it acts on DOM elements rather than pixels. This is a mechanistic explanation of clutter sensitivity: clutter hurts *grounding*, so it hurts the modes that must visually locate the target, and it manifests as `target_acquisition_or_wrong_instance` and `small_target` failures.

## 5. Mode-specific mechanisms

**Drag/drop pass rate by mode** (Browser-Use's element API has no real drag affordance):

| Component | pixel | som | ax_tree | browser_use |
|---|--:|--:|--:|--:|
| drag_drop_between_lists | 63.3 | 45.8 | 86.7 | 36.7 |
| drag_drop_sortable_list | 65.0 | 49.2 | 92.5 | 32.0 |
| kanban_board_drag_drop | 69.2 | 15.0 | 94.2 | 26.7 |

- **Browser-Use is weak on drag/drop** (element-based action space lacks a faithful drag), whereas it is strongest on clutter and overlay tasks. **Pixel is weak under clutter and on small targets.** **Native-select** is a click-vs-semantic split: AX-tree sets the value directly while pixel/SoM click-modes often fail to commit the native control (also a candidate benchmark-fairness note).

## 6. The 20 case studies (trace-grounded)

Each case below was produced by reading the actual trace (action log + screenshots) and the existing Layer-2 diagnosis, then **independently re-checked by an adversarial verifier** that re-opened the same evidence. Of 20 cases, 15 were confirmed as labelled and 5 were relabelled by the verifier — we report the **verifier-corrected** category and keep the disagreement visible, because the corrections are themselves instructive about mechanism.

### Spatial manipulation

**`alpha_slider-antd-T01`** · alpha_slider (antd, easy/L0) · gpt-5.4-mini / pixel

- *Final category:* **repetition_or_no_progress_loop** [⚠ verifier-corrected (agent proposed `continuous_calibration_error`)]
- *Instruction:* Set overlay opacity to 80% · *Human steps:* 1
- *Agent trace:* Step 0 clicks the '100%' opacity control, opening the AntD ColorPicker popover (alpha slider track + numeric '%' field both visible). From step 1 onward the agent repeatedly clicks on the checkered alpha-slider TRACK (x~882 then x~979, y~366-395) trying to reach 80%. The value oscillates rather than converges: 62% at step 10, 53% at the final frame. The numeric '%' input shown right there is never used to type 80; the agent loops click-on-track until the 20-step limit.
- *Verifier signal:* truncated at 20 steps; cum_reward=0.0 (final opacity 53%, target 80%)
- *Mechanism:* The opacity lives inside a composite AntD ColorPicker with both an alpha-slider track and a numeric percent field; the agent tries to set 80% by clicking points on the thin alpha track, but each click x-position maps imprecisely to alpha so the value bounces (62% at step 10, 53% at the end) and never lands within tolerance of 80%. The screenshots show the checkered track being clicked rather than the percent input being typed, and the agent never converges. Layer-2 corroborates: the pixel run shows 'confusion about which subcontrol governs opacity ... misunderstanding the composite widget under pixel-only observation, compounded by small target precision,' whereas the DOM/browser_use mode succeeds by typing into the exposed numeric opacity field.
- *Adversarial re-check:* The numbers (62% at step 10, 53% at end) and open-picker screenshots are real, but the mechanism is misattributed: after one alpha-track click (100->69 at step 1) the agent clicks the numeric percent-field DOWN-spinner at (979,395) 12 identical + ~6 near-identical times, ratcheting the value monotonically downward in the wrong direction (it even verbalizes "stepped down by 1% each time") rather than bouncing on the alpha track or typing, never changing strategy; hex stays 1677FF with no color corruption, so this is a no-progress loop on a discrete spinner, and the cited Layer-2 corroboration is for a different model (gemini-3.1-flash-lite) describing a different failure (wrong-slider dragging / preview turning dark).
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_06-49-35_pixel_alpha_slider_alpha_slider-antd-T01`

**`alpha_slider-antd-T05`** · alpha_slider (antd, mid/L1) · gpt-5.4-mini / pixel

- *Final category:* **continuous_calibration_error** [✓ verified]
- *Instruction:* Set compact tooltip opacity to 37% · *Human steps:* 1
- *Agent trace:* Step 0 clicks the '90%' opacity control to open the picker. The agent then issues keyboard_press('ControlOrMeta+a') and keyboard_type('37') intending to overwrite the percent field, then Enter. By step 6 it believes the field reads 37% and clicks outside to 'apply'. From there it noops/sends 'Done', declaring success. The final value is unchanged at 90%.
- *Verifier signal:* truncated at 20 steps; cum_reward=0.0 (final opacity 90%, target 37%)
- *Mechanism:* The agent opened the alpha control and tried to set 37% by typing, but the Ctrl+A / type('37') was misdirected: the step-6 screenshot shows page-level text (the 'Tooltip Overlay' title and 'Tooltip overlay color' label) highlighted blue (a document-level select-all) while the numeric '%' field still reads 90% and the HEX field shows 000000 - the digits never landed in the opacity input. The final frame confirms the slider stayed at 90%, yet the agent's thoughts assert it set 37% and report 'Done', a false self-confirmation. The slider was engaged but its final value is wrong, so this is a continuous calibration/value-setting failure (the typed value never committed to the alpha field) rather than a true commit-button omission.
- *Adversarial re-check:* Trace confirms the agent did Ctrl+A / type('37') / Enter but the select-all hit the page (step-6 screenshot shows the title and label highlighted blue while the opacity field still reads 90% and HEX shows 000000), the digits never landed in the alpha input, and the final frame stays at 90% while the agent falsely reports "Done" — a genuine continuous value-setting/calibration failure, not a commit-button omission.
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_06-54-23_pixel_alpha_slider_alpha_slider-antd-T05`

**`meter-antd-T09`** · meter (antd, hard/L2) · gpt-5.4-mini / pixel

- *Final category:* **continuous_calibration_error** [✓ verified]
- *Instruction:* Match Primary Storage Used meter to reference and Save · *Human steps:* 2
- *Agent trace:* The agent identifies the Storage card with three adjustable meter bars, a fixed green 'Reference level' bar (~36%), and a 'Save changes' button. It clicks the 'Storage Used (Primary)' bar repeatedly, walking the click x-position progressively rightward ('a bit farther right again') to lengthen it. It massively overshoots (tooltip shows 89% at step 10) past the ~36% reference, drifts back to ~55% by the final frame, never matches the reference, and never clicks Save; the 'Unsaved' badge persists throughout.
- *Verifier signal:* truncated at 20 steps; cum_reward=0.0 (Primary meter ~55% vs ~36% reference; still 'Unsaved')
- *Mechanism:* The Primary storage meter must be dragged/clicked to match the visible green 'Reference level' bar (~36% length) and then saved, but the agent cannot map a click x-coordinate to the matching bar length: it overshoots to 89% (tooltip-confirmed at step 10) and oscillates back to ~55%, always above the reference and never inside tolerance. The reference target is plainly visible directly above the control, so this is a continuous calibration error, not a target-finding or instance error; a secondary consequence is the required 'Save changes' is never clicked because the value never matched. Layer-2 agrees the pixel run 'used direct pointer drags from the start ... but failed to calibrate the correct ... value mapping,' and notes even browser_use failed via aria-valuenow/synthetic-event hacks without convergence.
- *Adversarial re-check:* The trace shows the agent correctly click-targeting the Primary meter row (y=337, x marching 620->836) while the green ~36% reference is plainly visible above it; the step-10 tooltip literally reads "89%" (overshoot) and the final step-20 frame settles at ~55%, still above the reference and outside tolerance with the "Unsaved" indicator persisting (reward 0), so this is a genuine continuous calibration/x-to-length mapping failure rather than grounding, idiom, or instance error (note: the Layer-2 packet describes a different model, gemini-flash-lite, and mislabels its pixel run as drag-based, but this gpt-5.4-mini run uses clean position clicks).
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_18-35-51_pixel_meter_meter-antd-T09`

**`meter-mui-T09`** · meter (mui, hard/L3) · gpt-5.4-mini / pixel

- *Final category:* **continuous_calibration_error** [✓ verified]
- *Instruction:* Drag to set Server B Load meter in table (MUI) to 42% · *Human steps:* 1
- *Agent trace:* In a 3-row Servers table (Server A 45%, Server B 15%, Server C 60%), the agent correctly targets the Server B Load bar and emits mouse_drag_and_drop actions on it from step 0 (e.g. drag 578,424 -> 648,424; later small nudges 587,425 -> 606,425). The drags do move Server B (15% -> 28%/29% across steps 10-19) but never reach 42%, so the agent keeps issuing tiny 'one more small drag' adjustments until the 20-step limit.
- *Verifier signal:* truncated at 20 steps; cum_reward=0.0 (Server B final ~28%, target 42%)
- *Mechanism:* Although the candidate features flagged this as a possible wrong-instance case (3 meters present), the trace shows the agent correctly and consistently targets the Server B row and successfully drags its load bar (15% -> 28-29% across the run), so the root cause is calibration, not instance selection. The Server B bar spans only ~100px for 0-100%, so ~1px per percent; the agent's coarse drags overshoot/undershoot and it cannot converge on 42% within tolerance, ending at ~28%. This is a drag that lands on the wrong continuous value (continuous_calibration_error); Layer-2 confirms the pixel run 'used direct pointer drags from the start ... but failed to calibrate the correct row-position/value mapping in the dense table,' and that even browser_use failed via DOM aria-valuenow edits, showing the failure generalizes across modes.
- *Adversarial re-check:* The agent consistently targets the correct Server B bar (every drag at y=425, the Server B row) and successfully moves its load from 15% to 27% via repeated coarse left-anchored horizontal drags, but with ~1px/percent it never converges on the 42% target and times out (cum_reward 0.0, truncated), so the failure is mis-calibration of a continuous drag value, not wrong-instance selection.
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_18-47-10_pixel_meter_meter-mui-T09`

### Drag / drop

**`drag_drop_between_lists-antd-T01`** · drag_drop_between_lists (antd, easy/L0) · gpt-5-mini / pixel

- *Final category:* **target_acquisition_or_wrong_instance** [✓ verified]
- *Instruction:* Assign one role via drag-and-drop: drag 'Editor' from Available roles to Assigned roles (initial Available = Admin, Editor, Billing, Support; Assigned = Viewer). · *Human steps:* 1
- *Agent trace:* 20 steps. Issued a real mouse_drag_and_drop on step 1 from (460,350)->(820,350); aimed at the Editor row but y=350 sat on the Admin row (Admin y~351, Editor y~398), so it dragged Admin into Assigned instead. Across steps 1-19 it alternated mouse_drag_and_drop / mouse_click / mouse_dblclick, eventually also moving Editor over; final Assigned = {Editor, Admin, Viewer}. Truncated at the step limit.
- *Verifier signal:* cum_reward=0.0, truncated=true (n_steps=20). Success requires checkSetMembership with assigned exactly {Viewer, Editor}; the extra Admin in Assigned breaks set-equality.
- *Mechanism:* The drag primitive itself worked — items visibly moved between the two dnd-kit columns (step_2 screenshot shows Admin already transferred to Assigned). The failure is that the very first drag grabbed the WRONG row: the agent aimed at y=350 for 'Editor' but that y landed on the 'Admin' row above it, so Admin (not Editor) was dropped into Assigned. The verifier's setsEqual then fails because Assigned ends as {Editor, Admin, Viewer} instead of {Editor, Viewer}, and the agent never dragged the mis-placed Admin back. NOTE: the pre-computed action_summary labeled this 'no valid drag/drop emitted', but the experiment.log shows multiple real mouse_drag_and_drop calls — that label is a summarizer artifact (the feature extractor did not parse the mouse_drag_and_drop verb).
- *Adversarial re-check:* The drag primitive worked (7 real mouse_drag_and_drop calls in experiment.log; step_2 shows an item moved), but the first drag from y=350 grabbed Admin (Admin row at y≈351, Editor at y≈398 in screenshot_step_1) instead of the intended Editor, and the mis-placed Admin was never removed, so the final Assigned set ends {Editor, Admin, Viewer} vs expected {Editor, Viewer} and setsEqual fails.
- *Trace:* `runs/gpt-5-mini/pixel.tar` → `pixel/shard_0/2026-03-29_01-57-46_pixel_drag_drop_between_lists_drag_drop_between_lists-antd-T01`

**`drag_drop_sortable_list-antd-T01`** · drag_drop_sortable_list (antd, easy/L0) · gpt-5-mini / pixel

- *Final category:* **target_acquisition_or_wrong_instance** [✓ verified]
- *Instruction:* AntD: Move 'Reports' to top of the Sidebar order list (initial order Home, Projects, Calendar, Reports, Settings; required final order Reports, Home, Projects, Calendar, Settings). · *Human steps:* 1
- *Agent trace:* 5 steps, then self-terminated. Step 0 mouse_click(640,360); step 1 mouse_drag_and_drop(520,400 -> 520,260) intended to grab Reports but y=400 landed on the Calendar row, sending Calendar to the top; step 2 mouse_drag_and_drop(520,420 -> 520,220) then moved Reports to the top; step 3 send_msg_to_user('Done - Reports moved to top'); step 4 report_infeasible('DONE').
- *Verifier signal:* cum_reward=0.0, terminated=true (n_steps=5). Success requires exact arraysEqual to ['reports','home','projects','calendar','settings']; the final order was Reports, Calendar, Home, Projects, Settings.
- *Mechanism:* The drag primitive worked, but the first drag grabbed the wrong row: aiming at y=400 for 'Reports' actually grabbed 'Calendar' (Calendar y~388, Reports y~435), so step 1 hoisted Calendar to the top (step_2 screenshot: order became Calendar, Home, Projects, Reports, Settings). A second drag then put Reports on top, leaving the middle permanently scrambled (final Reports, Calendar, Home, Projects, Settings) versus the canonical single-arrayMove target (Reports, Home, Projects, Calendar, Settings). The agent compounded this by declaring DONE without checking exact order. This is a target-acquisition error (off-by-one-row grab), with a secondary premature-commit; it is not a drag-execution or benchmark failure (Layer-2 confirms a clean 1-drag pixel solution exists and the task is sound).
- *Adversarial re-check:* The drag primitive worked but drag 1 (grab y=400, between Calendar y~388 and Reports y~435) grabbed Calendar instead of Reports, so step_2 shows Calendar,Home,Projects,Reports,Settings; drag 2 then hoisted Reports, leaving the final scrambled order Reports,Calendar,Home,Projects,Settings vs canonical Reports,Home,Projects,Calendar,Settings, after which the agent declared DONE without verifying order — an off-by-one-row target-acquisition error plus secondary premature commit, with Layer-2 confirming a clean 1-drag pixel solution and no benchmark flaw.
- *Trace:* `runs/gpt-5-mini/pixel.tar` → `pixel/shard_0/2026-03-29_02-08-52_pixel_drag_drop_sortable_list_drag_drop_sortable_list-antd-T01`

**`kanban_board_drag_drop-antd-T04`** · kanban_board_drag_drop (antd, easy/L1) · gpt-5.4-mini / pixel

- *Final category:* **semantic_value_error** [✓ verified]
- *Instruction:* Reorder the cards in the 'Review' column to match the reference order shown in the 'Reference (Review)' panel (reference = PR-12, PR-17, PR-19; actual Review column = PR-17, PR-12, PR-19). · *Human steps:* 1
- *Agent trace:* 20 steps with NO drag attempted. From step 0 the <think> asserts 'Review column already matches the reference (PR-17, PR-12, PR-19)' and emits send_msg_to_user('The Review column already matches the reference order.'); it repeats that identical message ~16 times, interspersed with noop(1000) to wait for a success banner. Never issues a drag. Truncated at step limit.
- *Verifier signal:* cum_reward=0.0, truncated=true (n_steps=20). No success trigger fired because the column order never changed.
- *Mechanism:* This is a perception/comparison error, not a drag-execution problem: the screenshot shows the Reference (Review) panel listing PR-12, PR-17, PR-19 while the live Review column shows PR-17, PR-12, PR-19 (the top two are swapped). The agent misread the reference, asserting in every <think> that the reference order is 'PR-17, PR-12, PR-19' (i.e. it read the column's own order back as if it were the reference), concluded the state already matched, and therefore never performed the single drag needed to swap PR-17 and PR-12. Layer-2 confirms the task is well-posed (human and a pixel run solve it in one drag), so this is a genuine agent reading/grounding failure rather than a verifier false-negative. It also degenerates into a no-progress loop, but the root cause is the wrong belief about the target order.
- *Adversarial re-check:* Zoomed screenshots confirm the Reference panel reads PR-12/PR-17/PR-19 while the live Review column reads PR-17/PR-12/PR-19 (top two swapped), and all 20 raw_response steps misquote the reference as "PR-17, PR-12, PR-19" (reading the column back as the target), concluding the state matches and emitting only send_msg_to_user/noop with zero drag actions across byte-identical screenshots — a genuine perception/comparison error about the target order, not a drag-execution failure.
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_17-05-44_pixel_kanban_board_drag_drop_kanban_board_drag_drop-antd-T04`

**`drag_drop_sortable_list-mantine-T07`** · drag_drop_sortable_list (mantine, hard/L2) · gpt-5.4-mini / pixel

- *Final category:* **drag_execution_failure** [✓ verified]
- *Instruction:* Mantine: Arrange the 'Feature ranking' list to match the Reference order (target Security, Collaboration, Analytics, Automation, Customization; initial Analytics, Automation, Collaboration, Customization, Security). · *Human steps:* 2
- *Agent trace:* 20 steps, a real mouse_drag_and_drop on essentially every step (e.g. step 0 (434,493 -> 434,327) to lift Security to the top). Many drags did NOT reorder the list and instead produced a text-selection marquee over the rows; some later drags did register (Security reached the top). The list never reached the reference order; truncated at the step limit.
- *Verifier signal:* cum_reward=0.0, truncated=true (n_steps=20). Final order Security, Analytics, Automation, Collaboration, Customization never matched the required reference order.
- *Mechanism:* Unlike the AntD cases, here many of the synthetic mouse_drag_and_drop gestures failed to engage Mantine's dnd-kit sortable at all: the step_1 screenshot (after a press-move-release) shows the row text highlighted in blue (a text-selection drag) with the list order completely unchanged, i.e. the gesture was interpreted as a text marquee rather than a reorder. A few drags did eventually register (final screenshot shows Security moved to the top and partial text-selection still visible), but the agent never converged on the exact reference permutation and never verified intermediate state. This is a library-specific drag-execution failure (the drag idiom does not reliably activate dnd-kit), distinct from the AntD wrong-row grabs. NOTE: the pre-computed action_summary's '<none>' entries are a summarizer artifact — the raw responses contain real mouse_drag_and_drop calls on every step.
- *Adversarial re-check:* Steps 1/2/10 screenshots show the rows merely blue text-highlighted with the list order unchanged (synthetic mouse_drag_and_drop interpreted as a text marquee, not engaging Mantine's dnd-kit sortable), while step_0's well-aimed Security-to-top drag confirms grounding was correct; only late drags registered (final screenshot has Security at top with residual selection) and cum_reward=0.0 with no convergence on the reference order, so the library-specific drag-execution-failure label is genuinely supported, and every raw_response_step_*.txt contains a real mouse_drag_and_drop call confirming the '<none>' action_summary is a summarizer artifact.
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_15-06-48_pixel_drag_drop_sortable_list_drag_drop_sortable_list-mantine-T07`

### Advanced editors

**`rich_text_editor-mantine-T14`** · rich_text_editor (mantine, mid/L1) · gpt-5-mini / pixel — also independently fails for gpt-5.4-mini / pixel and for ax_tree & som modes

- *Final category:* **widget_specific_procedure_missing** [✓ verified]
- *Instruction:* Highlight the phrase "high priority" in the editor body (drag-select the phrase, then apply the Highlight toolbar control). · *Human steps:* 2
- *Agent trace:* Step 0: clicks the editor body (640,360) — no selection. Step 2: double-clicks and selects the WRONG single word 'please' (blue selection visible in screenshot_step_2), not the target phrase. Steps 3-20: repeated single clicks around the editor/toolbar (x~520-620, y~360-430), never re-creating a 'high priority' selection and never clicking the Highlight pen button. Ends at step 20 with text completely unchanged.
- *Verifier signal:* cum_reward=0.0, truncated=true, n_steps=20 (hit step limit, no success banner). Text 'This is a high priority request—please respond.' is unmodified in screenshot_step_20.
- *Mechanism:* The task needs the rich-text recipe of click-dragging across the two-word phrase 'high priority' and then clicking the Highlight (pen) toolbar button, but the agent instead uses double-click word-selection — which can only ever grab one word and in screenshot_step_2 grabs the wrong word ('please'). It never produces a stable two-word selection nor commits the highlight, so the final body is unchanged. The Layer-2 packet corroborates this across modes (paper_useful_quote: 'only the browser_use run completed because it programmatically created the text selection before invoking the Highlight control'), and the same task fails for gpt-5.4-mini, making it a generalizable selection-then-commit failure rather than a one-off grounding miss.
- *Adversarial re-check:* Verified: screenshot_step_2 shows the wrong single word "please" selected and the final screenshot shows the body unchanged with no highlight committed, and the agent never produced a stable two-word selection nor clicked the pen to commit — so the rich-text select-then-highlight procedure was genuinely never completed (category supported); however the case study's sub-claim that the agent "only uses double-click and can only grab one word" is overstated, since at step 16 it explicitly reasoned and issued Shift+ArrowLeft to extend the selection to "high priority," so the true mechanism is a grounding/recovery failure (selection repeatedly collapses on stray clicks) layered on the missing procedure, consistent with the Layer-2 packet's recovery_state_tracking diagnosis.
- *Trace:* `runs/gpt-5-mini/pixel.tar` → `pixel/shard_3/2026-03-29_07-29-31_pixel_rich_text_editor_rich_text_editor-mantine-T14`

**`code_editor-antd-T03`** · code_editor (antd, easy/L1) · gpt-5-mini / pixel — also fails in ax_tree mode (Layer-2); succeeds only in som / browser_use

- *Final category:* **target_acquisition_or_wrong_instance** [⚠ verifier-corrected (agent proposed `transient_state_loss`)]
- *Instruction:* Switch the code editor's Language from JavaScript to JSON via the Language Select dropdown. · *Human steps:* 2
- *Agent trace:* Step 0: clicks the Language Select (540,240), opening the dropdown (screenshot_step_1 shows JavaScript[highlighted]/JSON/Python/YAML). Steps 1-2: clicks (550,275)→(550,305) — landing on/just above the highlighted JavaScript row, NOT the JSON option which sits lower at ~(467,327); dropdown closes with JavaScript still selected (screenshot_step_3). Steps 4-20: repeatedly re-opens the Select and re-clicks the same off-target coordinates, looping. Ends at step 20 with the dropdown open, JavaScript still the value, JSON visible but never clicked.
- *Verifier signal:* cum_reward=0.0, truncated=true, n_steps=20. Language control still reads 'JavaScript' in screenshot_step_20 (no success banner).
- *Mechanism:* The agent correctly opens the antd Language Select (overlay listbox with JavaScript/JSON/Python/YAML visible in screenshot_step_1), but its commit clicks land at y~275-305 on/near the already-selected JavaScript row instead of the JSON option at y~327, so the popover dismisses without committing and the value stays JavaScript (screenshot_step_3). It then loops the open→miss→dismiss cycle to the step limit. Layer-2 confirms this is menu-item grounding fragility on the floating option list (pixel and ax_tree fail; som/browser_use succeed because they expose discrete clickable option targets), so it generalizes across coordinate/native-select abstractions rather than being a single mis-click.
- *Adversarial re-check:* The popover opens with JavaScript/JSON/Python/YAML (JSON at y~327), but every commit click lands at y~275-305 on the already-selected JavaScript row, never on JSON, so the value stays JavaScript through truncation (steps 3/6 screenshots) — a menu-item mis-grounding loop, not loss of a correctly-committed state; Layer-2 likewise calls pixel "cannot reliably land on JSON" / "visual grounding failures," so the mechanism is grounding, not transient_state_loss.
- *Trace:* `runs/gpt-5-mini/pixel.tar` → `pixel/shard_2/2026-03-28_23-54-41_pixel_code_editor_code_editor-antd-T03`

**`json_editor-antd-T08`** · json_editor (antd, hard/L2) · gpt-5-mini / pixel — also fails for gpt-5.4-mini / pixel; gemini pixel/som/ax_tree solve it

- *Final category:* **drag_execution_failure** [⚠ verifier-corrected mechanism (same category)]
- *Instruction:* In the Pipeline steps (JSON) tree editor, reorder the steps array to ["validate", "transform", "send"] (drag 'transform' above 'send' using the row drag handles), then click Apply. · *Human steps:* 1
- *Agent trace:* gpt-5-mini: mostly mouse_click actions near the panel's top-right title bar at x~920-1030,y~120-150, plus late drag attempts (see re-check). After 20 steps the array order is still ['validate','send','transform'] and Apply was never reached (screenshot_step_20 unchanged). The parallel gpt-5.4-mini run instead opened the Code tab and tried Ctrl+A + keyboard_type('{"steps":["validate","t...'), leaving stray page-text selection and the same unchanged order.
- *Verifier signal:* cum_reward=0.0, truncated=true, n_steps=20. Steps remain ['validate','send','transform'] in screenshot_step_20; Apply not committed.
- *Mechanism:* Reordering requires a drag from the 'transform' row's handle up past 'send' (a single drag the human does in 1 step). The gpt-5-mini run's drags never registered a reorder, and the companion gpt-5.4-mini run fails differently but for the same root reason (no effective drag): it tries to overwrite the array as text via the Code tab, which does nothing in the tree-mode rows. Layer-2 shows gemini's pixel agent solved this with a direct spatial drag+Apply, so the GPT-5-family failure is a genuine inability to execute the drag-to-reorder gesture, not a missing-target artifact.
- *Adversarial re-check:* The trace contradicts part of the original narrative: gpt-5-mini DID plan and emit drag-to-reorder (mouse_drag_and_drop at steps 16 and 18, near the handle column x~830-840, with explicit "drag transform above send" reasoning), not "20 plain clicks and never any drag primitive"; the two drags simply registered no reorder (all 21 screenshots are byte-identical, order stays validate/send/transform, reward 0), so the outcome label drag_execution_failure holds but the "inability to plan/emit the gesture" narrative is false.
- *Trace:* `runs/gpt-5-mini/pixel.tar` → `pixel/shard7_rerun/sub_9/2026-03-29_18-00-00_pixel_json_editor_json_editor-antd-T08`

**`data_grid_editable-antd-T04`** · data_grid_editable (antd, easy/L0) · gpt-5-mini / pixel — gemini solves it in 1 click across all modes (Layer-2)

- *Final category:* **target_acquisition_or_wrong_instance** [✓ verified]
- *Instruction:* In the Orders editable table, set Paid for order ORD-1002 to checked (toggle the row's Paid checkbox). · *Human steps:* 1
- *Agent trace:* All 20 actions are mouse_clicks aimed at the Paid column for the ORD-1002 row, but consistently land RIGHT of the checkbox glyph: step 0 (1015,212), step 1 (1015,248), step 19 (1035,190) — the ORD-1002 checkbox center is ~(967,247). Clicks hit the cell's right padding/whitespace and adjacent rows; screenshot_step_10 shows the ORD-1002 row faintly hover-highlighted but the checkbox never toggles. Ends unchanged.
- *Verifier signal:* cum_reward=0.0, truncated=true, n_steps=20. ORD-1002 Paid checkbox is still unchecked in screenshot_step_20 (no success banner).
- *Mechanism:* The target is the small unchecked Paid checkbox on the ORD-1002 row (glyph centered ~x=967, y=247), but the agent's 20 clicks all land ~50px to the right (x~1015-1065) in the cell's empty padding, and some drift to wrong rows in y — so it never lands on the actual checkbox and the value never flips. This is a small-target acquisition miss specific to gpt-5-mini: the Layer-2 packet (gemini) shows all four modes toggle this exact checkbox on the first click, confirming the checkbox is hittable and the failure is gpt-5-mini's coordinate grounding offset, not a benchmark artifact or commit gap.
- *Adversarial re-check:* Measured ORD-1002 checkbox center is x=966.5/y=246.5, yet all 20 gpt-5-mini clicks land at x=990-1065 (mean 1027, ~60px right, 0/20 inside the box) with y drift, the box never flips (step-0 and step-20 screenshots identical, reward 0), while gemini solves in one click in pixel mode per the Layer-2 packet, confirming a small-target acquisition offset.
- *Trace:* `runs/gpt-5-mini/pixel.tar` → `pixel/shard_3/2026-03-29_01-21-24_pixel_data_grid_editable_data_grid_editable-antd-T04`

### Transient UI

**`context_menu-mantine-T06`** · context_menu (mantine, mid/L2) · gpt-5.4-mini / pixel

- *Final category:* **transient_state_loss** [✓ verified]
- *Instruction:* On the dashboard, open the context menu for the "Monthly report" widget and select "Download as PDF" (Mantine; scroll_find variant where the target action sits below the visible menu fold). · *Human steps:* 2
- *Agent trace:* Step 0 right-clicks the Monthly report widget and the context menu opens correctly (Refresh, Refresh automatically, Change timeframe, Set date range, Compare periods, Edit widget, Duplicate, Move up…), but 'Download as PDF' is below the viewport. The agent never scrolls within the menu; instead it guesses coordinates for the hidden item, clicks visible items like 'Move up' (final 'Last action: Move up'), and repeatedly re-right-clicks (steps 5,7,9,11…) to reopen the menu at the top, looping until truncation at 20 steps.
- *Verifier signal:* cum_reward=0.0, truncated=True at n_steps=20 (no green success banner; correct menu item never selected).
- *Mechanism:* The Mantine context menu opens correctly but its item list overflows past the bottom of the viewport, so the required 'Download as PDF' entry is never visible (screenshot_step_1/10 show the menu ending at 'Move up'). The agent never scrolls inside the open menu; every guess-click outside the menu dismisses it (final screenshot shows the menu gone, 'Last action: Move up'), and it falls into a re-open/guess loop that never commits the target. Note: this case has a real visual-surfacing component (AX/DOM and browser_use runs solve it in 2-4 steps, pixel/som loop), so the menu's off-screen tail amplifies the transient loss, but the agent's own failure to scroll-and-preserve the open menu is the proximate mechanism.
- *Adversarial re-check:* Across all 20 steps the agent only ever right-clicks to re-open the menu (646,267) then guess-clicks visible items — never a single scroll action — and each guess dismisses the open menu (final screenshot shows menu gone, "Last action: Move up"); every menu-open screenshot ends flush at "Move up" with "Download as PDF" off-screen, so the agent's own reopen/guess loop that fails to preserve the open-menu state is the proximate mechanism, exactly as claimed.
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_11-08-28_pixel_context_menu_context_menu-mantine-T06`

**`context_menu-mantine-T09`** · context_menu (mantine, hard/L3) · gpt-5.4-mini / pixel

- *Final category:* **target_acquisition_or_wrong_instance** [⚠ verifier-corrected (agent proposed `transient_state_loss`)]
- *Instruction:* Open the context menu for "Playlist item 12" and select the nested path Sort → By date → Newest first (Mantine; hierarchical submenu with hover-driven expansion, menu anchored in the bottom-left corner). · *Human steps:* 2
- *Agent trace:* Step 0 right-clicks the Playlist item 12 row and the menu opens upward (Play, Add to queue, Sort ‣ with a submenu chevron), partly clipped at the top. The agent assumes the submenu opens on click and blindly clicks imagined coordinates for 'By date'/'Newest first' (e.g. 227,556; 310,556; 431,588); each click lands outside the open menu and dismisses it. It re-right-clicks and re-guesses across steps 2-14, never expands the submenu, and times out at 20 steps; final state shows the menu fully closed ('Last action: None').
- *Verifier signal:* cum_reward=0.0, truncated=True at n_steps=20 (no success banner; Newest first never selected).
- *Mechanism:* Sort exposes its children only via hover (it has a submenu chevron, screenshot_step_1), but the agent treats it as a click-then-click flat menu and guesses coordinates where it imagines the deeper items are. Those guesses fall outside the currently open menu, so each click dismisses the whole cascade rather than opening the submenu (final screenshot_step_20 shows the menu gone with 'Last action: None', i.e. no valid selection ever registered). The browser_use DOM run completes it via explicit hover.
- *Adversarial re-check:* All 21 frames show only two states (flat Play/Add-to-queue/Sort menu open, or menu closed with "Last action: None") — the Sort submenu never renders, so no hover-generated overlay was ever created-then-lost; the trace instead shows the agent clicking guessed coordinates far outside the open menu (x=227, 310, and 431,588 for ~10 steps) in blank space, a target-acquisition/grounding failure that the Layer-2 pixel observation independently labels primary_failure_family="grounding", is_grounding_limited=true with the small_target tag.
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_11-11-35_pixel_context_menu_context_menu-mantine-T09`

**`combobox_editable_single-antd-T10`** · combobox_editable_single (antd, hard/L3) · gpt-5.4-mini / pixel

- *Final category:* **target_acquisition_or_wrong_instance** [✓ verified]
- *Instruction:* Enter the exact formatted custom tag "Road-trip" (capital R, hyphen) into the Ant Design AutoComplete 'Custom tag' field (enter_formatted; commit-sensitive combobox, case matters). · *Human steps:* 2
- *Agent trace:* Step 0 clicks the small top-right Custom tag input; step 1 types 'Road-trip' correctly, and the dropdown opens with two suggestions 'road-trip' (top) and 'Road-trip' (highlighted, second). Step 2 (mouse_click 1042,168) lands on the FIRST/top suggestion row 'road-trip' (lowercase), overwriting the field. The final field reads 'road-trip'; the agent then noops and calls report_infeasible('DONE'), terminating at step 8.
- *Verifier signal:* cum_reward=0.0, terminated=True at n_steps=8 (committed value 'road-trip' fails the case-sensitive 'Road-trip' check).
- *Mechanism:* The agent typed the correct value 'Road-trip' and the open dropdown clearly offered both 'road-trip' (lowercase) and the correct 'Road-trip' (highlighted), but its commit click at y=168 selected the wrong instance — the lowercase 'road-trip' row — replacing the correct text with a case-wrong value (final screenshot_step_8 shows 'road-trip' in the field). Rather than pressing Enter to commit its own typed text or clicking the highlighted correct option, it picked the adjacent suggestion, so this is a wrong-instance selection inside the transient dropdown that yields a case/semantically wrong committed value. (The accompanying Layer-2 packet frames the broader cross-mode pattern as a commit-event problem, but the pixel run's proximate cause is visibly clicking the lowercase suggestion.)
- *Adversarial re-check:* After typing the correct "Road-trip" (step_2 field + dropdown show lowercase "road-trip" at y~171 above the grey-highlighted correct "Road-trip" at y~204), the agent's mouse_click(1042,168) hits the first/lowercase row, and step_3/step_8 show the field flipped to case-wrong "road-trip" — a genuine wrong-instance dropdown selection, not the Layer-2 packet's pixel-grounding-miss or commit-event story.
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_10-55-18_pixel_combobox_editable_single_combobox_editable_single-antd-T10`

**`datetime_picker_single-mantine-T04`** · datetime_picker_single (mantine, mid/L1) · gpt-5.4-mini / pixel

- *Final category:* **semantic_value_error** [✓ verified]
- *Instruction:* Open the Mantine modal DateTimePicker ('Lock time') and set it to March 3, 2026 at 6:15 PM (open_and_select via modal dropdown calendar + time spinner). · *Human steps:* 2
- *Agent trace:* Step 0 clicks the empty Lock time input; the modal calendar opens (March 2026, screenshot_step_2) and the agent selects the 3rd. It then types '6:15 PM' into the segmented time control, but the spinner interprets it as a 24-hour/AM field, yielding '06:15' (AM). The agent repeatedly clicks the time field and presses Enter (steps 3-12) without flipping to PM, and the run terminates with the field committed as '03/03/2026 06:15' (final screenshot_step_18).
- *Verifier signal:* cum_reward=0.0, terminated=True at n_steps=19 (committed time 06:15 is AM, not the required 6:15 PM / 18:15).
- *Mechanism:* The agent successfully opens the modal picker and selects the correct date (March 3), so target acquisition and overlay handling are fine. The failure is the time value: it types '6:15 PM' into a segmented spinner that does not parse the 'PM' token, so the committed field reads '03/03/2026 06:15' (AM) instead of 18:15 (final screenshot_step_18). It never uses the correct time-entry idiom (24-hour '18:15' or an AM/PM toggle), so the field holds a semantically wrong value — the successful browser_use run instead entered '18:15' and passed.
- *Adversarial re-check:* Step-9 screenshot shows the open Mantine spinner with AM still highlighted ("06:15 AM", PM unselected) after the agent typed "6:15 PM", and the step-18 final field reads "03/03/2026 06:15" (AM) versus the goal of 6:15 PM/18:15, so the date is correct but the committed time value is semantically wrong because the PM token was never parsed and the agent declared success without correcting it.
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_14-17-04_pixel_datetime_picker_single_datetime_picker_single-mantine-T04`

### Clutter / multi-instance / wrong-instance

**`carousel-mantine-T08`** · carousel (mantine, mid/L1) · gpt-5.4-mini / pixel

- *Final category:* **target_acquisition_or_wrong_instance** [✓ verified]
- *Instruction:* In the Checkout settings form, set the 'Shipping options' carousel to 'Express' (a second 'Payment methods' carousel is also present). · *Human steps:* 1
- *Agent trace:* Step 0 the agent correctly names the target ('the goal is specifically the Shipping options carousel') and clicks (1042,449); over 20 steps it keeps clicking the right edge / outside the carousel (1042,449 -> 1079,465 -> 919,450 -> 980,466 ...). The Shipping carousel stays on 'Overnight' the entire run and Express is never brought into view.
- *Verifier signal:* truncated at 20 steps, cum_reward=0.0 (no success banner)
- *Mechanism:* The screenshot shows two near-identical Mantine carousels stacked in one form (Payment methods 'Card' above, Shipping options 'Overnight' below), each with a row of tiny indicator bars (~x958-1042, y465) as the only navigation affordance. The agent reads the goal correctly and operates the right instance, but never lands on the small indicator dots, repeatedly clicking ~150px to the right at the card's edge; the slide never advances off 'Overnight'. This is a small-target localization failure on a duplicated low-semantic control, corroborated by Layer-2 (SoM/browser_use solve it; AX-tree and pixel loop, 'grounding the correct small control in the correct carousel instance').
- *Adversarial re-check:* Trace confirms the agent correctly reads the goal and operates the right (Shipping options) carousel but fails to land on the tiny indicator bars (detected at x962-1052, y466): 13/20 clicks fall off the card's right edge (x>1082, +5 to +99px) and only 2/20 hit a bar, so steps 0-19 are byte-identical on "Overnight" and it only flips to "Standard" (never the target "Express") at the final frame — a small-target localization failure on a duplicated low-semantic control, matching the Layer-2 dissociation (SoM/browser_use pass, AX-tree/pixel fail).
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_08-08-30_pixel_carousel_carousel-mantine-T08`

**`carousel-antd-T14`** · carousel (antd, hard/L2) · gpt-5.4-mini / pixel

- *Final category:* **target_acquisition_or_wrong_instance** [✓ verified]
- *Instruction:* In the listings table, find the carousel in the row labeled 'Listing B' and set it to 'Image 3' (a second carousel in the 'Listing A' row is also present). · *Human steps:* 2
- *Agent trace:* Step 0 the agent identifies Listing B's carousel ('Image 4') and clicks (1100,644); for 20 steps it clusters clicks near the right edge of the table (1100,644 / 1074,623 / 1134,641 / ...), well to the right of the carousel cell. Every step's <think> notes 'Listing B still showing Image 4'; the slide never changes.
- *Verifier signal:* truncated at 20 steps, cum_reward=0.0 (no success banner)
- *Mechanism:* The screenshot shows a 2-row listings table where each Photos cell contains a tiny AntD carousel with miniature indicator dots (Listing B's are at ~x870-915, y638). The agent targets the correct row (Listing B) but its clicks land at x~1100-1134, near the 'View' link / right table edge, ~200px right of the actual carousel control, so the slide is never advanced from Image 4 to Image 3. Pure small-target visual grounding failure on a duplicated control; Layer-2 confirms the same model solves it in one click under ax_tree/som but exhausts 20 steps in pixel mode.
- *Adversarial re-check:* Screenshots (step 0 == step 20) show a 2-row listings table whose Listing B cell holds a tiny AntD carousel stuck on "Image 4" with indicator dots at ~x863-920/y635, and all 20 clicks hit the correct Listing B row (y~620-644) but cluster at x~1100-1138 (the empty gap left of the View link), ~200px right of the dots, so the slide is never advanced — a genuine small-target grounding failure on a duplicated control, corroborated by Layer-2's grounding/small_target verdict and one-click ax_tree/som success (though Layer-2 evidence is gemini-flash-lite, not gpt-5.4-mini, and the "View link" wording is loose since clicks land in the column gap).
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_08-03-27_pixel_carousel_carousel-antd-T14`

**`select_native-mantine-T05`** · select_native (mantine, easy/L0) · gpt-5.4-mini / pixel

- *Final category:* **target_acquisition_or_wrong_instance** [⚠ verifier-corrected (agent proposed `other_or_unclear`)]
- *Instruction:* Set the 'Secondary language' dropdown to 'Spanish' (a second 'Primary language' select is also present). · *Human steps:* 1
- *Agent trace:* Step 0 clicks the correct 'Secondary language' select (608,433), opening the native option list; step 1 clicks (488,488) which lands exactly on the 'Spanish' option; step 2 the agent itself observes 'Secondary language already set to French' (selection did not stick). It then loops re-opening/re-clicking the select (~x9) until truncation.
- *Verifier signal:* truncated at 20 steps, cum_reward=0.0 (value stayed French)
- *Mechanism:* The step_0 and step_1 screenshots show the agent picked the correct instance (Secondary, not the Primary distractor) and clicked precisely on the rendered 'Spanish' option, but on the next frame the control reverts to 'French' and never commits — the synthetic pixel click on the native popup did not fire a change event. Native `<select>` popups are rendered by the OS, not the page, so pixel-mode clicks on them are structurally unreliable; the select_native family is the cleanest click-vs-semantic split in the benchmark (pixel 0%, browser_use 100%).
- *Adversarial re-check:* The 21-step truncated run (not a clean 2-step pick-then-revert) shows the agent re-clicking the visible Spanish row ~13 times on the native popup that never commits off French, never firing a change and never reporting done — a pixel grounding/no-verification failure, which Layer-2 confirms as dominant_failure_family "grounding" with is_benchmark_issue=false, contradicting the "native-widget benchmark artifact / report-done" story.
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_22-11-01_pixel_select_native_select_native-mantine-T05`

**`data_table_sortable-antd-T09`** · data_table_sortable (antd, hard/L2) · gpt-5.4-mini / pixel

- *Final category:* **semantic_value_error** [✓ verified]
- *Instruction:* On a dashboard with three tables, sort the 'Team Members' table by 'Last active' from newest to oldest (descending). · *Human steps:* 2
- *Agent trace:* Step 0 clicks the correct table's 'Last active' header once (709,261); step 1 asserts 'it appears to have sorted the table in descending order' and noops; by step 5 it reports 'Done' / report_infeasible('DONE'). It clicks the header only a single time and never a second time.
- *Verifier signal:* terminated, cum_reward=0.0 (sorted ascending, not descending)
- *Mechanism:* Not a wrong-instance failure: the agent correctly targeted the Team Members table among three tables. The step_1 screenshot shows a single click sorted 'Last active' ASCENDING (David Kim 02-13 at top -> Carol 02-15 11:45 at bottom), and the header tooltip explicitly reads 'Click to sort descending', i.e. one more click was needed to reach the requested newest->oldest order. The agent misread the ascending result as descending, declared done, and never performed the second click, so the final sort direction is semantically wrong. This candidate is mislabeled 'multi-instance' in the feature file; its real root cause is a wrong sort-direction / un-verified value error.
- *Adversarial re-check:* The agent clicked the correct Team Members "Last active" header once (step_0 mouse_click(709,261)), producing ASCENDING order (David Kim 02-13 16:00 top -> Carol Davis 02-15 11:45 bottom) with a visible "Click to sort descending" tooltip, then misread it as done and never issued the needed second click (steps 1-8 only noop/Done), leaving the sort direction semantically wrong (reward 0.0) — a wrong-direction/un-verified value error, not a wrong-instance failure.
- *Trace:* `runs/gpt-5.4-mini/pixel.tar` → `pixel/2026-03-26_12-40-05_pixel_data_table_sortable_data_table_sortable-antd-T09`

## 7. Synthesis

### Aggregate failure taxonomy

We characterize failures with two independent passes over the same traces. The **deterministic** pass assigns every failed episode (all 5 models, grounded modes pixel/SoM/AX-tree, 2,910 tasks; n=8,864 failures) a mechanism by combining a component-type prior with trace-derived features (final-vs-target value, drag events, repeated identical actions, missing commit). The **Layer-2** pass reuses the per-trace diagnostic notes (read by a single model on one agent, gemini-3.1-flash-lite; n=2,752) bucketed into the same label set. Neither pass is a new benchmark; both are post-hoc readings of the diagnostic logs the benchmark already produces.

The two methods agree on the **big buckets**. Pooled across grounded modes, the dominant deterministic mechanisms are **continuous calibration error** (engaged a continuous/positional control but landed outside tolerance; 1,790 failures, 20.2%), **transient state loss** (overlay/edit state dismissed or never committed; 1,767, 19.9%), **missing commit/confirmation** (1,024, 11.6%), **target acquisition / wrong instance** (994, 11.2%) and the closely-tied **repetition/no-progress loop** (996, 11.2%), then **widget-specific procedure missing** (847, 9.6%), **other** (744, 8.4%), **drag execution** (383, 4.3%), and **semantic value error** (319, 3.6%). Per mode, calibration grows as observation becomes more semantic (pixel 521/14.3%, SoM 658/22.9%, AX-tree 611/26.0%), while transient-state-loss is heaviest under pixel (787/21.6%, vs SoM 533/18.6%, AX-tree 447/19.0%) — the single largest pixel bucket. The Layer-2 pass independently surfaces the same families on its one model: target acquisition 871 (31.6%), widget-procedure 662 (24.1%), missing-commit 550 (20.0%), transient-state-loss 414 (15.0%). The four load-bearing mechanisms — **calibration, transient-state-loss, target-acquisition, widget-procedure** — are stable across both methods.

**Method limits.** The deterministic labels are a component-driven prior refined by trace features: systematic but coarse (a "calibration" label shows the agent engaged the control and missed tolerance, not its intent). The Layer-2 labels are richer but reflect a single reader on a single model, so their absolute percentages are not population estimates — which is exactly why the two passes differ in magnitude (Layer-2 over-weights target-acquisition because gemini-flash-lite grounds poorly under pixel input). We therefore report **agreement on the buckets, not the exact percentages**, as the finding.

Finally, **looping is a downstream symptom, not a root cause.** A repetition/no-progress loop appears in 55.8% of all failures, but it co-occurs with every mechanism: 64.9% of calibration failures loop, 55.6% of drag-execution, 55.1% of widget-procedure, 54.2% of transient-state-loss, 48.4% of target-acquisition. Agents loop *because* the upstream mechanism (a miscalibrated drag, a dismissed overlay, a missing commit) never yields progress; we attribute root cause upstream. `alpha_slider-antd-T01` illustrates this directly: the *symptom* is a no-progress loop (the agent clicks a numeric down-spinner ~12 identical times, ratcheting opacity monotonically the wrong way from 100% toward 53%), while the underlying mechanism is a misread of which sub-control governs opacity.

### Spatial manipulation

Spatial-manipulation families are by far the hardest. `dragdrop_workspace` passes only **47.6%** (52.4% fail, 40.8% timeout) and `continuous_precision` only **62.4%** (37.6% fail, 29.9% timeout), versus 90%+ for click/disclosure families — yet humans solve these in a median of **1–2 steps**. The human-easy/agent-hard slice (human ≤ 2 steps, agent pass < 60%) is dominated by exactly these components: `resizable_columns` (human 1 step; agent 25.9% overall, 10.0% in AX-tree), `slider_range` (human 1; 43.3%), `window_splitter` (human 0.5; 44.7%, only 6.7% in SoM), `kanban_board_drag_drop` (human 1; 49.8%), `meter` (human 1; 50.2%), `alpha_slider` (human 1; 53.3%), `color_picker_2d` (human 2; 58.6%).

The mechanism is **continuous calibration plus drag execution**, not perception or task understanding. Two trace-grounded examples: in `meter-antd-T09` (gpt-5.4-mini / pixel) the green ~36% reference bar is plainly visible directly above the control and the agent click-targets the correct row, but it cannot map a click x-coordinate to a bar length — it overshoots to a tooltip-confirmed 89% at step 10 and settles at ~55%, never inside tolerance, leaving the "Unsaved" indicator and never reaching Save. In `meter-mui-T09` the agent correctly and consistently selects the right instance (the Server B row, every drag at the same y), successfully drags the bar (15%→~28%), but the bar spans ~1px per percent, so its coarse drags cannot converge on the 42% target before truncation. These are continuous value-setting failures — the agent finds the right control and acts on it, but the action lands on the wrong continuous value — which is why these families carry the highest looping co-occurrence (calibration 64.9%, drag-execution 55.6%): the agent keeps retrying an action that structurally cannot converge.

### Clutter sensitivity

Clutter degrades **pixel** observation specifically. Pixel pass rate falls from **71.6%** (no clutter) to 56.9% (medium) to **54.5%** (high) — a **17.1-point** drop. The semantic modes are far more robust: AX-tree drops only **3.6** points (80.6%→77.0%) and browser_use is essentially flat (89.2%→89.1%, ~0). SoM sits between (78.6%→67.1%, **11.5** points), consistent with its reliance on rendered set-of-marks overlays that themselves crowd under clutter. The same pattern holds for **compact spacing**: pixel loses 13.4 points (70.1%→56.7%) and SoM 11.8, while AX-tree and browser_use lose only ~4–5. Clutter and compact layouts do not change the underlying DOM, so semantic agents are insulated, while pixel/SoM agents must resolve the right target among more distractors at finer pitch — the **target-acquisition** mechanism (target acquisition / wrong-instance is the dominant Layer-2 pixel bucket at 59.4%). In short, clutter is a perception-grounding stressor that hurts exactly the modes that ground in pixels.

### Mode-specific mechanisms

The per-component-by-mode pass rates show the modes fail through different mechanisms:

- **Pixel — grounding under clutter and small/precise targets.** Pixel collapses on `select_native` (**0.0%**: the native OS dropdown cannot be operated by clicking pixels) and trails on calibration-heavy or small-target controls (`resizable_columns` 31.7%, `feed_infinite_scroll` 43.3%, `color_picker_2d` 44.2%, `slider_range` 46.7%). Its largest deterministic buckets are transient-state-loss (21.6%) and target-acquisition (12.8%), and it carries the worst clutter penalty (−17.1 points). `data_grid_editable-antd-T04` is representative: all 20 clicks land ~60px right of a small checkbox (center ~x=967) in the cell's padding, so the value never flips.
- **browser_use — weak on drag/drop and spatial manipulation.** Despite the highest overall pass rate, browser_use is worst on direct-manipulation components: `kanban_board_drag_drop` **26.7%**, `drag_drop_sortable_list` **32.0%**, `drag_drop_between_lists` 36.7%, `slider_range` 52.0%, `window_splitter` 55.3% — its action space favors semantic DOM operations over pointer drags. Consistently, 54.0% of its Layer-2 failures are "widget-specific procedure missing" (it never issues the manipulation the widget needs), and it does so via long sequences (~9–12 successful steps on these components vs 1–2 for humans).
- **AX-tree / SoM — semantic blind spots and commit omissions.** AX-tree is near-perfect on click/disclosure widgets (accordion, checkbox, links at 100%) but weak where the accessibility tree under-describes spatial state: `resizable_columns` **10.0%**, `meter` 34.2%, `color_picker_2d` 41.3%, `slider_range` 45.8%. Its Layer-2 profile is dominated by missing-commit (30.7%) and widget-procedure (29.7%) — it reads the target but omits the confirming/idiomatic action. SoM mirrors this with added clutter sensitivity (`window_splitter` 6.7%, `rich_text_editor` 10.0%, `meter` 32.5%). `rich_text_editor-mantine-T14` shows the procedure gap directly: the agent never produces a stable two-word "high priority" selection and never clicks the Highlight control, so the select-then-highlight idiom is never completed; only browser_use, which programmatically creates the selection first, succeeds.
- **Native-select: click-vs-semantic.** `select_native` is the cleanest split: pixel **0.0%**, SoM 52.5%, AX-tree 53.3%, browser_use **100.0%**. The control is invisible to pixel clicking but fully addressable through the DOM — a single component that isolates the click-vs-semantic axis.
