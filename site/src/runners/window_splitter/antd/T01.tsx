'use client';

/**
 * window_splitter-antd-T01: Resize sidebar to 30% (basic)
 * 
 * A single isolated card is centered in the viewport titled "Primary splitter".
 * Inside the card is an Ant Design Splitter in its default (horizontal) layout 
 * with two side-by-side panes: the left pane is labeled "Sidebar" and the right 
 * pane is labeled "Main". The splitter bar is visible between panes with the 
 * default draggable hit area and a subtle grip indicator. Below the splitter, 
 * a live text readout updates while dragging: "Sidebar: 50% • Main: 50%" (starting state).
 * 
 * Success: Sidebar (left) pane is 30% ±5%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Splitter, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [sizes, setSizes] = useState<number[]>([50, 50]);
  const containerRef = useRef<HTMLDivElement>(null);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const leftFraction = sizes[0] / 100;
    // Success: left pane is 30% ±5% (0.25 to 0.35)
    if (!successFiredRef.current && leftFraction >= 0.25 && leftFraction <= 0.35) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [sizes, onSuccess]);

  return (
    <Card title="Primary splitter" style={{ width: 700 }}>
      <div ref={containerRef} data-testid="splitter-primary">
        <Splitter
          style={{ height: 300, boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}
          onResize={(newSizes) => {
            const total = newSizes.reduce((a, b) => a + b, 0);
            if (total > 0) {
              setSizes(newSizes.map(s => (s / total) * 100));
            }
          }}
        >
          <Splitter.Panel defaultSize="50%" min="10%" max="90%">
            <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
              <span style={{ fontWeight: 500 }}>Sidebar</span>
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
              <span style={{ fontWeight: 500 }}>Main</span>
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
      <div style={{ marginTop: 12, textAlign: 'center', color: '#666', fontSize: 14 }}>
        Sidebar: {sizes[0].toFixed(0)}% • Main: {sizes[1].toFixed(0)}%
      </div>
    </Card>
  );
}
