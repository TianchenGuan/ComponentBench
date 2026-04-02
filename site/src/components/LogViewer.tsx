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
        setLoading(false);
      })
      .catch(e => { setError(String(e)); setLoading(false); });
  }, [episodeUrl]);

  const videoUrl = (() => {
    if (!episode || !selectedVideo || !episode.videos[selectedVideo]) return '';
    const val = episode.videos[selectedVideo];
    // If the backend injected a full URL (Supabase/public blob), use it directly.
    if (val.startsWith('http')) return val;
    // Otherwise (local backend), route through the blob proxy API.
    return `${videoBaseUrl}&file=${val}`;
  })();

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

  // Keyboard navigation
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

  // Auto-scroll active step into view
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
      <div style={{ flex: '0 0 440px', display: 'flex', flexDirection: 'column', maxHeight: '75vh' }}>
        {/* Episode header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e8e8e8',
          background: episode.success ? '#f6ffed' : '#fff2e8',
          border: '1px solid #e8e8e8',
          borderRadius: '8px 8px 0 0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: episode.success ? '#52c41a' : '#ff4d4f',
            }}>
              {episode.success ? 'PASS' : 'FAIL'}
            </span>
            <span style={{ fontSize: 12, color: '#999' }}>
              {episode.steps} steps | {episode.duration_seconds.toFixed(1)}s | {episode.termination_reason}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            {modeLabel(episode.mode)} | {episode.canonical_type} | {episode.library}
          </div>
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
          {episode.step_list.map((step) => (
            <div
              key={step.step_idx}
              data-step={step.step_idx}
              onClick={() => seekToStep(step.step_idx)}
              style={{
                padding: '10px 16px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                background: activeStep === step.step_idx ? '#e6f7ff' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#1677ff',
                  fontFamily: 'monospace',
                }}>
                  Step {step.step_idx}
                </span>
                <span style={{ fontSize: 10, color: '#999' }}>
                  {step.timestamp ? step.timestamp.split(' ')[1]?.split(',')[0] : ''}
                </span>
              </div>

              {/* Action */}
              <div style={{
                fontSize: 12,
                fontFamily: 'monospace',
                color: '#333',
                marginTop: 4,
                padding: '4px 8px',
                background: '#f6f8fa',
                borderRadius: 4,
                wordBreak: 'break-all',
              }}>
                {step.action || '(no action)'}
                {step.transformed_action && step.transformed_action !== step.action && (
                  <span style={{ color: '#999', marginLeft: 8 }}>
                    {'\u2192'} {step.transformed_action}
                  </span>
                )}
              </div>

              {/* Thinking */}
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
                    }}
                  >
                    {expandedSteps.has(step.step_idx) ? '\u25BC Thinking' : '\u25B6 Thinking'}
                  </button>
                  {expandedSteps.has(step.step_idx) && (
                    <div style={{
                      fontSize: 11,
                      color: '#666',
                      marginTop: 4,
                      padding: 8,
                      background: '#fafafa',
                      borderRadius: 4,
                      whiteSpace: 'pre-wrap',
                      maxHeight: 300,
                      overflowY: 'auto',
                      lineHeight: 1.5,
                    }}>
                      {step.thinking}
                    </div>
                  )}
                </div>
              )}

              {/* Raw output */}
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
                    {expandedSteps.has(10000 + step.step_idx) ? '\u25BC Raw output' : '\u25B6 Raw output'}
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
          ))}
        </div>
      </div>

      {/* Right: Video player */}
      <div style={{ flex: 1 }}>
        <div style={{ position: 'sticky', top: 80 }}>
          {/* Video variant selector */}
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
            ) : (
              <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>
                No video available
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
                {'\u2191\u2193'} to navigate steps
              </span>
              <span>{episode.task_id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
