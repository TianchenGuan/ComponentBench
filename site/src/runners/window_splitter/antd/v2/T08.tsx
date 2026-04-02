'use client';

/**
 * window_splitter-antd-v2-T08: Dark visual reference 72/28 — no numeric readout
 *
 * Left / Right splitter; thumbnail data-reference-id antd_dark_ref_72_28. Success: left 70%–74%.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Splitter, Card } from 'antd';
import type { TaskComponentProps } from '../../types';

function normalizePercents(raw: number[]): number[] {
  const total = raw.reduce((a, b) => a + b, 0);
  if (total <= 0) return [50, 50];
  return raw.map((s) => (s / total) * 100);
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [sizes, setSizes] = useState<number[]>([50, 50]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const left = sizes[0] / 100;
    if (left >= 0.7 && left <= 0.74) {
      successFired.current = true;
      onSuccess();
    }
  }, [sizes, onSuccess]);

  return (
    <Card
      size="small"
      title="Dark layout"
      style={{ width: 440, transform: 'scale(0.9)', transformOrigin: 'top left' }}
      styles={{
        header: { background: '#1a1a1a', color: '#e8e8e8', borderBottom: '1px solid #333' },
        body: { background: '#0d0d0d', padding: 14 },
      }}
      data-testid="dark-splitter-card"
    >
      <Splitter
        style={{ height: 200, boxShadow: '0 0 6px rgba(0,0,0,0.5)' }}
        onResize={(raw) => setSizes(normalizePercents(raw))}
      >
        <Splitter.Panel min="15%" max="90%" size={sizes[0]}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#262626',
              borderRight: '2px solid #434343',
            }}
          >
            <span style={{ color: '#fafafa', fontWeight: 600 }}>Left</span>
          </div>
        </Splitter.Panel>
        <Splitter.Panel size={sizes[1]}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#141414',
            }}
          >
            <span style={{ color: '#a3a3a3', fontWeight: 600 }}>Right</span>
          </div>
        </Splitter.Panel>
      </Splitter>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>Target layout</div>
        <div
          data-reference-id="antd_dark_ref_72_28"
          style={{
            display: 'flex',
            height: 44,
            border: '1px solid #444',
            borderRadius: 4,
            overflow: 'hidden',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          aria-hidden
        >
          <div
            style={{
              width: '72%',
              background: '#303030',
              borderRight: '2px solid #555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#9a9a9a', fontSize: 10 }}>Left</span>
          </div>
          <div
            style={{
              width: '28%',
              background: '#1c1c1c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#666', fontSize: 10 }}>Right</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
