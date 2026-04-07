'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type Phase = 'idle' | 'checking' | 'generating' | 'completed' | 'failed';

type Feasibility = {
  feasible: boolean;
  reason?: string;
  suggestions?: string[];
};

type BackendPhase =
  | 'saving_draft'
  | 'checking_feasibility'
  | 'designing_task'
  | 'validating_spec'
  | 'spawning_codex'
  | 'generating'
  | 'verifying_file'
  | 'completed'
  | 'failed';

// Ordered list of progress steps shown to the user
const PROGRESS_STEPS: { key: BackendPhase; label: string; estimate?: string }[] = [
  { key: 'saving_draft', label: 'Save draft' },
  { key: 'checking_feasibility', label: 'Check feasibility', estimate: '~10s' },
  { key: 'designing_task', label: 'Design task specification', estimate: '~60–120s' },
  { key: 'validating_spec', label: 'Validate specification' },
  { key: 'spawning_codex', label: 'Spawn implementation' },
  { key: 'generating', label: 'Generate component', estimate: '~90–180s' },
  { key: 'verifying_file', label: 'Verify file' },
  { key: 'completed', label: 'Render preview' },
];

function stepIndex(phase: BackendPhase): number {
  return PROGRESS_STEPS.findIndex((s) => s.key === phase);
}

// ComponentBench task templates (24 canonical templates)
const TASK_TEMPLATES = [
  'activate', 'navigate_to', 'disclose', 'open_overlay', 'confirm_cancel',
  'toggle_state', 'enter_text', 'enter_formatted', 'select_one', 'select_many',
  'open_and_select', 'search_and_select', 'set_scalar', 'set_range',
  'match_reference', 'clear_reset', 'hierarchical_path_select',
  'table_operation', 'file_upload', 'file_manage', 'drag_operation',
  'editor_operation', 'scroll_find', 'transfer_move',
];

// Scene context factor options (E1–E8 from the paper)
const SCENE_FACTORS = {
  theme: ['light', 'dark', 'high_contrast'],
  spacing: ['comfortable', 'compact', 'condensed'],
  layout: ['isolated_card', 'form_section', 'settings_panel', 'dashboard', 'table_cell', 'modal_flow', 'drawer_flow'],
  placement: ['center', 'top_left', 'top_right', 'bottom_left', 'bottom_right'],
  scale: ['default', 'small', 'large'],
  instances: ['1', '2', '3'],
  guidance: ['text', 'visual', 'mixed', 'minimal'],
  clutter: ['none', 'low', 'medium', 'high'],
};

const DIFFICULTY_AXES = [
  { key: 'precision_requirement', label: 'Precision requirement' },
  { key: 'target_acquisition', label: 'Target acquisition' },
  { key: 'density_choice_interference', label: 'Density / choice interference' },
  { key: 'depth_layering', label: 'Depth / layering' },
  { key: 'feedback_dynamics', label: 'Feedback dynamics' },
  { key: 'semantic_observability', label: 'Semantic observability' },
  { key: 'disambiguation_load', label: 'Disambiguation load' },
];

export default function TaskLabPage() {
  // Core state
  const [instruction, setInstruction] = useState('');
  const [taskId, setTaskId] = useState('');
  const [title, setTitle] = useState('');

  // Workflow state
  const [phase, setPhase] = useState<Phase>('idle');
  const [backendPhase, setBackendPhase] = useState<BackendPhase | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [feasibility, setFeasibility] = useState<Feasibility | null>(null);
  const [generationOutput, setGenerationOutput] = useState('');
  const [designedYaml, setDesignedYaml] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced — all optional power-user hints. These get passed to GPT-5.4
  // in the task design prompt so it knows what the user intends.
  const [advanced, setAdvanced] = useState({
    canonicalType: '',
    library: '',
    taskTemplate: '',
    setupDescription: '',
    // Scene context hints
    sceneContext: {
      theme: '',
      spacing: '',
      layout: '',
      placement: '',
      scale: '',
      instances: '',
      guidance: '',
      clutter: '',
    },
    // Difficulty hints
    difficultyBucket: '',
    difficultyTier: '',
    axesRatings: {
      precision_requirement: 0,
      target_acquisition: 0,
      density_choice_interference: 0,
      depth_layering: 0,
      feedback_dynamics: 0,
      semantic_observability: 0,
      disambiguation_load: 0,
    },
    // Explicit verifier hints
    successConditions: [] as string[],
    negativeCases: [] as string[],
  });

  // Sub-section toggles inside Advanced
  const [showScene, setShowScene] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showVerifier, setShowVerifier] = useState(false);

  async function saveDraft(): Promise<string | null> {
    // Strip empty advanced values — only send hints the user actually set.
    const cleanedAdvanced: Record<string, unknown> = {};
    if (showAdvanced) {
      if (advanced.canonicalType) cleanedAdvanced.canonicalType = advanced.canonicalType;
      if (advanced.library) cleanedAdvanced.library = advanced.library;
      if (advanced.taskTemplate) cleanedAdvanced.taskTemplate = advanced.taskTemplate;
      if (advanced.setupDescription) cleanedAdvanced.setupDescription = advanced.setupDescription;

      // Scene context: only include factors that were set
      const sc: Record<string, string | number> = {};
      for (const [k, v] of Object.entries(advanced.sceneContext)) {
        if (v) sc[k] = k === 'instances' ? Number(v) : v;
      }
      if (Object.keys(sc).length > 0) cleanedAdvanced.sceneContext = sc;

      if (advanced.difficultyBucket) cleanedAdvanced.difficultyBucket = advanced.difficultyBucket;
      if (advanced.difficultyTier) cleanedAdvanced.difficultyTier = advanced.difficultyTier;

      // Axes ratings: only include axes with non-zero values
      const axes: Record<string, number> = {};
      for (const [k, v] of Object.entries(advanced.axesRatings)) {
        if (v && v > 0) axes[k] = v;
      }
      if (Object.keys(axes).length > 0) cleanedAdvanced.axesRatings = axes;

      const succ = advanced.successConditions.filter((s) => s.trim());
      if (succ.length > 0) cleanedAdvanced.successConditions = succ;

      const neg = advanced.negativeCases.filter((s) => s.trim());
      if (neg.length > 0) cleanedAdvanced.negativeCases = neg;
    }

    const body = {
      instruction,
      title: title || undefined,
      ...cleanedAdvanced,
    };
    try {
      const res = await fetch('/api/tasklab/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setTaskId(data.taskId);
        return data.taskId;
      }
      setStatusMessage(`Save failed: ${data.error}`);
      return null;
    } catch (e) {
      setStatusMessage(`Save error: ${e}`);
      return null;
    }
  }

  async function checkFeasibility() {
    if (!instruction.trim()) {
      setStatusMessage('Write an instruction first');
      return;
    }
    setPhase('checking');
    setBackendPhase('saving_draft');
    setStatusMessage('Saving draft…');
    setFeasibility(null);

    const id = taskId || (await saveDraft());
    if (!id) {
      setPhase('idle');
      setBackendPhase(null);
      return;
    }

    setBackendPhase('checking_feasibility');
    setStatusMessage('Asking GPT-5.4 to check feasibility…');

    try {
      const res = await fetch('/api/tasklab/check-feasibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: id }),
      });
      const data = await res.json();
      setFeasibility(data);
      setStatusMessage(data.feasible ? 'Feasible — ready to generate' : `Not feasible: ${data.reason}`);
      setPhase(data.feasible ? 'idle' : 'failed');
      setBackendPhase(data.feasible ? null : 'failed');
    } catch (e) {
      setStatusMessage(`Feasibility check error: ${e}`);
      setPhase('failed');
      setBackendPhase('failed');
    }
  }

  async function generate() {
    if (!instruction.trim()) {
      setStatusMessage('Write an instruction first');
      return;
    }

    setPhase('checking');
    setBackendPhase('saving_draft');
    setStatusMessage('Saving draft…');
    setElapsedSec(0);
    setFeasibility(null);
    setGenerationOutput('');
    setDesignedYaml('');

    const id = taskId || (await saveDraft());
    if (!id) {
      setPhase('idle');
      setBackendPhase(null);
      return;
    }

    setBackendPhase('checking_feasibility');
    setStatusMessage('Checking feasibility with GPT-5.4…');
    try {
      const fres = await fetch('/api/tasklab/check-feasibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: id }),
      });
      const fdata = await fres.json();
      setFeasibility(fdata);
      if (!fdata.feasible) {
        setStatusMessage(`Task infeasible: ${fdata.reason}`);
        setPhase('failed');
        setBackendPhase('failed');
        return;
      }
    } catch (e) {
      setStatusMessage(`Feasibility check error: ${e}`);
      setPhase('failed');
      setBackendPhase('failed');
      return;
    }

    setPhase('generating');
    setBackendPhase('spawning_codex');
    setStatusMessage('Spawning GPT-5.4 for task design…');

    try {
      const res = await fetch('/api/tasklab/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: id }),
      });
      const data = await res.json();
      if (data.success) {
        pollStatus(data.jobId);
      } else {
        setStatusMessage(`Generation failed: ${data.error}`);
        setPhase('failed');
        setBackendPhase('failed');
      }
    } catch (e) {
      setStatusMessage(`Error: ${e}`);
      setPhase('failed');
      setBackendPhase('failed');
    }
  }

  function pollStatus(jobId: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tasklab/status/${jobId}`);
        if (!res.ok) {
          // Job not found yet — keep polling
          return;
        }
        const data = await res.json();
        if (typeof data.duration === 'number') setElapsedSec(Math.round(data.duration));
        if (data.phase) setBackendPhase(data.phase as BackendPhase);
        if (data.designedYaml) setDesignedYaml(data.designedYaml);

        if (data.status === 'completed') {
          clearInterval(interval);
          setPhase('completed');
          setBackendPhase('completed');
          setGenerationOutput(data.output || '');
          setStatusMessage('Component ready');
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setPhase('failed');
          setBackendPhase('failed');
          setGenerationOutput(data.error || data.output || '');
          setStatusMessage('Generation failed. See output.');
        } else {
          const phaseLabel =
            data.phase === 'designing_task'
              ? 'GPT-5.4 is designing the task specification…'
              : data.phase === 'validating_spec'
                ? 'Validating and normalizing the specification…'
                : data.phase === 'spawning_codex'
                  ? 'Spawning GPT-5.4 for implementation…'
                  : data.phase === 'generating'
                    ? 'GPT-5.4 is writing the component…'
                    : data.phase === 'verifying_file'
                      ? 'Verifying generated file…'
                      : 'Working…';
          setStatusMessage(phaseLabel);
        }
      } catch {
        // keep polling
      }
    }, 2000);

    setTimeout(() => clearInterval(interval), 600000);
  }

  const busy = phase === 'checking' || phase === 'generating';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Lab</h1>
          <p className="mt-2 text-gray-500">
            Describe a task. GPT-5.4 will design a full spec, then build it as a live React page.
          </p>
        </div>
      </div>

      {/* Instruction Input */}
      <section className="mx-auto max-w-4xl px-6 py-8">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          What do you want to build?
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Describe the task in plain language. Be specific about what success looks like.
        </p>
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="e.g., A ticket booking page where the user picks a date, selects 2 seats, enters their name, and confirms. Success when the booking is confirmed."
          rows={6}
          className="w-full rounded-lg border border-gray-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            onClick={checkFeasibility}
            variant="outline"
            disabled={busy || !instruction.trim()}
          >
            {phase === 'checking' ? 'Checking...' : 'Check Feasibility'}
          </Button>
          <Button onClick={generate} disabled={busy || !instruction.trim()}>
            {phase === 'generating' ? 'Generating...' : 'Generate Task'}
          </Button>
        </div>
      </section>

      {/* Advanced Settings */}
      <section className="mx-auto max-w-4xl px-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <span className="text-xs">{showAdvanced ? '▼' : '▶'}</span>
          Advanced settings (optional)
        </button>

        {showAdvanced && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-6 space-y-6">
            <p className="text-xs text-gray-500">
              All of these are optional hints. Leave any field blank to let GPT-5.4 decide.
              Any hints you provide will be passed to the model during task design.
            </p>

            {/* Basics */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Coffee order — medium with oat milk"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Preferred library
                  </label>
                  <select
                    value={advanced.library}
                    onChange={(e) => setAdvanced({ ...advanced, library: e.target.value })}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Let GPT-5.4 choose</option>
                    <option value="antd">Ant Design</option>
                    <option value="mui">Material-UI</option>
                    <option value="mantine">Mantine</option>
                    <option value="native">Native HTML</option>
                    <option value="composite">Composite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Canonical type
                  </label>
                  <input
                    type="text"
                    value={advanced.canonicalType}
                    onChange={(e) => setAdvanced({ ...advanced, canonicalType: e.target.value })}
                    placeholder="e.g. button, slider_range, data_table_filterable"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Task template
                  </label>
                  <select
                    value={advanced.taskTemplate}
                    onChange={(e) => setAdvanced({ ...advanced, taskTemplate: e.target.value })}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Let GPT-5.4 choose</option>
                    {TASK_TEMPLATES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Additional setup details
                </label>
                <textarea
                  value={advanced.setupDescription}
                  onChange={(e) => setAdvanced({ ...advanced, setupDescription: e.target.value })}
                  placeholder="Initial state, mock data, specific layout details, distractors, etc."
                  rows={3}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Scene context */}
            <div className="border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={() => setShowScene(!showScene)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-gray-900"
              >
                <span>{showScene ? '▼' : '▶'}</span>
                Scene context (E1–E8 factors)
              </button>
              {showScene && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(Object.keys(SCENE_FACTORS) as Array<keyof typeof SCENE_FACTORS>).map((factor) => (
                    <div key={factor}>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                        {factor.replace('_', ' ')}
                      </label>
                      <select
                        value={advanced.sceneContext[factor]}
                        onChange={(e) =>
                          setAdvanced({
                            ...advanced,
                            sceneContext: { ...advanced.sceneContext, [factor]: e.target.value },
                          })
                        }
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs"
                      >
                        <option value="">any</option>
                        {SCENE_FACTORS[factor].map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Difficulty */}
            <div className="border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={() => setShowDifficulty(!showDifficulty)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-gray-900"
              >
                <span>{showDifficulty ? '▼' : '▶'}</span>
                Difficulty hints
              </button>
              {showDifficulty && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                        Bucket
                      </label>
                      <select
                        value={advanced.difficultyBucket}
                        onChange={(e) => setAdvanced({ ...advanced, difficultyBucket: e.target.value })}
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs"
                      >
                        <option value="">any</option>
                        <option value="easy">easy</option>
                        <option value="medium">medium</option>
                        <option value="hard">hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                        Tier
                      </label>
                      <select
                        value={advanced.difficultyTier}
                        onChange={(e) => setAdvanced({ ...advanced, difficultyTier: e.target.value })}
                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs"
                      >
                        <option value="">any</option>
                        <option value="L0">L0 (trivial)</option>
                        <option value="L1">L1 (easy)</option>
                        <option value="L2">L2 (hard)</option>
                        <option value="L3">L3 (very hard)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {DIFFICULTY_AXES.map((axis) => (
                      <div key={axis.key} className="flex items-center justify-between gap-2">
                        <label className="text-xs text-gray-600 flex-1">{axis.label}</label>
                        <select
                          value={advanced.axesRatings[axis.key as keyof typeof advanced.axesRatings] || ''}
                          onChange={(e) =>
                            setAdvanced({
                              ...advanced,
                              axesRatings: {
                                ...advanced.axesRatings,
                                [axis.key]: Number(e.target.value),
                              },
                            })
                          }
                          className="rounded border border-gray-300 px-2 py-1 text-xs w-20"
                        >
                          <option value="0">–</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Verifier */}
            <div className="border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={() => setShowVerifier(!showVerifier)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-gray-900"
              >
                <span>{showVerifier ? '▼' : '▶'}</span>
                Success conditions & negative cases
              </button>
              {showVerifier && (
                <div className="mt-3 space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      Success conditions
                    </label>
                    {advanced.successConditions.map((cond, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={cond}
                          onChange={(e) => {
                            const next = [...advanced.successConditions];
                            next[i] = e.target.value;
                            setAdvanced({ ...advanced, successConditions: next });
                          }}
                          placeholder="e.g. Order placed with medium size and oat milk"
                          className="flex-1 rounded border border-gray-300 px-3 py-2 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = advanced.successConditions.filter((_, j) => j !== i);
                            setAdvanced({ ...advanced, successConditions: next });
                          }}
                          className="text-gray-400 hover:text-red-500 px-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setAdvanced({
                          ...advanced,
                          successConditions: [...advanced.successConditions, ''],
                        })
                      }
                      className="text-xs text-gray-500 hover:text-gray-900"
                    >
                      + Add condition
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      Negative cases (must NOT trigger success)
                    </label>
                    {advanced.negativeCases.map((neg, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={neg}
                          onChange={(e) => {
                            const next = [...advanced.negativeCases];
                            next[i] = e.target.value;
                            setAdvanced({ ...advanced, negativeCases: next });
                          }}
                          placeholder="e.g. User selects size but not milk type"
                          className="flex-1 rounded border border-gray-300 px-3 py-2 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = advanced.negativeCases.filter((_, j) => j !== i);
                            setAdvanced({ ...advanced, negativeCases: next });
                          }}
                          className="text-gray-400 hover:text-red-500 px-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setAdvanced({
                          ...advanced,
                          negativeCases: [...advanced.negativeCases, ''],
                        })
                      }
                      className="text-xs text-gray-500 hover:text-gray-900"
                    >
                      + Add case
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Status & Progress */}
      <section className="mx-auto max-w-4xl px-6 py-6">
        {(phase !== 'idle' || backendPhase) && (
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            {/* Progress steps */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900">Pipeline progress</span>
                {elapsedSec > 0 && phase !== 'completed' && phase !== 'failed' && (
                  <span className="text-xs text-gray-500 tabular-nums">{elapsedSec}s elapsed</span>
                )}
              </div>
              <ol className="space-y-2">
                {PROGRESS_STEPS.map((step, i) => {
                  const currentIdx = backendPhase ? stepIndex(backendPhase) : -1;
                  const isFailed = backendPhase === 'failed';
                  const isDone = !isFailed && currentIdx > i;
                  const isActive = !isFailed && currentIdx === i;
                  const isPending = !isFailed && currentIdx < i;
                  return (
                    <li key={step.key} className="flex items-center gap-3">
                      <div
                        className={
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ' +
                          (isDone
                            ? 'bg-emerald-500 text-white'
                            : isActive
                              ? 'bg-slate-900 text-white'
                              : isFailed && currentIdx === -1
                                ? 'bg-red-100 text-red-600 border border-red-300'
                                : 'bg-gray-100 text-gray-400 border border-gray-200')
                        }
                      >
                        {isDone ? '✓' : isActive ? (
                          <div className="h-2.5 w-2.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span
                        className={
                          'text-sm ' +
                          (isDone
                            ? 'text-gray-700'
                            : isActive
                              ? 'font-semibold text-gray-900'
                              : isPending
                                ? 'text-gray-400'
                                : 'text-gray-500')
                        }
                      >
                        {step.label}
                      </span>
                      {isActive && (
                        <span className="text-xs text-gray-500 ml-auto">
                          {step.estimate ?? ''}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Status message */}
            <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
              {phase === 'checking' || phase === 'generating' ? (
                <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
              ) : phase === 'completed' ? (
                <span className="text-emerald-500 text-lg">✓</span>
              ) : phase === 'failed' ? (
                <span className="text-red-500 text-lg">✗</span>
              ) : (
                <span className="text-gray-300">·</span>
              )}
              <span className="text-sm text-gray-700">{statusMessage}</span>
            </div>

            {feasibility && !feasibility.feasible && (
              <div className="mt-3 rounded border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-semibold text-red-900">Task not feasible</p>
                <p className="text-sm text-red-700 mt-1">{feasibility.reason}</p>
                {feasibility.suggestions && feasibility.suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-red-900">Try instead:</p>
                    <ul className="mt-1 list-disc list-inside text-xs text-red-700">
                      {feasibility.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {generationOutput && (
              <details className="mt-3">
                <summary className="text-xs text-gray-500 cursor-pointer">Model output</summary>
                <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-60 whitespace-pre-wrap">
                  {generationOutput}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Designed task spec (shown after Stage 1 completes) */}
        {designedYaml && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-700">Designed task specification</span>
                <span className="ml-2 text-[11px] text-gray-400">
                  data/tasklab_drafts/{taskId}.yaml
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(designedYaml).catch(() => {});
                }}
                className="text-[11px] text-gray-500 hover:text-gray-900"
              >
                Copy YAML
              </button>
            </div>
            <pre className="m-0 p-4 text-xs text-gray-800 overflow-auto max-h-[400px] whitespace-pre-wrap">
              {designedYaml}
            </pre>
          </div>
        )}
      </section>

      {/* Preview */}
      {phase === 'completed' && taskId && (
        <section className="mx-auto max-w-4xl px-6 pb-12">
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Preview</span>
              <div className="flex items-center gap-4">
                <a
                  href={`/playground/${taskId}?record=1&runId=tasklab_${taskId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  ● Record Trace →
                </a>
                <a
                  href={`/playground/${taskId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-900 hover:underline"
                >
                  Open in new tab →
                </a>
              </div>
            </div>
            <iframe
              src={`/playground/${taskId}`}
              className="w-full h-[600px]"
              title="Task preview"
            />
          </div>
        </section>
      )}
    </div>
  );
}
