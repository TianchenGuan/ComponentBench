// case_study_workflow.js — the adversarial verification workflow behind
// docs/failure_case_studies.md.
//
// What this is: a declarative agent-pipeline script (written for an internal
// multi-agent workflow runner with `agent` / `pipeline` / `parallel` / `phase`
// primitives) that produced and verified the 20 trace-grounded failure case
// studies released with ComponentBench. It is published for transparency about
// how the case studies were built:
//
//   Phase 1 (Cases): one agent per failure area opens the REAL evidence for
//     each candidate failure — screenshots, raw per-step model responses, the
//     Layer-2 per-trace diagnosis, and summary_info.json — and writes a
//     structured case study with an assigned mechanism category.
//   Phase 2 (Verify): an independent adversarial verifier re-opens the same
//     evidence for every case, defaults to skepticism, and either confirms the
//     assigned category or corrects it (5 of 20 were corrected; the published
//     doc reports the verifier-corrected label and keeps the disagreement
//     visible).
//   Phase 3 (Synthesize): a final agent reconciles the deterministic 5-model
//     taxonomy with the Layer-2 labels and writes the aggregate narrative.
//
// The referenced inputs (case_candidates.json, taxonomy CSVs, Layer-2
// observation packets, and the raw trace directories) are derived from the
// released run archives on the Hugging Face dataset
// (https://huggingface.co/datasets/TianchenGuan/ComponentBench, runs/ and
// runs_lite/). Paths below are placeholders — point OUT and L2 at your local
// copies. The script is not runnable stand-alone; it documents the exact
// prompts, schemas, and verification contract used.

export const meta = {
  name: 'mechanistic-case-studies',
  description: 'Trace-grounded failure case studies for the ComponentBench mechanistic analysis (read real traces+screenshots, adversarially verify, synthesize)',
  phases: [
    { title: 'Cases', detail: 'one agent per failure area reads real traces+screenshots and writes grounded case studies' },
    { title: 'Verify', detail: 'adversarial verifier re-reads each case trace+screenshot to confirm the assigned mechanism' },
    { title: 'Synthesize', detail: 'reconcile deterministic + Layer2 taxonomies, write the aggregate narrative' },
  ],
}

// Point these at your local copies (see header comment).
const OUT = process.env.CB_ANALYSIS_OUT || '/path/to/failure_analysis/out'
const L2 = process.env.CB_LAYER2_TASKS || '/path/to/layer2_v1/tasks'

const AREAS = [
  { key: 'spatial', label: 'spatial manipulation (slider_range, alpha_slider, window_splitter, resizable_columns, color_picker_2d, meter)' },
  { key: 'drag', label: 'drag/drop (drag_drop_sortable_list, drag_drop_between_lists, kanban_board_drag_drop)' },
  { key: 'editors', label: 'advanced editors (rich_text_editor, code_editor, data_grid_editable, json_editor, markdown_editor)' },
  { key: 'transient', label: 'transient UI (context_menu, popover, combobox, date/time picker, tree_select, cascader)' },
  { key: 'other', label: 'clutter / multi-instance / wrong-instance cases' },
]

const CASE_SCHEMA = {
  type: 'object',
  required: ['area', 'cases'],
  properties: {
    area: { type: 'string' },
    cases: {
      type: 'array',
      items: {
        type: 'object',
        required: ['task_id', 'canonical_type', 'family', 'library', 'difficulty', 'instruction',
          'model_mode', 'status', 'human_steps', 'agent_action_summary', 'verifier_reason',
          'assigned_category', 'mechanism', 'trace_dir', 'screenshot_paths', 'evidence_grounded'],
        properties: {
          task_id: { type: 'string' },
          canonical_type: { type: 'string' },
          family: { type: 'string' },
          library: { type: 'string' },
          difficulty: { type: 'string' },
          instruction: { type: 'string' },
          model_mode: { type: 'string' },
          status: { type: 'string' },
          human_steps: { type: ['number', 'string', 'null'] },
          agent_action_summary: { type: 'string', description: 'concise summary of the agent action sequence from the trace' },
          verifier_reason: { type: 'string', description: 'final verifier/termination reason if available, else "n/a"' },
          assigned_category: { type: 'string', description: 'one of the 9 taxonomy categories' },
          mechanism: { type: 'string', description: '2-3 sentence trace-grounded explanation of WHY it failed' },
          trace_dir: { type: 'string' },
          screenshot_paths: { type: 'array', items: { type: 'string' } },
          evidence_grounded: { type: 'boolean', description: 'true only if you actually opened the trace/screenshot and the mechanism is visible' },
        },
      },
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['task_id', 'supported', 'corrected_category', 'note'],
  properties: {
    task_id: { type: 'string' },
    supported: { type: 'boolean', description: 'is the assigned_category genuinely supported by the trace+screenshot evidence?' },
    corrected_category: { type: 'string', description: 'the category you would assign (same as original if supported)' },
    note: { type: 'string', description: 'one sentence: what the screenshot/trace actually shows' },
  },
}

phase('Cases')
const TAXONOMY = `The 9-category trace-based failure taxonomy:
- target_acquisition_or_wrong_instance: clicked/acted on the wrong element or a non-target instance, or missed a small target.
- continuous_calibration_error: slider/splitter/resizable/color control interacted with but final value/tolerance wrong.
- drag_execution_failure: drag/drop task where no valid drag sequence was emitted or drop landed outside the target.
- transient_state_loss: overlay/menu/popover/combobox/date-picker/editor opened then dismissed/lost before the final selection.
- missing_commit_or_confirmation: manipulated the relevant fields but never clicked the required Apply/Save/OK/Confirm.
- widget_specific_procedure_missing: data-grid/rich-text/code editor where the agent never entered edit mode / selected text / triggered the component-specific control.
- repetition_or_no_progress_loop: repeated the same action/coordinate with no verifier progress until the step limit (root cause only when no component mechanism applies).
- semantic_value_error: entered a value but it was semantically wrong.
- other_or_unclear: trace does not support any confident category.`

const cases = await pipeline(
  AREAS,
  // Stage 1: produce grounded case studies for the area
  (area) => agent(
`You are building a trace-grounded failure case-study set for a COLM camera-ready mechanistic analysis of the ComponentBench computer-use-agent benchmark. Focus area: ${area.label}.

${TAXONOMY}

Candidate failures (pre-ranked, deterministic features already computed) are in: ${OUT}/case_candidates.json under the key "${area.key}". Read that file and take the "${area.key}" list.

Your job: pick the 3-4 STRONGEST examples for this area and write a trace-grounded case study for each. Prefer cases where: human solved in <=2 steps but the agent failed; the trace clearly shows the mechanism; screenshots are available; multiple models/modes likely fail similarly; easy to explain in 2-3 sentences.

For EACH chosen case you MUST actually open the evidence (do not guess):
1. Read the final + a couple intermediate screenshots: \`<trace_dir>/screenshot_step_0.png\`, the last \`screenshot_step_N.png\`, and one middle one. (Use the Read tool on the PNG — you can see images.)
2. Read 2-3 \`<trace_dir>/raw_response_step_*.txt\` (the agent's <think> + action) including step 0 and the last step.
3. Read the existing Layer-2 diagnosis if present: \`${L2}/<task_id>/observation.json\` — use its run_observations[].failure_or_success_narrative (for the matching mode) and paper_useful_quote to corroborate, but base your mechanism on what YOU see in the trace.
4. Read \`<trace_dir>/summary_info.json\` for cum_reward (0=fail) / n_steps if present.

Then write the case with: task_id, canonical_type, family, library, difficulty (bucket/tier), instruction (the task name/goal), model_mode, status (FAIL), human_steps, agent_action_summary (concise, from the real trace), verifier_reason (termination/reward), assigned_category (one of the 9, grounded), mechanism (2-3 sentences: WHY it failed, citing what the screenshot/trace shows — e.g. "clicked the hue bar instead of the alpha bar", "released the drag outside the drop zone", "opened the date popover then clicked away"), trace_dir, screenshot_paths (the PNGs you looked at), evidence_grounded (true only if you actually opened them).

Be rigorous and honest: if a candidate looks like a benchmark artifact (e.g. native OS dropdown not renderable, verifier false-negative) rather than a genuine agent failure, say so in the mechanism and set assigned_category accordingly (or other_or_unclear). Do NOT fabricate. Return the structured object.`,
    { label: `cases:${area.key}`, phase: 'Cases', schema: CASE_SCHEMA }
  ),
  // Stage 2: adversarially verify each case in the area against the real evidence
  (caseSet, area) => {
    if (!caseSet || !caseSet.cases) return { area: area.key, cases: [], verdicts: [] }
    return parallel(caseSet.cases.map(c => () =>
      agent(
`Adversarially verify one failure case study for the ComponentBench mechanistic analysis. Default to skepticism: only confirm if the trace+screenshot truly show the claimed mechanism.

Case: task ${c.task_id}, ${c.model_mode}, assigned_category = "${c.assigned_category}".
Claimed mechanism: "${c.mechanism}"
Trace dir: ${c.trace_dir}

Independently open the evidence and check:
- Read the final screenshot and step-0 screenshot in ${c.trace_dir} (screenshot_step_*.png).
- Read the last 2 raw_response_step_*.txt actions in ${c.trace_dir}.
- Optionally cross-check ${L2}/${c.task_id}/observation.json.

Decide: is "${c.assigned_category}" genuinely supported by what you see (the screenshot shows the claimed state; the actions match the claim)? If the real mechanism differs, give corrected_category from the 9-category taxonomy. One-sentence note on what the evidence actually shows. Return the structured verdict.`,
        { label: `verify:${c.task_id}`, phase: 'Verify', schema: VERDICT_SCHEMA }
      ).then(v => ({ ...c, _verdict: v }))
    )).then(verified => ({ area: area.key, cases: verified.filter(Boolean) }))
  }
)

phase('Synthesize')
const flatCases = cases.filter(Boolean).flatMap(a => (a.cases || []).map(c => ({
  area: a.area, task_id: c.task_id, model_mode: c.model_mode, category: c.assigned_category,
  supported: c._verdict?.supported, corrected: c._verdict?.corrected_category,
  mechanism: c.mechanism, verdict_note: c._verdict?.note,
})))
log(`Collected ${flatCases.length} verified case studies across ${cases.length} areas`)

const synthesis = await agent(
`You are writing the synthesis section of a COLM camera-ready mechanistic failure analysis for ComponentBench (a component-level computer-use-agent benchmark).

Read these deterministic result files (already computed over 5 models x 4 modes x 2910 tasks):
- ${OUT}/taxonomy_counts.csv  (deterministic 5-model taxonomy + Layer2 taxonomy by mode)
- ${OUT}/looping_cooccurrence.csv  (looping as a co-occurring symptom across categories)
- ${OUT}/agg_by_family.csv and ${OUT}/agg_by_component.csv  (pass/fail by family/component)
- ${OUT}/human_easy_agent_hard.csv  (human<=2 steps but agent pass<60%)
- ${OUT}/clutter_spacing_effects.csv  (pass rate by clutter/spacing/instances x mode)
- ${OUT}/agg_by_component_mode.csv  (pixel vs ax_tree vs som vs browser_use per component)

Here are the verified trace-grounded case studies (JSON): ${JSON.stringify(flatCases).slice(0, 6000)}

Write 4 markdown sections (return as one markdown string in the 'text' field):
1. "### Aggregate failure taxonomy" — reconcile the TWO methods (deterministic component-mechanism mapping across all 5 models vs Layer-2 per-trace labels on gemini-flash-lite). State the dominant mechanisms (calibration, transient-state-loss, target-acquisition, widget-procedure) and that the two methods agree on the big buckets. Be explicit about method limits (deterministic = component-driven prior refined by trace features; Layer2 = LLM-read, 1 model). Note the looping symptom is downstream of these mechanisms, not a root cause.
2. "### Spatial manipulation" — using human_easy_agent_hard + agg_by_family, explain WHY spatial families fail (continuous calibration + drag execution), with 1-2 case pointers.
3. "### Clutter sensitivity" — using clutter_spacing_effects, quantify the pixel clutter degradation (none->high) and contrast modes (is clutter worse for pixel than ax_tree/browser_use?). Tie to target-acquisition failures.
4. "### Mode-specific mechanisms" — e.g. browser_use weak on drag/drop, pixel weak under clutter / small targets, native-select click-vs-semantic. Use agg_by_component_mode.

Be concise and camera-ready. Use real numbers from the CSVs. Return the markdown in 'text'.`,
  { label: 'synthesize', phase: 'Synthesize', schema: {
    type: 'object', required: ['text'], properties: { text: { type: 'string' } } } }
)

return { cases, flatCases, synthesis: synthesis.text }
