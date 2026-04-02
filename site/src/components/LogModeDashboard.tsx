'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { BenchmarkVersion } from '@/types';

const MODE_DISPLAY_LABELS: Record<string, string> = {
  webarena: 'AX-tree',
  ax_tree: 'AX-tree',
  som: 'SoM',
  pixel_grid: 'pixel_grid',
  pixel: 'pixel',
  browser_use: 'Browser-Use',
  ui_tars_native: 'UI-TARS Native',
};

function modeLabel(mode: string): string {
  return MODE_DISPLAY_LABELS[mode] ?? mode;
}

interface RunInfo {
  id: string;
  run_id: string;
  model_name: string;
  agent_name: string;
  benchmark_version?: string;
  modes: string[];
  mode_run_ids?: Record<string, string>;
  total_episodes: number;
  total_success: number;
  pass_rate: number;
  created_at: string;
  by_mode: Record<string, {
    total: number;
    success: number;
    pass_rate: number;
    avg_steps: number;
    avg_duration: number;
  }>;
}

interface EpisodeInfo {
  task_id: string;
  canonical_type: string;
  library: string;
  success: boolean;
  steps: number;
  duration_seconds: number;
  mode: string;
  videos?: Record<string, string>;
}

interface LogModeDashboardProps {
  selectedLib: string;
  benchVersion?: BenchmarkVersion;
}

export default function LogModeDashboard({ selectedLib, benchVersion = 'v1' }: LogModeDashboardProps) {
  const [runs, setRuns] = useState<RunInfo[]>([]);
  const [selectedRunIdx, setSelectedRunIdx] = useState(0);
  const [selectedMode, setSelectedMode] = useState('');
  const [episodes, setEpisodes] = useState<EpisodeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  useEffect(() => {
    fetch(`/api/logs/runs?bench=${benchVersion}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setRuns(data);
        setSelectedRunIdx(0);
        if (data.length > 0 && data[0].modes?.length > 0) {
          setSelectedMode(data[0].modes[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [benchVersion]);

  const selectedRun = runs[selectedRunIdx] || null;

  const resolvedRunId = useMemo(() => {
    if (!selectedRun) return '';
    if (selectedRun.mode_run_ids && selectedRun.mode_run_ids[selectedMode]) {
      return selectedRun.mode_run_ids[selectedMode];
    }
    return selectedRun.id;
  }, [selectedRun, selectedMode]);

  useEffect(() => {
    if (!resolvedRunId) return;
    setLoadingEpisodes(true);
    const url = `/api/logs/runs/${resolvedRunId}?mode=${selectedMode}&bench=${benchVersion}`;
    fetch(url)
      .then(r => r.ok ? r.json() : { episodes: [] })
      .then(data => {
        setEpisodes(data.episodes || []);
        setLoadingEpisodes(false);
      })
      .catch(() => { setEpisodes([]); setLoadingEpisodes(false); });
  }, [resolvedRunId, selectedMode, benchVersion]);

  const byType = useMemo(() => {
    const grouped: Record<string, EpisodeInfo[]> = {};
    for (const ep of episodes) {
      if (selectedLib !== 'all' && ep.library !== selectedLib) continue;
      if (!grouped[ep.canonical_type]) grouped[ep.canonical_type] = [];
      grouped[ep.canonical_type].push(ep);
    }
    return grouped;
  }, [episodes, selectedLib]);

  if (loading) {
    return <div style={{ padding: 48, textAlign: 'center', color: '#999' }}>Loading runs...</div>;
  }

  if (runs.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: '#999' }}>
        <p style={{ fontSize: 16, marginBottom: 8 }}>No log runs found for {benchVersion.toUpperCase()}</p>
        <p style={{ fontSize: 13 }}>Pack and upload some runs first.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Run selector bar */}
      <div style={{
        background: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 4 }}>Run</label>
            <select
              value={selectedRunIdx}
              onChange={e => {
                const idx = Number(e.target.value);
                setSelectedRunIdx(idx);
                const run = runs[idx];
                if (run?.modes?.[0]) setSelectedMode(run.modes[0]);
              }}
              style={{ padding: '6px 10px', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 13, minWidth: 300 }}
            >
              {runs.map((r, i) => (
                <option key={r.id} value={i}>
                  {r.run_id} — {r.model_name.split('/').pop()} ({(r.pass_rate * 100).toFixed(1)}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 4 }}>Mode</label>
            <div style={{ display: 'flex', gap: 4 }}>
              {selectedRun?.modes?.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMode(m)}
                  style={{
                    padding: '5px 12px',
                    border: `2px solid ${selectedMode === m ? '#1677ff' : '#d9d9d9'}`,
                    borderRadius: 4,
                    background: selectedMode === m ? '#e6f4ff' : '#fff',
                    color: selectedMode === m ? '#1677ff' : '#666',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {modeLabel(m)}
                </button>
              ))}
            </div>
          </div>

          {selectedRun && selectedRun.by_mode[selectedMode] && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 24 }}>
              <div>
                <div style={{ fontSize: 10, color: '#999' }}>Pass Rate</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1677ff' }}>
                  {(selectedRun.by_mode[selectedMode].pass_rate * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#999' }}>Avg Steps</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {selectedRun.by_mode[selectedMode].avg_steps.toFixed(1)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#999' }}>Episodes</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {selectedRun.by_mode[selectedMode].total}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {loadingEpisodes && (
        <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>Loading episodes...</div>
      )}

      {/* Task grid */}
      {Object.entries(byType).sort(([a], [b]) => a.localeCompare(b)).map(([type, eps]) => {
        const passed = eps.filter(e => e.success).length;
        const total = eps.length;
        return (
          <div key={type} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{type}</h3>
              <span style={{
                fontSize: 11,
                color: passed === total ? '#52c41a' : '#faad14',
                fontWeight: 500,
              }}>
                {passed}/{total}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {eps.map(ep => (
                <Link
                  key={ep.task_id}
                  href={`/task/${ep.task_id}?mode=log&run=${resolvedRunId}&logMode=${selectedMode}&bench=${benchVersion}`}
                  prefetch={false}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: 'monospace',
                    textDecoration: 'none',
                    background: ep.success ? '#f6ffed' : '#fff2e8',
                    border: `1px solid ${ep.success ? '#b7eb8f' : '#ffbb96'}`,
                    color: ep.success ? '#389e0d' : '#d4380d',
                  }}
                >
                  <span style={{ fontSize: 9 }}>{ep.success ? '\u2713' : '\u2717'}</span>
                  {ep.task_id.split('-').pop()}
                  <span style={{ color: '#999', fontSize: 10 }}>
                    {ep.steps} steps
                  </span>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {Object.keys(byType).length === 0 && !loadingEpisodes && (
        <div style={{ padding: 32, textAlign: 'center', color: '#999' }}>
          No episodes found for this run/mode combination.
        </div>
      )}
    </div>
  );
}
