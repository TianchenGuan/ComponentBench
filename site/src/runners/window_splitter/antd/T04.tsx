'use client';

/**
 * window_splitter-antd-T04: Set sidebar width within a pixel range
 * 
 * A centered isolated card titled "Primary splitter" contains an Ant Design Splitter 
 * inside a fixed-width container (exactly 800 px wide). Two panes are side-by-side: 
 * "Sidebar" on the left and "Content" on the right. Below the splitter is a live 
 * pixel readout: "Sidebar width: 400 px" (starting state) that updates continuously 
 * while dragging.
 * 
 * Success: Left pane width is within [300, 340] px (inclusive)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Splitter, Card } from 'antd';
import type { TaskComponentProps } from '../types';

const CONTAINER_WIDTH = 800;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [sizes, setSizes] = useState<number[]>([50, 50]);
  const successFiredRef = useRef(false);

  const sidebarWidthPx = Math.round((sizes[0] / 100) * CONTAINER_WIDTH);

  useEffect(() => {
    // Success: sidebar width is within [300, 340] px
    if (!successFiredRef.current && sidebarWidthPx >= 300 && sidebarWidthPx <= 340) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [sidebarWidthPx, onSuccess]);

  return (
    <Card title="Primary splitter" style={{ width: CONTAINER_WIDTH + 48 }}>
      <div style={{ width: CONTAINER_WIDTH }}>
        <Splitter
          style={{ height: 300, boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}
          onResize={(newSizes) => {
            const total = newSizes.reduce((a, b) => a + b, 0);
            if (total > 0) {
              setSizes(newSizes.map(s => (s / total) * 100));
            }
          }}
          data-testid="splitter-primary"
        >
          <Splitter.Panel defaultSize="50%" min="10%" max="90%">
            <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
              <span style={{ fontWeight: 500 }}>Sidebar</span>
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
              <span style={{ fontWeight: 500 }}>Content</span>
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
      <div style={{ marginTop: 12, textAlign: 'center', color: '#666', fontSize: 14 }}>
        Sidebar width: {sidebarWidthPx} px
      </div>
    </Card>
  );
}
