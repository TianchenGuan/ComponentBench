/**
 * In-memory job store for Task Lab generation jobs.
 * Only suitable for the single-process dev server (not Vercel).
 *
 * Uses globalThis to persist across Next.js dev mode hot-reloads.
 * Each route file gets its own module instance in dev, but globalThis
 * is shared across all of them.
 */

import { randomUUID } from 'crypto';

export type JobPhase =
  | 'saving_draft'
  | 'checking_feasibility'
  | 'designing_task'
  | 'validating_spec'
  | 'spawning_codex'
  | 'generating'
  | 'verifying_file'
  | 'completed'
  | 'failed';

export interface JobPhaseEvent {
  phase: JobPhase;
  message: string;
  timestamp: number;
}

export interface Job {
  id: string;
  taskId: string;
  status: 'running' | 'completed' | 'failed';
  phase: JobPhase;
  phases: JobPhaseEvent[];
  startedAt: number;
  completedAt?: number;
  output: string;
  error: string;
  filePath?: string;
  designedYaml?: string;
}

// Persist across hot-reloads in Next.js dev mode
const globalForJobs = globalThis as unknown as {
  __tasklabJobs: Map<string, Job> | undefined;
};

const jobs: Map<string, Job> = globalForJobs.__tasklabJobs ?? new Map<string, Job>();
if (!globalForJobs.__tasklabJobs) {
  globalForJobs.__tasklabJobs = jobs;
}

export function createJob(taskId: string): string {
  const id = randomUUID();
  const now = Date.now();
  jobs.set(id, {
    id,
    taskId,
    status: 'running',
    phase: 'spawning_codex',
    phases: [
      { phase: 'spawning_codex', message: 'Spawning Codex CLI…', timestamp: now },
    ],
    startedAt: now,
    output: '',
    error: '',
  });
  return id;
}

export function updateJob(id: string, update: Partial<Job>): void {
  const job = jobs.get(id);
  if (!job) return;
  Object.assign(job, update);
}

export function setJobPhase(id: string, phase: JobPhase, message: string): void {
  const job = jobs.get(id);
  if (!job) return;
  job.phase = phase;
  job.phases.push({ phase, message, timestamp: Date.now() });
}

export function getJob(id: string): Job | null {
  return jobs.get(id) ?? null;
}
