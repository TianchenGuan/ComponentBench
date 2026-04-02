'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { HumanRecorder } from '@/lib/recording/recorder';

interface RecordOverlayProps {
  runId: string;
  taskId: string;
  pass: number;
  currentIndex: number;
  totalTasks: number;
  onFinalized: (status: 'SUCCESS' | 'SKIPPED' | 'ABORTED') => void;
}

export default function RecordOverlay({
  runId, taskId, pass, currentIndex, totalTasks, onFinalized,
}: RecordOverlayProps) {
  const recorderRef = useRef<HumanRecorder | null>(null);
  const [stepCount, setStepCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const episodeId = `${taskId}_pass${pass}`;
    const rec = new HumanRecorder(runId, episodeId, pass);
    recorderRef.current = rec;
    rec.start();

    const interval = setInterval(() => {
      if (rec.isActive) {
        setStepCount(rec.currentStep);
        setElapsed(rec.elapsedMs);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      rec.stop();
    };
  }, [runId, taskId, pass]);

  useEffect(() => {
    const handler = async () => {
      const rec = recorderRef.current;
      if (!rec || !rec.isActive) return;
      await rec.finalize('SUCCESS');
      onFinalized('SUCCESS');
    };

    window.addEventListener('componentbench:task-success', handler);
    return () => window.removeEventListener('componentbench:task-success', handler);
  }, [onFinalized]);

  const handleSkip = useCallback(async () => {
    const rec = recorderRef.current;
    if (!rec) return;
    await rec.finalize('SKIPPED');
    onFinalized('SKIPPED');
  }, [onFinalized]);

  const handlePause = useCallback(async () => {
    const rec = recorderRef.current;
    if (!rec) return;
    await rec.finalize('ABORTED', 'Paused by user');
    onFinalized('ABORTED');
  }, [onFinalized]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  // Collapsed: tiny pill showing REC + pass badge
  if (!expanded) {
    return (
      <div
        onClick={() => setExpanded(true)}
        style={{
          position: 'fixed',
          top: 6,
          right: 6,
          zIndex: 10000,
          background: 'rgba(0,0,0,0.8)',
          color: '#fff',
          borderRadius: 12,
          padding: '4px 10px',
          fontSize: 11,
          fontFamily: 'monospace',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          userSelect: 'none',
        }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#52c41a', display: 'inline-block',
        }} />
        <span style={{ fontWeight: 700 }}>REC</span>
        <span style={{
          padding: '1px 5px', borderRadius: 3, fontSize: 9, fontWeight: 700,
          background: pass === 1 ? '#1677ff' : '#faad14', color: '#fff',
        }}>
          {pass === 1 ? 'COLD' : 'WARM'}
        </span>
        <span style={{ color: '#999' }}>{stepCount}s</span>
      </div>
    );
  }

  // Expanded: full panel
  return (
    <div style={{
      position: 'fixed',
      top: 6,
      right: 6,
      zIndex: 10000,
      background: 'rgba(0,0,0,0.88)',
      color: '#fff',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 11,
      fontFamily: 'monospace',
      minWidth: 180,
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      userSelect: 'none',
    }}>
      <div
        onClick={() => setExpanded(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, cursor: 'pointer' }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#52c41a', display: 'inline-block',
        }} />
        <span style={{ fontWeight: 700, fontSize: 12 }}>REC</span>
        <span style={{
          padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700,
          background: pass === 1 ? '#1677ff' : '#faad14', color: '#fff',
        }}>
          {pass === 1 ? 'COLD' : 'WARM'}
        </span>
        <span style={{ marginLeft: 'auto', color: '#666', fontSize: 10 }}>click to minimize</span>
      </div>

      <div style={{ color: '#999', fontSize: 10, marginBottom: 4, lineHeight: 1.5 }}>
        {taskId} &middot; {currentIndex + 1}/{totalTasks}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 6, fontSize: 12 }}>
        <div>
          <span style={{ color: '#999', fontSize: 9 }}>Steps </span>
          <span style={{ fontWeight: 700 }}>{stepCount}</span>
        </div>
        <div>
          <span style={{ color: '#999', fontSize: 9 }}>Time </span>
          <span style={{ fontWeight: 700 }}>{formatTime(elapsed)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={handlePause}
          style={{
            flex: 1, padding: '4px 0', border: '1px solid #faad14',
            borderRadius: 3, background: 'transparent', color: '#faad14',
            cursor: 'pointer', fontSize: 10, fontWeight: 600,
          }}
        >
          Pause
        </button>
        <button
          onClick={handleSkip}
          style={{
            flex: 1, padding: '4px 0', border: '1px solid #ff4d4f',
            borderRadius: 3, background: 'transparent', color: '#ff4d4f',
            cursor: 'pointer', fontSize: 10, fontWeight: 600,
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
