/**
 * Human recording data model.
 * Defines the on-disk trace format written by the recorder and read by the pack script.
 */

export type StepType = 'click' | 'type' | 'key' | 'drag' | 'scroll' | 'wait';

export interface PointerInfo {
  x: number;
  y: number;
  button: number;
  mod: { shift: boolean; ctrl: boolean; alt: boolean; meta: boolean };
}

export interface DragInfo {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  steps: number;
}

export interface ScrollInfo {
  dx: number;
  dy: number;
}

export interface TargetSnapshot {
  tag: string;
  id: string;
  classes: string;
  testid: string;
  role: string;
  name: string;
  bbox: { x: number; y: number; w: number; h: number };
}

export interface RecordedStep {
  i: number;
  t_ms: number;
  type: StepType;
  url: string;
  viewport: { w: number; h: number };
  pointer?: PointerInfo;
  drag?: DragInfo;
  text?: string;
  key?: string;
  scroll?: ScrollInfo;
  target?: TargetSnapshot;
}

export type EpisodeStatus = 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'ABORTED';

// Optional task-quality spot-check flags an annotator can raise after a task,
// giving an independent human check on the LLM-assisted task construction.
export type QualityFlag =
  | 'unclear_instruction'
  | 'synthetic_feeling'
  | 'ui_behavior_mismatch'
  | 'verifier_mismatch'
  | 'other';

export const QUALITY_FLAG_LABELS: Record<QualityFlag, string> = {
  unclear_instruction: 'Unclear instruction',
  synthetic_feeling: 'Unnatural / synthetic-feeling task',
  ui_behavior_mismatch: 'UI behavior mismatch',
  verifier_mismatch: 'Verifier mismatch / completion judged incorrectly',
  other: 'Other issue',
};

export interface EpisodeMeta {
  run_id: string;
  pass: number;
  task_id: string;
  started_at: string;
  ended_at: string;
  status: EpisodeStatus;
  n_steps: number;
  notes: string;
  quality_flags?: QualityFlag[];
  quality_note?: string;
}

export interface RunConfig {
  run_id: string;
  pass: number;
  created_at: string;
  base_url: string;
  task_ids: string[];
  total_tasks: number;
}

export interface RunProgress {
  run_id: string;
  completed_tasks: string[];
  skipped_tasks: string[];
  current_index: number;
  last_updated: string;
}
