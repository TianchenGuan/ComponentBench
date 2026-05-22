'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

const MODE_DISPLAY_LABELS: Record<string, string> = {
  webarena: 'AX-tree',
  ax_tree: 'AX-tree',
  som: 'SoM',
  pixel_grid: 'pixel_grid',
  pixel: 'pixel',
};

function modeLabel(mode: string): string {
  return MODE_DISPLAY_LABELS[mode] ?? mode;
}

interface StepData {
  step_idx: number;
  timestamp: string;
  thinking: string;
  action: string;
  raw_model_output: string;
  error: string;
  transformed_action: string;
  screenshot?: string;
}

interface EpisodeData {
  task_id: string;
  mode: string;
  canonical_type: string;
  library: string;
  success: boolean;
  steps: number;
  duration_seconds: number;
  termination_reason: string;
  model_name: string;
  step_list: StepData[];
  videos: Record<string, string>;
}

interface LogViewerProps {
  episodeUrl: string;
  videoBaseUrl: string;
}

const VIDEO_LABELS: Record<string, string> = {
  frames_raw: 'Raw',
  frames_annot: 'Annotated',
  frames_som: 'SoM Overlay',
  frames_grid: 'Grid Overlay',
};

const VIDEO_ORDER = ['frames_raw', 'frames_annot', 'frames_som', 'frames_grid'];

function toolbarBtn(color: string): React.CSSProperties {
  const isBlue = color === '#1677ff';
  return {
    padding: '2px 8px',
    border: `1px solid ${isBlue ? '#bae0ff' : '#ffa940'}`,
    borderRadius: 4,
    background: isBlue ? '#fff' : '#fff7e6',
    color: isBlue ? '#1677ff' : '#d46b08',
    fontSize: 11,
    cursor: 'pointer',
    fontWeight: 500,
  };
}

export default function LogViewer({ episodeUrl, videoBaseUrl }: LogViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stepListRef = useRef<HTMLDivElement>(null);
  const [episode, setEpisode] = useState<EpisodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [selectedVideo, setSelectedVideo] = useState('');

  useEffect(() => {
    fetch(episodeUrl)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (!data) return;
        setEpisode(data);
        const videos = data.videos || {};
        const available = VIDEO_ORDER.filter(v => videos[v]);
        setSelectedVideo(available[0] || '');
        // Thinking is the most useful field, so expand it by default for every
        // step that has thinking content. Raw model output stays collapsed.
        const initial = new Set<number>();
        for (const step of (data.step_list || []) as StepData[]) {
          if (step.thinking) initial.add(step.step_idx);
        }
        setExpandedSteps(initial);
        setLoading(false);
      })
      .catch(e => { setError(String(e)); setLoading(false); });
  }, [episodeUrl]);

  const setAllExpansions = useCallback(
    (kind: 'thinking' | 'raw', open: boolean) => {
      if (!episode) return;
      const offset = kind === 'thinking' ? 0 : 10000;
      setExpandedSteps(prev => {
        const next = new Set(prev);
        for (const step of episode.step_list) {
          const hasContent =
            kind === 'thinking' ? !!step.thinking : !!step.raw_model_output;
          if (!hasContent) continue;
          const key = step.step_idx + offset;
          if (open) next.add(key);
          else next.delete(key);
        }
        return next;
      });
    },
    [episode],
  );

  const videoUrl = (() => {
    if (!episode || !selectedVideo || !episode.videos[selectedVideo]) return '';
    const val = episode.videos[selectedVideo];
    if (val.startsWith('http')) return val;
    return `${videoBaseUrl}&file=${val}`;
  })();

  const activeStepData = episode?.step_list?.[activeStep];
  const stepScreenshot = activeStepData?.screenshot;
  const stepScreenshotUrl = stepScreenshot
    ? (stepScreenshot.startsWith('http') ? stepScreenshot : `${videoBaseUrl}&file=${stepScreenshot}`)
    : '';

  const seekToStep = useCallback((idx: number) => {
    setActiveStep(idx);
    if (videoRef.current) {
      videoRef.current.currentTime = idx;
    }
  }, []);

  const toggleExpand = useCallback((key: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && episode) {
      const newStep = Math.floor(videoRef.current.currentTime);
      if (newStep !== activeStep && newStep < episode.steps) {
        setActiveStep(newStep);
      }
    }
  }, [activeStep, episode]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!episode) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        seekToStep(Math.min(activeStep + 1, episode.steps - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        seekToStep(Math.max(activeStep - 1, 0));
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeStep, episode, seekToStep]);

  useEffect(() => {
    if (stepListRef.current) {
      const el = stepListRef.current.querySelector(`[data-step="${activeStep}"]`);
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeStep]);

  if (loading) {
    return <div style={{ padding: 24, color: '#999', marginTop: 24 }}>Loading episode data...</div>;
  }

  if (notFound) {
    return (
      <div style={{
        padding: 24,
        marginTop: 24,
        background: '#fafafa',
        border: '1px solid #e8e8e8',
        borderRadius: 8,
        textAlign: 'center',
        color: '#999',
      }}>
        No log available for this task/run combination.
      </div>
    );
  }

  if (error || !episode) {
    return <div style={{ padding: 24, color: '#ff4d4f', marginTop: 24 }}>Error: {error || 'No data'}</div>;
  }

  const availableVideos = VIDEO_ORDER.filter(v => episode.videos[v]);

  return (
    <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
      {/* Left: Step list */}
      <div style={{ flex: '0 0 560px', display: 'flex', flexDirection: 'column', maxHeight: '75vh' }}>
        {/* Episode header */}
        <div style={{
          padding: '12px 16px',
          background: episode.success ? '#f6ffed' : '#fff2e8',
          border: '1px solid #e8e8e8',
          borderBottom: 'none',
          borderRadius: '8px 8px 0 0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.4,
              color: episode.success ? '#389e0d' : '#cf1322',
            }}>
              {episode.success ? 'PASS' : 'FAIL'}
            </span>
            <span style={{ fontSize: 12, color: '#8c8c8c' }}>
              {episode.steps} steps · {episode.duration_seconds.toFixed(1)}s · {episode.termination_reason}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#595959', marginTop: 4 }}>
            <span style={{ fontFamily: 'monospace', color: '#1677ff' }}>{modeLabel(episode.mode)}</span>
            <span style={{ margin: '0 8px', color: '#bfbfbf' }}>·</span>
            <span>{episode.canonical_type}</span>
            <span style={{ margin: '0 8px', color: '#bfbfbf' }}>·</span>
            <span style={{ textTransform: 'uppercase', fontSize: 11, color: '#722ed1', fontWeight: 600 }}>
              {episode.library}
            </span>
          </div>
        </div>

        {/* Expand-all / collapse-all toolbar */}
        <div style={{
          display: 'flex',
          gap: 6,
          alignItems: 'center',
          padding: '8px 12px',
          background: '#fafafa',
          border: '1px solid #e8e8e8',
          borderTop: 'none',
          borderBottom: 'none',
          fontSize: 11,
          color: '#8c8c8c',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontWeight: 600, color: '#595959' }}>Thinking</span>
          <button onClick={() => setAllExpansions('thinking', true)} style={toolbarBtn('#1677ff')}>
            expand all
          </button>
          <button onClick={() => setAllExpansions('thinking', false)} style={toolbarBtn('#8c8c8c')}>
            collapse all
          </button>
          <span style={{ width: 1, height: 14, background: '#e8e8e8', margin: '0 4px' }} />
          <span style={{ fontWeight: 600, color: '#595959' }}>Raw output</span>
          <button onClick={() => setAllExpansions('raw', true)} style={toolbarBtn('#1677ff')}>
            expand all
          </button>
          <button onClick={() => setAllExpansions('raw', false)} style={toolbarBtn('#8c8c8c')}>
            collapse all
          </button>
        </div>

        {/* Steps (scrollable) */}
        <div ref={stepListRef} style={{
          flex: 1,
          overflowY: 'auto',
          background: '#fff',
          border: '1px solid #e8e8e8',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
        }}>
          {episode.step_list.map((step) => {
            const isActive = activeStep === step.step_idx;
            return (
            <div
              key={step.step_idx}
              data-step={step.step_idx}
              onClick={() => seekToStep(step.step_idx)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                background: isActive ? '#e6f7ff' : 'transparent',
                borderLeft: `3px solid ${isActive ? '#1677ff' : 'transparent'}`,
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: isActive ? '#1677ff' : '#595959',
                  fontFamily: 'monospace',
                  padding: '2px 8px',
                  background: isActive ? '#fff' : '#f0f0f0',
                  borderRadius: 10,
                }}>
                  Step {step.step_idx}
                </span>
                <span style={{ fontSize: 10, color: '#bfbfbf' }}>
                  {step.timestamp ? step.timestamp.split(' ')[1]?.split(',')[0] : ''}
                </span>
              </div>

              <div style={{
                fontSize: 12,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                color: '#262626',
                marginTop: 6,
                padding: '6px 10px',
                background: '#f6f8fa',
                border: '1px solid #eaeef2',
                borderRadius: 4,
                wordBreak: 'break-all',
                lineHeight: 1.45,
              }}>
                {step.action || '(no action)'}
                {step.transformed_action && step.transformed_action !== step.action && (
                  <span style={{ color: '#999', marginLeft: 8 }}>
                    {'→'} {step.transformed_action}
                  </span>
                )}
              </div>

              {step.thinking && (
                <div style={{ marginTop: 6 }}>
                  <button
                    onClick={e => { e.stopPropagation(); toggleExpand(step.step_idx); }}
                    style={{
                      fontSize: 11,
                      color: '#1677ff',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      fontWeight: 500,
                    }}
                  >
                    {expandedSteps.has(step.step_idx) ? '▼ Thinking' : '▶ Thinking'}
                  </button>
                  {expandedSteps.has(step.step_idx) && (
                    <div style={{
                      fontSize: 11,
                      color: '#262626',
                      marginTop: 4,
                      padding: '8px 10px',
                      background: '#f0f7ff',
                      borderLeft: '2px solid #91caff',
                      borderRadius: 2,
                      whiteSpace: 'pre-wrap',
                      maxHeight: 300,
                      overflowY: 'auto',
                      lineHeight: 1.55,
                    }}>
                      {step.thinking}
                    </div>
                  )}
                </div>
              )}

              {step.raw_model_output && step.raw_model_output !== step.thinking && (
                <div style={{ marginTop: 4 }}>
                  <button
                    onClick={e => { e.stopPropagation(); toggleExpand(10000 + step.step_idx); }}
                    style={{
                      fontSize: 10,
                      color: '#999',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {expandedSteps.has(10000 + step.step_idx) ? '▼ Raw output' : '▶ Raw output'}
                  </button>
                  {expandedSteps.has(10000 + step.step_idx) && (
                    <div style={{
                      fontSize: 10,
                      color: '#888',
                      marginTop: 4,
                      padding: 8,
                      background: '#f9f9f9',
                      borderRadius: 4,
                      whiteSpace: 'pre-wrap',
                      maxHeight: 300,
                      overflowY: 'auto',
                      fontFamily: 'monospace',
                      lineHeight: 1.4,
                    }}>
                      {step.raw_model_output}
                    </div>
                  )}
                </div>
              )}

              {step.error && (
                <div style={{ fontSize: 11, color: '#ff4d4f', marginTop: 4 }}>
                  Error: {step.error}
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/* Right: Video player or step screenshot fallback */}
      <div style={{ flex: 1 }}>
        <div style={{ position: 'sticky', top: 80 }}>
          {availableVideos.length > 1 && (
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              {availableVideos.map(v => (
                <button
                  key={v}
                  onClick={() => setSelectedVideo(v)}
                  style={{
                    padding: '4px 12px',
                    border: `2px solid ${selectedVideo === v ? '#1677ff' : '#d9d9d9'}`,
                    borderRadius: 4,
                    background: selectedVideo === v ? '#e6f4ff' : '#fff',
                    color: selectedVideo === v ? '#1677ff' : '#666',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {VIDEO_LABELS[v] || v}
                </button>
              ))}
            </div>
          )}

          <div style={{
            background: '#000',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            {videoUrl ? (
              <video
                ref={videoRef}
                key={videoUrl}
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                controls
                style={{ width: '100%', display: 'block' }}
              />
            ) : stepScreenshotUrl ? (
              <img
                key={stepScreenshotUrl}
                src={stepScreenshotUrl}
                alt={`Step ${activeStep} screenshot`}
                style={{ width: '100%', display: 'block', background: '#fff' }}
              />
            ) : (
              <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>
                No video or screenshot available
              </div>
            )}
            <div style={{
              padding: '8px 12px',
              background: '#1a1a1a',
              color: '#ccc',
              fontSize: 12,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span>Step {activeStep} / {episode.steps - 1}</span>
              <span style={{ color: '#888', fontSize: 11 }}>
                {'↑↓'} to navigate steps
              </span>
              <span>{episode.task_id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
