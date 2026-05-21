'use client';

/**
 * window_splitter-antd-v2-T04: Four-pane layout 20/45/20/15 (±2 each)
 *
 * Isolated small-scale card: Files, Editor, Preview, Console. Initial ~25/30/25/20.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Splitter, Card, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const TARGETS = [0.2, 0.45, 0.2, 0.15];
const TOL = 0.02;

function normalizePercents(raw: number[]): number[] {
  const total = raw.reduce((a, b) => a + b, 0);
  if (total <= 0) return [25, 30, 25, 20];
  return raw.map((s) => (s / total) * 100);
}

const LABELS = ['Files', 'Editor', 'Preview', 'Console'] as const;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [sizes, setSizes] = useState<number[]>([25, 30, 25, 20]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const fr = sizes.map((s) => s / 100);
    const ok = TARGETS.every((t, i) => fr[i] >= t - TOL && fr[i] <= t + TOL);
    if (ok) {
      successFired.current = true;
      onSuccess();
    }
  }, [sizes, onSuccess]);

  return (
    <Card
      size="small"
      title="Four-pane IDE"
      style={{ width: 520, transform: 'scale(0.92)', transformOrigin: 'top center' }}
      data-testid="four-pane-card"
    >
      <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
        Match Files 20%, Editor 45%, Preview 20%, Console 15% (±2 each).
      </Typography.Text>
      <Splitter
        style={{ height: 220, boxShadow: '0 0 4px rgba(0,0,0,0.08)' }}
        onResize={(newSizes) => setSizes(normalizePercents(newSizes))}
      >
        {LABELS.map((label, idx) => (
          <Splitter.Panel
            key={label}
            min="8%"
            max="55%"
            size={sizes[idx]}
          >
            <div
              style={{
                padding: 8,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: idx % 2 === 0 ? '#fafafa' : '#fff',
                borderRight: idx < 3 ? '1px solid #f0f0f0' : undefined,
              }}
            >
              <Typography.Text strong style={{ fontSize: 11, marginBottom: 6 }}>
                {label}
              </Typography.Text>
              <div style={{ flex: 1, color: '#bbb', fontSize: 10 }}>…</div>
            </div>
          </Splitter.Panel>
        ))}
      </Splitter>
      <table style={{ width: '100%', marginTop: 10, fontSize: 11, borderCollapse: 'collapse' }}>
        <tbody>
          {LABELS.map((label, i) => (
            <tr key={label}>
              <td style={{ padding: '2px 6px', color: '#888' }}>{label}</td>
              <td style={{ padding: '2px 6px', textAlign: 'right' }}>{sizes[i].toFixed(0)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
