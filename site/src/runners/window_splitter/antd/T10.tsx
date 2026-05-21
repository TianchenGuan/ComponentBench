'use client';

/**
 * window_splitter-antd-T10: Visual-only: match the target split image (70/30)
 * 
 * A centered isolated card titled "Primary splitter" is shown in dark theme with 
 * standard spacing. The card contains a two-pane Ant Design Splitter (left pane "A", 
 * right pane "B"). To emphasize visual matching, the UI does NOT show a numeric 
 * percent readout; instead it shows a small static reference thumbnail labeled 
 * "Target layout" directly below the splitter. The reference thumbnail depicts 
 * pane A clearly wider than pane B (approximately a 70/30 split).
 * 
 * Success: Pane A (left) is 70% ±1.5%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Splitter, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [sizes, setSizes] = useState<number[]>([50, 50]);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const leftFraction = sizes[0] / 100;
    // Success: left pane is 70% ±1.5% (0.685 to 0.715)
    if (!successFiredRef.current && leftFraction >= 0.685 && leftFraction <= 0.715) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [sizes, onSuccess]);

  return (
    <Card 
      title="Primary splitter" 
      style={{ width: 600 }}
      styles={{ 
        header: { background: '#1f1f1f', color: '#fff', borderBottom: '1px solid #303030' },
        body: { background: '#141414', padding: 16 }
      }}
    >
      <Splitter
        style={{ height: 280, boxShadow: '0 0 5px rgba(0,0,0,0.3)' }}
        onResize={(newSizes) => {
          const total = newSizes.reduce((a, b) => a + b, 0);
          if (total > 0) {
            setSizes(newSizes.map(s => (s / total) * 100));
          }
        }}
        data-testid="splitter-primary"
      >
        <Splitter.Panel defaultSize="50%" min="20%" max="90%">
          <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2a2a2a' }}>
            <span style={{ fontWeight: 500, color: '#fff', fontSize: 18 }}>A</span>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1f1f1f' }}>
            <span style={{ fontWeight: 500, color: '#fff', fontSize: 18 }}>B</span>
          </div>
        </Splitter.Panel>
      </Splitter>

      {/* Reference thumbnail - no numeric readout */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Target layout</div>
        <div style={{ display: 'flex', height: 50, border: '1px solid #404040', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: '70%', background: '#3a3a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid #555' }}>
            <span style={{ color: '#aaa', fontSize: 11 }}>A</span>
          </div>
          <div style={{ width: '30%', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#888', fontSize: 11 }}>B</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
