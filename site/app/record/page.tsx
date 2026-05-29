'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import subset from '@/recording-subset-278.json';

// The 278-task benchmark subset (1 task per canonical_type x library pair). All
// entries are v1 task IDs; this is the default set friends record.
const SUBSET_IDS: string[] = (subset as { tasks: { task_id: string }[] }).tasks.map(t => t.task_id);

interface RunStatus {
  run: { run_id: string; pass: number; total_tasks: number; task_ids: string[] };
  progress: { completed_tasks: string[]; skipped_tasks: string[]; current_index: number };
  next_task_id: string | null;
  next_index: number;
  is_complete: boolean;
  completed_count: number;
  skipped_count: number;
  remaining: number;
}

export default function RecordPage() {
  const router = useRouter();
  const [runId, setRunId] = useState('');
  const [taskFilter, setTaskFilter] = useState('');
  const [limit, setLimit] = useState(0);
  const [status, setStatus] = useState<RunStatus | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [indexIds, setIndexIds] = useState<Set<string> | null>(null);
  const [indexLoading, setIndexLoading] = useState(false);

  // Load the v1 task index to confirm every subset task exists in this build.
  useEffect(() => {
    const controller = new AbortController();
    setIndexLoading(true);
    fetch('/api/tasks/index?bench=v1', { signal: controller.signal })
      .then(r => r.json())
      .then(d => { setIndexIds(new Set<string>(d.task_ids || [])); setIndexLoading(false); })
      .catch(e => { if (e.name !== 'AbortError') { setError('Could not load task index'); setIndexLoading(false); } });
    return () => controller.abort();
  }, []);

  // Subset filtered to tasks actually present in this build (graceful if the
  // bundled manifest ever drifts from the generated index).
  const availableSubset = indexIds ? SUBSET_IDS.filter(id => indexIds.has(id)) : SUBSET_IDS;
  const missingCount = SUBSET_IDS.length - availableSubset.length;

  const fetchStatus = async (rid: string) => {
    try {
      const res = await fetch(`/api/record/run-status?run_id=${encodeURIComponent(rid)}`);
      if (res.ok) { const data = await res.json(); setStatus(data); return data; }
      return null;
    } catch { return null; }
  };

  const navigateToTask = (taskId: string, index: number, total: number, currentPass = 1) => {
    const params = new URLSearchParams({
      mode: 'presentation',
      record: '1',
      runId,
      pass: String(currentPass),
      idx: String(index),
      total: String(total),
    });
    router.push(`/task/${taskId}?${params.toString()}`);
  };

  const handleCreateOrResume = async () => {
    if (!runId.trim()) { setError('Run ID is required'); return; }
    setError('');
    setLoading(true);

    // Resume an existing run?
    const existing = await fetchStatus(runId);
    if (existing) {
      setLoading(false);
      if (taskFilter.trim()) {
        const filterIds = taskFilter.split(',').map(s => s.trim()).filter(Boolean);
        if (filterIds.length > 0) { navigateToTask(filterIds[0], 0, filterIds.length); return; }
      }
      if (existing.is_complete) {
        setError('This run is already complete. To re-record specific tasks, enter task IDs in the filter.');
        return;
      }
      if (existing.next_task_id) {
        navigateToTask(existing.next_task_id, existing.next_index, existing.run.total_tasks);
      }
      return;
    }

    // Create a new run. Default to the 278-task subset; allow an override.
    let taskIds: string[];
    if (taskFilter.trim()) {
      taskIds = taskFilter.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      taskIds = [...availableSubset];
    }
    if (limit > 0) taskIds = taskIds.slice(0, limit);
    if (taskIds.length === 0) { setError('No tasks to record'); setLoading(false); return; }

    try {
      const res = await fetch('/api/record/init-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ run_id: runId, pass: 1, task_ids: taskIds }),
      });
      const data = await res.json();
      if (data.status === 'created' || data.status === 'existing') {
        const updated = await fetchStatus(runId);
        if (updated?.next_task_id) {
          navigateToTask(updated.next_task_id, updated.next_index, taskIds.length);
        }
      } else {
        setError(data.error || 'Failed to create run');
      }
    } catch (e) {
      setError(String(e));
    }
    setLoading(false);
  };

  const countLabel = indexLoading ? 'loading…' : `${availableSubset.length} tasks`;

  return (
    <div style={{ maxWidth: 700, margin: '60px auto', padding: '0 24px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Human Recording</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Record human action traces for the ComponentBench 278-task subset ({countLabel}). Runs entirely
        on your machine — traces are saved to a local <code>human-traces/</code> folder.
      </p>

      {missingCount > 0 && !indexLoading && (
        <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 4, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: '#ad6800' }}>
          Note: {missingCount} of {SUBSET_IDS.length} subset tasks are not present in this build and will be skipped.
        </div>
      )}

      <div style={{ background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Run ID</label>
          <input
            value={runId}
            onChange={e => setRunId(e.target.value)}
            placeholder="e.g. human_yourname"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 14 }}
          />
        </div>

        <div style={{ background: '#e6f4ff', border: '1px solid #91caff', borderRadius: 4, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: '#0958d9' }}>
          Each task is recorded twice: first a <b>cold</b> attempt (no prior knowledge), then a <b>warm</b> attempt. The flow advances automatically. You can Pause anytime and resume later with the same Run ID.
        </div>

        <details style={{ marginBottom: 16 }}>
          <summary style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#666' }}>Advanced (optional)</summary>
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Limit (0 = all {availableSubset.length})</label>
            <input
              type="number"
              value={limit}
              onChange={e => setLimit(Number(e.target.value))}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 14, marginBottom: 12 }}
            />
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
              Task IDs (comma-separated; leave empty for the full 278 subset)
            </label>
            <input
              value={taskFilter}
              onChange={e => setTaskFilter(e.target.value)}
              placeholder="button-antd-T07, accordion-mui-T08, …"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 14 }}
            />
          </div>
        </details>

        {error && <div style={{ color: '#ff4d4f', fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <button
          onClick={handleCreateOrResume}
          disabled={loading || indexLoading}
          style={{
            width: '100%', padding: '10px 0', background: '#1677ff', color: '#fff',
            border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 600,
            cursor: (loading || indexLoading) ? 'not-allowed' : 'pointer',
            opacity: (loading || indexLoading) ? 0.6 : 1,
          }}
        >
          {indexLoading ? 'Loading task index…' : loading ? 'Loading…' : 'Start / Resume Run'}
        </button>
      </div>

      {status && (
        <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>Run Status: {status.run.run_id}</h3>
          <div style={{ fontSize: 13, color: '#333', lineHeight: 1.8 }}>
            <div>Pass: {status.run.pass}</div>
            <div>Completed: {status.completed_count} / {status.run.total_tasks}</div>
            <div>Skipped: {status.skipped_count}</div>
            <div>Remaining: {status.remaining}</div>
            {status.next_task_id && <div>Next task: <code>{status.next_task_id}</code></div>}
            {status.is_complete && <div style={{ color: '#52c41a', fontWeight: 700 }}>Run complete!</div>}
          </div>
        </div>
      )}
    </div>
  );
}
