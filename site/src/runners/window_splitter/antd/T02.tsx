'use client';

/**
 * window_splitter-antd-T02: Collapse the Details pane (collapsible handle)
 * 
 * A centered isolated card titled "Primary splitter" contains an Ant Design Splitter 
 * configured with `collapsible` enabled. Two side-by-side panes are shown: the left 
 * pane is labeled "Editor" and the right pane is labeled "Details". The splitter 
 * handle includes the standard collapsible chevron controls on the bar. Initial state: 
 * both panes are expanded (about 60% Editor / 40% Details). A small status line under 
 * the component reads: "Details: Expanded" and flips to "Details: Collapsed" when the 
 * right pane collapses.
 * 
 * Success: The right pane (Details) is in the collapsed state.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Splitter, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [sizes, setSizes] = useState<number[]>([60, 40]);
  const [detailsCollapsed, setDetailsCollapsed] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    // Success when Details (right pane) is collapsed
    if (!successFiredRef.current && detailsCollapsed) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [detailsCollapsed, onSuccess]);

  return (
    <Card title="Primary splitter" style={{ width: 700 }}>
      <Splitter
        style={{ height: 300, boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}
        onResize={(newSizes) => {
          const total = newSizes.reduce((a, b) => a + b, 0);
          if (total > 0) {
            const percentSizes = newSizes.map(s => (s / total) * 100);
            setSizes(percentSizes);
            // Detect collapse: if right pane is very small (less than 5%)
            if (percentSizes[1] < 5) {
              setDetailsCollapsed(true);
            } else {
              setDetailsCollapsed(false);
            }
          }
        }}
        data-testid="splitter-primary"
      >
        <Splitter.Panel defaultSize="60%" min="20%">
          <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
            <span style={{ fontWeight: 500 }}>Editor</span>
          </div>
        </Splitter.Panel>
        <Splitter.Panel 
          defaultSize="40%" 
          min="0%" 
          collapsible
        >
          <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
            <span style={{ fontWeight: 500 }}>Details</span>
          </div>
        </Splitter.Panel>
      </Splitter>
      <div 
        style={{ marginTop: 12, textAlign: 'center', color: '#666', fontSize: 14 }}
        data-collapsed={detailsCollapsed}
      >
        Details: {detailsCollapsed ? 'Collapsed' : 'Expanded'}
      </div>
    </Card>
  );
}
