'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const [pass, setPass] = useState(1);
  const [taskFilter, setTaskFilter] = useState('');
  const [limit, setLimit] = useState(0);
  const [status, setStatus] = useState<RunStatus | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskIndex, setTaskIndex] = useState<string[] | null>(null);
  const [taskIndexLoading, setTaskIndexLoading] = useState(false);
  const [benchVersion, setBenchVersion] = useState<'v1' | 'v2'>('v1');

  useEffect(() => {
    const controller = new AbortController();
    setTaskIndex(null);
    setTaskIndexLoading(true);
    fetch(`/api/tasks/index?bench=${benchVersion}`, { signal: controller.signal })
      .then(r => r.json())
      .then(d => { setTaskIndex(d.task_ids || []); setTaskIndexLoading(false); })
      .catch(e => { if (e.name !== 'AbortError') { setError('Could not load task index'); setTaskIndexLoading(false); } });
    return () => controller.abort();
  }, [benchVersion]);

  const fetchStatus = async (rid: string) => {
    try {
      const res = await fetch(`/api/record/run-status?run_id=${encodeURIComponent(rid)}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        return data;
      }
      return null;
    } catch { return null; }
  };

  const handleCreateOrResume = async () => {
    if (!runId.trim()) { setError('Run ID is required'); return; }
    setError('');
    setLoading(true);

    // Check if run exists
    const existing = await fetchStatus(runId);
    if (existing) {
      setLoading(false);

      // Detect the bench version of the existing run from its task IDs
      const runIsV2 = existing.run.task_ids.length > 0 && existing.run.task_ids[0].includes('-v2-');
      if ((benchVersion === 'v2') !== runIsV2) {
        setError(`Run "${runId}" contains ${runIsV2 ? 'v2' : 'v1'} tasks but you selected ${benchVersion.toUpperCase()}. Use a different Run ID or switch the version toggle.`);
        return;
      }

      // If user specified task IDs, allow re-recording even if run is "complete"
      if (taskFilter.trim()) {
        const filterIds = taskFilter.split(',').map(s => s.trim()).filter(Boolean);
        if (filterIds.length > 0) {
          navigateToTask(filterIds[0], 0, filterIds.length);
          return;
        }
      }

      if (existing.is_complete) {
        setError('This run is already complete. To re-record specific tasks, enter task IDs in the filter.');
        return;
      }
      // Resume: navigate to next task
      if (existing.next_task_id) {
        navigateToTask(existing.next_task_id, existing.next_index, existing.run.total_tasks);
      }
      return;
    }

    // Create new run
    let taskIds: string[];
    if (taskFilter.trim()) {
      taskIds = taskFilter.split(',').map(s => s.trim()).filter(Boolean);
    } else if (taskIndex) {
      taskIds = [...taskIndex];
    } else {
      setError('Task index not loaded yet');
      setLoading(false);
      return;
    }

    if (limit > 0) {
      taskIds = taskIds.slice(0, limit);
    }

    try {
      const res = await fetch('/api/record/init-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ run_id: runId, pass, task_ids: taskIds }),
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

  const isV2Task = (taskId: string) => taskId.includes('-v2-');

  const navigateToTask = (taskId: string, index: number, total: number, currentPass = 1) => {
    const params = new URLSearchParams({
      mode: 'presentation',
      record: '1',
      runId: runId,
      pass: String(currentPass),
      idx: String(index),
      total: String(total),
    });
    if (isV2Task(taskId)) {
      params.set('bench', 'v2');
    }
    router.push(`/task/${taskId}?${params.toString()}`);
  };

  return (
    <div style={{ maxWidth: 700, margin: '60px auto', padding: '0 24px', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Human Recording</h1>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['v1', 'v2'] as const).map(v => (
            <button
              key={v}
              onClick={() => setBenchVersion(v)}
              style={{
                padding: '4px 14px', fontSize: 13, fontWeight: 600, borderRadius: 4,
                border: benchVersion === v ? '2px solid #1677ff' : '1px solid #d9d9d9',
                background: benchVersion === v ? '#e6f4ff' : '#fff',
                color: benchVersion === v ? '#1677ff' : '#666',
                cursor: 'pointer',
              }}
            >{v.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <p style={{ color: '#666', marginBottom: 32, fontSize: 14 }}>
        Record human action traces for ComponentBench {benchVersion.toUpperCase()} tasks
        ({taskIndexLoading ? 'loading...' : `${taskIndex?.length ?? 0} tasks`}). Local-only mode.
      </p>

      <div style={{ background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Run ID</label>
          <input
            value={runId}
            onChange={e => setRunId(e.target.value)}
            placeholder="e.g. human_pass1_20260311"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 14 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Limit (0 = all)</label>
            <input
              type="number"
              value={limit}
              onChange={e => setLimit(Number(e.target.value))}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 14 }}
            />
          </div>
        </div>

        <div style={{ background: '#e6f4ff', border: '1px solid #91caff', borderRadius: 4, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: '#0958d9' }}>
          Each task is recorded twice: first a <b>cold</b> attempt (no prior knowledge), then a <b>warm</b> attempt (near-optimal). The flow is automatic.
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
            Task IDs (optional, comma-separated; leave empty for all {taskIndex?.length || '...'} tasks)
          </label>
          <input
            value={taskFilter}
            onChange={e => setTaskFilter(e.target.value)}
            placeholder={benchVersion === 'v2' ? 'markdown_editor-external-v2-T01, ...' : 'button-antd-T01, accordion-mui-T05, ...'}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 14 }}
          />
        </div>

        {error && (
          <div style={{ color: '#ff4d4f', fontSize: 13, marginBottom: 12 }}>{error}</div>
        )}

        <button
          onClick={handleCreateOrResume}
          disabled={loading || taskIndexLoading}
          style={{
            width: '100%', padding: '10px 0', background: '#1677ff', color: '#fff',
            border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 600,
            cursor: (loading || taskIndexLoading) ? 'not-allowed' : 'pointer',
            opacity: (loading || taskIndexLoading) ? 0.6 : 1,
          }}
        >
          {taskIndexLoading ? 'Loading task index...' : loading ? 'Loading...' : 'Start / Resume Run'}
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
