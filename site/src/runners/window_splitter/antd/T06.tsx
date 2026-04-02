'use client';

/**
 * window_splitter-antd-T06: Two splitters: resize the Workspace split to 25%
 * 
 * The page uses a dashboard layout with two cards in a grid, each containing an 
 * Ant Design Splitter of the same style. Card A is labeled "Primary — Workspace" 
 * and contains panes "Files" (left) and "Editor" (right). Card B is labeled 
 * "Secondary — Logs" and contains panes "Stream" (left) and "Details" (right). 
 * Both splitters start at approximately 50/50. Only the split ratio of the 
 * Workspace splitter should determine success.
 * 
 * Success: Workspace splitter Files (left) pane is 25% ±3%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Splitter, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [workspaceSizes, setWorkspaceSizes] = useState<number[]>([50, 50]);
  const [logsSizes, setLogsSizes] = useState<number[]>([50, 50]);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const filesFraction = workspaceSizes[0] / 100;
    // Success: Files (left) pane is 25% ±3% (0.22 to 0.28)
    if (!successFiredRef.current && filesFraction >= 0.22 && filesFraction <= 0.28) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [workspaceSizes, onSuccess]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%', maxWidth: 1200 }}>
      {/* Card A: Primary — Workspace */}
      <Card title="Primary — Workspace">
        <Splitter
          style={{ height: 280, boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}
          onResize={(newSizes) => {
            const total = newSizes.reduce((a, b) => a + b, 0);
            if (total > 0) {
              setWorkspaceSizes(newSizes.map(s => (s / total) * 100));
            }
          }}
          data-testid="splitter-workspace"
        >
          <Splitter.Panel defaultSize="50%" min="10%" max="90%">
            <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
              <span style={{ fontWeight: 500 }}>Files</span>
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
              <span style={{ fontWeight: 500 }}>Editor</span>
            </div>
          </Splitter.Panel>
        </Splitter>
        <div style={{ marginTop: 8, textAlign: 'center', color: '#666', fontSize: 13 }}>
          Files: {workspaceSizes[0].toFixed(0)}% • Editor: {workspaceSizes[1].toFixed(0)}%
        </div>
      </Card>

      {/* Card B: Secondary — Logs */}
      <Card title="Secondary — Logs">
        <Splitter
          style={{ height: 280, boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}
          onResize={(newSizes) => {
            const total = newSizes.reduce((a, b) => a + b, 0);
            if (total > 0) {
              setLogsSizes(newSizes.map(s => (s / total) * 100));
            }
          }}
          data-testid="splitter-logs"
        >
          <Splitter.Panel defaultSize="50%" min="10%" max="90%">
            <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
              <span style={{ fontWeight: 500 }}>Stream</span>
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
              <span style={{ fontWeight: 500 }}>Details</span>
            </div>
          </Splitter.Panel>
        </Splitter>
        <div style={{ marginTop: 8, textAlign: 'center', color: '#666', fontSize: 13 }}>
          Stream: {logsSizes[0].toFixed(0)}% • Details: {logsSizes[1].toFixed(0)}%
        </div>
      </Card>
    </div>
  );
}
