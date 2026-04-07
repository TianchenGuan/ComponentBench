import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';
import yaml from 'js-yaml';
import { createJob, updateJob, setJobPhase } from '@/lib/tasklab-jobs';

const PROJECT_ROOT = path.resolve(process.cwd(), '..');
const DRAFTS_DIR = path.join(PROJECT_ROOT, 'data', 'tasklab_drafts');
const PLAYGROUND_DIR = path.join(process.cwd(), 'src', 'runners', '_playground');
const CODEX_PATH = '/home/users/tg295/.nvm/versions/node/v22.22.0/bin/codex';

/**
 * Two-stage playground task generation pipeline.
 *
 * Stage 1 — Task design:
 *   Codex (gpt-5.4, xhigh reasoning) takes the user's one-line instruction
 *   and produces a fully-filled task specification YAML. This mirrors the
 *   original ComponentBench pipeline where GPT-5.2 Pro designed task specs
 *   under the shared schema defined in local/prompt.txt.
 *
 * Stage 2 — Task implementation:
 *   Codex (gpt-5.4, xhigh reasoning) reads the designed spec and writes
 *   the React component to site/src/runners/_playground/<taskId>.tsx.
 *
 * Each stage runs sequentially and emits phase events to the in-memory job
 * store so the frontend progress bar can show where we are.
 */

const STAGE1_DESIGN_PROMPT = (
  instruction: string,
  safeTaskId: string,
  draftYamlPath: string,
  draftYamlContent: string,
) => `You are designing ONE task for ComponentBench Playground.

ComponentBench is a research benchmark for computer-use agents, evaluating their ability to interact with realistic UI components in a real browser (BrowserGym). Each task focuses on a single UI interaction scenario and ends automatically when the agent reaches the correct end state.

USER'S RAW INSTRUCTION:
"${instruction}"

USER'S EXISTING DRAFT (optional hints — may be mostly empty):
\`\`\`yaml
${draftYamlContent}
\`\`\`

YOUR JOB:
Take this one-line instruction and design a FULLY-SPECIFIED task that a separate coding agent will then implement as a React page. You must think deeply about what the user actually wants, what the success condition should be, what the scene/context should look like, and what could go wrong.

IMPORTANT — RESPECT USER HINTS:
The draft above may contain hints the user explicitly set. These are NOT defaults — they are deliberate choices. You MUST respect them:
- If library is set, use it.
- If canonical_type is set, design around that component type.
- If task_template is set, use it as the primary template.
- If scene_context fields are set, honor them exactly (theme, spacing, layout, placement, scale, instances, guidance, clutter).
- If difficulty_bucket / difficulty_tier is set, match it. Adjust axes_ratings accordingly.
- If axes_ratings values are set (non-zero), respect them — they describe how hard the user wants the task to be on each axis.
- If success_conditions are provided, use them as the basis for success_trigger.human_readable and canonical_predicate.
- If negative_cases are provided, include them in your negative_cases list.
- If setup_description has user text, treat it as authoritative context (e.g., initial state, mock data).

For any field the user left empty/null/zero/any, YOU design it from scratch based on the instruction.

Write the full task specification as YAML to this exact file path:
${draftYamlPath}

================================================================================
REQUIRED YAML SCHEMA
================================================================================

task_id: ${safeTaskId}
name: (short descriptive name, e.g., "Coffee order: medium size with oat milk")
canonical_type: _playground
implementation_source: (pick ONE: antd | mui | mantine | native | composite)
implementation_variant: (string or null, optional)
task_template: (pick ONE primary — see list below)
secondary_template: (optional or null)

browsergym_goal: |
  The EXACT instruction string to give the agent. Must be:
  - Natural language, plausible micro-user intent
  - Specifies all required choices/values
  - Specifies if Apply/OK/Confirm is required
  - MUST end with: "The task will finish automatically when done."
  - MUST NOT include internal tolerances, hidden checker rules, or pixel coordinates

ui_copy: |
  The text shown on the page to a human user.
  Should match browsergym_goal in intent. Can be more concise or formatted.

setup_description: |
  DETAILED description of the UI the implementation agent must build.
  Must describe:
  - Layout context (isolated card, form section, dashboard, modal, etc.)
  - Component size tier and spacing mode
  - Whether it is inline or in an overlay (popover/modal/drawer), and what opens it
  - Number of instances and labels (if >1)
  - Sub-controls that exist (text inputs, presets, sliders, search box, clear button, etc.)
  - Initial state (default values, pre-selected options, empty fields)
  - Distractors if any
  - Feedback mechanisms (Apply button, validation errors, toasts, success banner)
  - Visual styling hints (colors, labels, headings)

scene_context:
  theme: light | dark
  spacing: comfortable | compact | condensed
  layout: isolated_card | form_section | settings_panel | dashboard | table_cell | modal_flow | drawer_flow
  placement: center | top_left | top_right | bottom_left | bottom_right
  scale: default | small | large
  instances: 1 | 2 | 3
  guidance: text | visual | mixed
  clutter: none | low | medium | high

difficulty:
  difficulty_bucket: easy | medium | hard
  tier: L0 | L1 | L2 | L3
  axes_ratings:
    precision_requirement: 1-5      # How exact must the final state be?
    target_acquisition: 1-5         # How hard to click/drag the correct target?
    density_choice_interference: 1-5 # Option count and confusability
    depth_layering: 1-5             # Overlay depth, nested panels, confirmation
    feedback_dynamics: 1-5          # Feedback latency, Apply/OK requirements
    semantic_observability: 1-5     # Is state visible as text/preview? Clean in AX tree?
    disambiguation_load: 1-5        # Multiple instances, clutter, similar distractors
  justification: (1-2 sentences explaining the difficulty rating)

success_trigger:
  human_readable:
    - (bullet list of success conditions in canonical terms)
  canonical_predicate:
    predicate_type: equals | within_tolerance | set_membership | range_contains | path_equals | matches_reference
    target_state: (canonical target value(s) — number/date/string/object)
    tolerance: (if applicable, else null)
    require_confirm: true | false
    confirm_control: (label/id of Apply/OK button, or null)
    require_correct_instance: true | false
    target_instance_label_or_id: (if instances > 1, else null)
    terminal_condition: "task ends when predicate holds"

negative_cases:
  - (bullet list of what must NOT count as success)
  # Must include common failure modes for this interaction:
  # - wrong instance modified (if instances > 1)
  # - value committed before Apply was pressed (if require_confirm)
  # - value close but outside tolerance
  # - partial completion
  # - wrong format

expected_interaction_path: |
  Short outline of typical steps (NOT included in browsergym_goal).
  e.g., "Click size: Medium → Click milk: Oat → Click Place Order → see confirmation banner"

notes: |
  Any implementation hints, library caveats, or design decisions the coding agent should know.
  Especially important: describe how the success state should be detected programmatically
  (what DOM change, what state variable, what visible text) so the implementation agent can
  wire up the onSuccess() callback correctly.

================================================================================
TASK TEMPLATES (pick ONE for task_template)
================================================================================

activate, navigate_to, disclose, open_overlay, confirm_cancel, toggle_state,
enter_text, enter_formatted, select_one, select_many, open_and_select,
search_and_select, set_scalar, set_range, match_reference, clear_reset,
hierarchical_path_select, table_operation, file_upload, file_manage,
drag_operation, editor_operation, scroll_find, transfer_move

================================================================================
DESIGN PRINCIPLES
================================================================================

1. Think deeply about what the user ACTUALLY wants. Read their instruction as a
   product manager would read a vague user request — make sensible assumptions
   about what a "good" version of this task looks like.

2. Make the success condition UNAMBIGUOUS. A coding agent should be able to
   read your canonical_predicate and know exactly what DOM state or variable
   to check.

3. Be concrete. Instead of "a coffee order form", specify "three radio groups
   for size (small, medium, large), three radio groups for milk type (dairy,
   oat, almond), and a disabled-until-valid submit button".

4. Include realistic distractors and feedback only if the user's instruction
   implies them. Default to a CLEAN, focused scene.

5. The ui_copy and browsergym_goal should match in intent but don't need to
   be identical strings. The browsergym_goal is what the agent sees; the
   ui_copy is what a human user would see on the page.

6. If the user's instruction implies a multi-step task (wizard, booking flow,
   etc.), use task_template = open_and_select or a composite template, and
   describe each step in setup_description.

7. The task should be achievable by a human in under 10 seconds of real
   interaction. Benchmark tasks are SHORT and FOCUSED.

WRITE THE YAML NOW. Overwrite the existing file completely.`;

const STAGE2_IMPLEMENT_PROMPT = (
  yamlContent: string,
  relativeComponentPath: string,
) => `You are implementing ONE ComponentBench Playground task as a React component.

Here is the complete task specification (YAML) — read it carefully:

\`\`\`yaml
${yamlContent}
\`\`\`

Write a self-contained React component to this exact path:
${relativeComponentPath}

REQUIREMENTS:

1. Implement the task EXACTLY as described in setup_description.
   Match the layout, sub-controls, initial state, and feedback mechanisms.

2. Follow the scene_context (theme, spacing, layout, placement, scale).

3. Use the library from implementation_source:
   - antd → import from 'antd' and '@ant-design/icons'
   - mui → import from '@mui/material' and '@mui/icons-material'
   - mantine → import from '@mantine/core' and '@mantine/hooks'
   - native → use native HTML elements with inline styles
   - composite → pick the most appropriate library

4. Implement the success_trigger EXACTLY:
   - Read canonical_predicate to know what state counts as success
   - Call onSuccess() when that state is reached
   - Respect require_confirm (only fire onSuccess after Apply/OK is pressed)
   - Respect require_correct_instance (only fire for the target instance)

5. Prevent the negative_cases from firing onSuccess:
   - If wrong instance → don't fire
   - If value close but outside tolerance → don't fire
   - If partial completion → don't fire

6. Include visual feedback after success (toast, banner, confirmation text).

7. Component shape:
\`\`\`tsx
'use client';
import React, { useState } from 'react';
// ...library imports...

interface TaskComponentProps {
  task: any;
  onSuccess: () => void;
}

export default function PlaygroundTask({ task, onSuccess }: TaskComponentProps) {
  // ...state...
  return (
    <div>
      {/* implementation matching setup_description */}
    </div>
  );
}
\`\`\`

8. Include a brief comment at the top describing the task
   (you can quote the name and browsergym_goal fields from the YAML).

9. The component must be fully self-contained — no external network calls,
   no unavailable imports. Available libraries are:
   - react, react-dom
   - antd, @ant-design/icons
   - @mui/material, @mui/icons-material, @mui/system
   - @mantine/core, @mantine/hooks, @mantine/dates, @mantine/notifications
   - lucide-react, @tabler/icons-react
   - dayjs
   - Native HTML + inline styles

10. Be faithful to the task spec. Do NOT add extra features the spec doesn't
    mention. Do NOT skip features the spec requires.

Write the file now.`;

async function runCodex(
  prompt: string,
  opts: { cwd: string; onFirstOutput?: () => void },
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(
      CODEX_PATH,
      [
        'exec',
        '-c', 'approval_policy="never"',
        '-c', 'model="gpt-5.4"',
        '-c', 'model_reasoning_effort="high"',
        prompt,
      ],
      {
        cwd: opts.cwd,
        env: { ...process.env, HOME: '/home/users/tg295' },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );

    let stdout = '';
    let stderr = '';
    let firstOutputSeen = false;

    child.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
      if (!firstOutputSeen) {
        firstOutputSeen = true;
        opts.onFirstOutput?.();
      }
    });
    child.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });
    child.on('close', (code) => resolve({ exitCode: code ?? -1, stdout, stderr }));
    child.on('error', (err) =>
      resolve({ exitCode: -1, stdout, stderr: `${stderr}\nspawn error: ${err.message}` }),
    );
  });
}

/**
 * Kick off the two-stage generation in the background.
 * Returns a jobId immediately; the frontend polls /api/tasklab/status/<jobId>.
 */
/**
 * Required fields for a well-formed task spec. Stage 2 needs all of these.
 */
const REQUIRED_SPEC_FIELDS = [
  'task_id',
  'browsergym_goal',
  'setup_description',
  'success_trigger',
] as const;

interface ValidationResult {
  ok: boolean;
  errors: string[];
  normalizedYaml?: string;
}

/**
 * Validate the YAML produced by Stage 1:
 *   1. Must parse as YAML
 *   2. Must contain required top-level fields
 *   3. success_trigger must have canonical_predicate
 * Returns normalized YAML (re-serialized to avoid quoting issues) on success.
 */
function validateTaskSpec(yamlContent: string): ValidationResult {
  let parsed: Record<string, unknown>;
  try {
    parsed = yaml.load(yamlContent) as Record<string, unknown>;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, errors: [`YAML parse error: ${msg}`] };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, errors: ['YAML is empty or not an object'] };
  }

  const errors: string[] = [];
  for (const field of REQUIRED_SPEC_FIELDS) {
    if (parsed[field] === undefined || parsed[field] === null || parsed[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Deeper check: success_trigger should have canonical_predicate
  const successTrigger = parsed.success_trigger as Record<string, unknown> | undefined;
  if (successTrigger && typeof successTrigger === 'object') {
    if (!successTrigger.canonical_predicate) {
      errors.push('success_trigger is missing canonical_predicate');
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  // Normalize: re-serialize with js-yaml to get proper quoting,
  // consistent indentation, and remove any other lurking parse issues.
  const normalizedYaml = yaml.dump(parsed, {
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
  });

  return { ok: true, errors: [], normalizedYaml };
}

/**
 * Ask GPT-5.4 to fix a broken YAML spec. Writes the repaired YAML
 * directly to disk (more reliable than parsing stdout).
 * Returns true if the file was successfully repaired and now parses.
 */
async function repairTaskSpec(
  yamlPath: string,
  yamlPathRelative: string,
  brokenYaml: string,
  errors: string[],
  cwd: string,
): Promise<boolean> {
  const prompt = `The task specification YAML at "${yamlPathRelative}" has errors. Read the file, fix ALL the errors, and write the corrected YAML back to the same path.

ERRORS:
${errors.map((e) => `- ${e}`).join('\n')}

BROKEN YAML CONTENT:
\`\`\`yaml
${brokenYaml}
\`\`\`

RULES (CRITICAL — read carefully):

1. Overwrite the file at: ${yamlPathRelative}

2. The YAML must parse cleanly with the standard js-yaml library.

3. If a value contains a colon (":"), wrap the entire value in double quotes.
   BAD:  name: Theater seating: choose 3 seats
   GOOD: name: "Theater seating: choose 3 seats"

4. If a value contains any of these characters, wrap it in double quotes:
   colon (:), at-sign (@), pipe (|), greater-than (>), exclamation (!), hash (#),
   ampersand (&), asterisk (*), percent (%), backtick (\`), curly braces ({}),
   square brackets ([]), comma (,), question mark (?)

5. Multi-line strings should use the YAML literal block scalar syntax:
   setup_description: |
     Line one
     Line two

6. Preserve ALL the original content — only fix the errors. Do not delete
   sections or rephrase content.

7. Make sure these required top-level fields are present and non-empty:
   - task_id
   - browsergym_goal
   - setup_description
   - success_trigger (must contain both human_readable and canonical_predicate)

8. canonical_predicate must be an object with at least:
   - predicate_type
   - target_state
   - require_confirm

Write the corrected YAML to ${yamlPathRelative} now.`;

  const result = await runCodex(prompt, { cwd });
  if (result.exitCode !== 0) {
    console.log(`[TaskLab] Repair codex call failed: exit ${result.exitCode}`);
    return false;
  }

  // Read the file back from disk and verify it parses
  try {
    const fixed = await fs.readFile(yamlPath, 'utf-8');
    yaml.load(fixed); // throws if invalid
    return true;
  } catch (err) {
    console.log(
      `[TaskLab] Repair file still invalid: ${err instanceof Error ? err.message : err}`,
    );
    return false;
  }
}

async function runPipeline(
  jobId: string,
  safeTaskId: string,
  instruction: string,
  draftYamlContent: string,
) {
  const yamlPath = path.join(DRAFTS_DIR, `${safeTaskId}.yaml`);
  const draftYamlRelative = `data/tasklab_drafts/${safeTaskId}.yaml`;
  const componentPath = path.join(PLAYGROUND_DIR, `${safeTaskId}.tsx`);
  const relativeComponentPath = `site/src/runners/_playground/${safeTaskId}.tsx`;

  try {
    // ---------- STAGE 1: DESIGN TASK ----------
    setJobPhase(jobId, 'designing_task', 'GPT-5.4 is designing the task specification…');
    console.log(`[TaskLab] Stage 1: designing task ${safeTaskId}`);

    const stage1Prompt = STAGE1_DESIGN_PROMPT(
      instruction,
      safeTaskId,
      draftYamlRelative,
      draftYamlContent,
    );
    const stage1 = await runCodex(stage1Prompt, { cwd: PROJECT_ROOT });

    if (stage1.exitCode !== 0) {
      setJobPhase(jobId, 'failed', `Stage 1 (design) failed: exit ${stage1.exitCode}`);
      updateJob(jobId, {
        status: 'failed',
        completedAt: Date.now(),
        output: stage1.stdout,
        error: stage1.stderr || `Codex exited with code ${stage1.exitCode} during design stage.`,
      });
      return;
    }

    // Verify the YAML file was updated
    let designedYaml: string;
    try {
      designedYaml = await fs.readFile(yamlPath, 'utf-8');
    } catch {
      setJobPhase(jobId, 'failed', 'Stage 1 produced no YAML file');
      updateJob(jobId, {
        status: 'failed',
        completedAt: Date.now(),
        output: stage1.stdout,
        error: 'Stage 1 (design) did not produce a YAML spec.',
      });
      return;
    }

    updateJob(jobId, {
      output: `=== STAGE 1: TASK DESIGN ===\n${stage1.stdout}\n\n=== DESIGNED YAML ===\n${designedYaml}\n\n`,
      designedYaml,
    });

    // ---------- VALIDATION LAYER ----------
    setJobPhase(jobId, 'validating_spec', 'Validating task specification…');
    console.log(`[TaskLab] Validating spec for ${safeTaskId}`);

    let validation = validateTaskSpec(designedYaml);
    let validatedYaml = designedYaml;

    if (!validation.ok) {
      console.log(
        `[TaskLab] Spec validation failed for ${safeTaskId}: ${validation.errors.join('; ')}`,
      );
      setJobPhase(jobId, 'validating_spec', 'Spec has errors — asking GPT-5.4 to repair…');

      const repaired = await repairTaskSpec(
        yamlPath,
        draftYamlRelative,
        designedYaml,
        validation.errors,
        PROJECT_ROOT,
      );
      if (repaired) {
        // Read the fixed file from disk and re-validate
        const fixedYaml = await fs.readFile(yamlPath, 'utf-8');
        const reValidation = validateTaskSpec(fixedYaml);
        if (reValidation.ok && reValidation.normalizedYaml) {
          validation = reValidation;
          validatedYaml = reValidation.normalizedYaml;
          // Write the normalized version back
          await fs.writeFile(yamlPath, validatedYaml, 'utf-8');
          // Update the job's designedYaml so the UI shows the repaired version
          updateJob(jobId, { designedYaml: validatedYaml });
          console.log(`[TaskLab] Spec repaired successfully for ${safeTaskId}`);
        } else {
          console.log(
            `[TaskLab] Repair attempt still invalid: ${reValidation.errors.join('; ')}`,
          );
        }
      }
    } else if (validation.normalizedYaml) {
      // Even if valid, re-write normalized version to fix any quoting issues
      validatedYaml = validation.normalizedYaml;
      await fs.writeFile(yamlPath, validatedYaml, 'utf-8');
    }

    if (!validation.ok) {
      setJobPhase(jobId, 'failed', `Spec validation failed: ${validation.errors[0]}`);
      updateJob(jobId, {
        status: 'failed',
        completedAt: Date.now(),
        output: `=== STAGE 1 DESIGN ===\n${designedYaml}\n\n=== VALIDATION ERRORS ===\n${validation.errors.join('\n')}\n`,
        error: `Task specification is invalid: ${validation.errors.join('; ')}`,
        designedYaml,
      });
      return;
    }

    // Spec is valid — update job with normalized YAML
    updateJob(jobId, { designedYaml: validatedYaml });

    // ---------- STAGE 2: IMPLEMENT TASK ----------
    setJobPhase(jobId, 'spawning_codex', 'Spawning GPT-5.4 for implementation…');
    console.log(`[TaskLab] Stage 2: implementing task ${safeTaskId}`);

    const stage2Prompt = STAGE2_IMPLEMENT_PROMPT(validatedYaml, relativeComponentPath);
    const stage2 = await runCodex(stage2Prompt, {
      cwd: PROJECT_ROOT,
      onFirstOutput: () => setJobPhase(jobId, 'generating', 'GPT-5.4 is writing the component…'),
    });

    if (stage2.exitCode !== 0) {
      setJobPhase(jobId, 'failed', `Stage 2 (implement) failed: exit ${stage2.exitCode}`);
      updateJob(jobId, {
        status: 'failed',
        completedAt: Date.now(),
        output: `=== STAGE 1 DESIGN ===\n${designedYaml}\n\n=== STAGE 2 OUTPUT ===\n${stage2.stdout}\n`,
        error: stage2.stderr || `Codex exited with code ${stage2.exitCode} during implement stage.`,
      });
      return;
    }

    // Verify the component file was created
    setJobPhase(jobId, 'verifying_file', 'Verifying generated file…');
    try {
      await fs.access(componentPath);
    } catch {
      setJobPhase(jobId, 'failed', 'Stage 2 produced no component file');
      updateJob(jobId, {
        status: 'failed',
        completedAt: Date.now(),
        output: `=== STAGE 1 DESIGN ===\n${designedYaml}\n\n=== STAGE 2 OUTPUT ===\n${stage2.stdout}\n`,
        error: 'Stage 2 (implement) did not produce a component file.',
      });
      return;
    }

    setJobPhase(jobId, 'completed', 'Component ready');
    updateJob(jobId, {
      status: 'completed',
      completedAt: Date.now(),
      output: `=== STAGE 1 DESIGN ===\n${designedYaml}\n\n=== STAGE 2 IMPLEMENTATION ===\n${stage2.stdout}\n`,
      filePath: relativeComponentPath,
      designedYaml,
    });
    console.log(`[TaskLab] Pipeline completed for ${safeTaskId}: ${relativeComponentPath}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    setJobPhase(jobId, 'failed', `Pipeline error: ${message}`);
    updateJob(jobId, {
      status: 'failed',
      completedAt: Date.now(),
      error: message,
    });
  }
}

export async function POST(req: NextRequest) {
  if (process.env.TASKLAB_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'Task Lab is not enabled on this server' },
      { status: 403 },
    );
  }

  try {
    const { taskId } = await req.json();
    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const safeTaskId = String(taskId).replace(/[^a-zA-Z0-9_-]/g, '_');

    // Read the saved draft YAML to extract the instruction
    const yamlPath = path.join(DRAFTS_DIR, `${safeTaskId}.yaml`);
    let yamlContent: string;
    try {
      yamlContent = await fs.readFile(yamlPath, 'utf-8');
    } catch {
      return NextResponse.json(
        { error: `Draft not found: ${safeTaskId}.yaml. Save a draft first.` },
        { status: 404 },
      );
    }

    // Extract instruction from the draft YAML (simple parse)
    let instruction = '';
    const lines = yamlContent.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('browsergym_goal:')) {
        const rest = line.substring('browsergym_goal:'.length).trim();
        if (rest === '>-' || rest === '>' || rest === '|') {
          // Multi-line string — concatenate indented continuation lines
          const parts: string[] = [];
          for (let j = i + 1; j < lines.length; j++) {
            if (/^\s+/.test(lines[j])) parts.push(lines[j].trim());
            else break;
          }
          instruction = parts.join(' ');
        } else {
          instruction = rest.replace(/^['"]|['"]$/g, '');
        }
        break;
      }
    }

    if (!instruction) {
      return NextResponse.json(
        { error: 'Draft YAML missing browsergym_goal (instruction)' },
        { status: 400 },
      );
    }

    await fs.mkdir(PLAYGROUND_DIR, { recursive: true });

    const relativeComponentPath = `site/src/runners/_playground/${safeTaskId}.tsx`;
    const jobId = createJob(safeTaskId);

    // Run the two-stage pipeline in the background (fire and forget).
    // The frontend polls /api/tasklab/status/<jobId>.
    runPipeline(jobId, safeTaskId, instruction, yamlContent).catch((err) => {
      console.error(`[TaskLab] Pipeline crashed for ${safeTaskId}:`, err);
    });

    return NextResponse.json({
      success: true,
      jobId,
      status: 'running',
      filePath: relativeComponentPath,
      taskId: safeTaskId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[TaskLab] generate error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
