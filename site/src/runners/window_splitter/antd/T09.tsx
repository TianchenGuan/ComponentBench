'use client';

/**
 * window_splitter-antd-T09: Lazy resize: set Preview to 40% (updates on release)
 * 
 * The page uses a form_section layout titled "Report builder" with several realistic 
 * but non-required controls (text inputs and checkboxes) above the main preview area. 
 * In the main area is a card labeled "Primary splitter" containing an Ant Design 
 * Splitter configured in lazy mode: dragging shows a ghost divider, but the actual 
 * pane sizes and the numeric readout only update when the pointer is released. Two 
 * horizontal panes are shown: "Fields" (left) and "Preview" (right). Initial state 
 * is 50/50. A readout line under the splitter displays "Preview: 50%" and updates 
 * only on drag end. Spacing is compact to increase density around the splitter.
 * 
 * Success: Preview (right) is 40% ±2% after drag end
 */

import React, { useState, useEffect, useRef } from 'react';
import { Splitter, Card, Input, Checkbox, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Title } = Typography;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [sizes, setSizes] = useState<number[]>([50, 50]);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const previewFraction = sizes[1] / 100;
    // Success: Preview (right) is 40% ±2% (0.38 to 0.42)
    if (!successFiredRef.current && previewFraction >= 0.38 && previewFraction <= 0.42) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [sizes, onSuccess]);

  return (
    <div style={{ width: 750 }}>
      <Title level={4} style={{ marginBottom: 16 }}>Report builder</Title>
      
      {/* Form fields (non-functional) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Report name</label>
          <Input placeholder="Enter report name" size="small" />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Date range</label>
          <Input placeholder="Select date range" size="small" />
        </div>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Checkbox>Include summary</Checkbox>
        <Checkbox style={{ marginLeft: 16 }}>Export as PDF</Checkbox>
      </div>

      {/* Primary splitter with lazy mode */}
      <Card title="Primary splitter" size="small">
        <Splitter
          style={{ height: 280, boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}
          lazy
          onResizeEnd={(newSizes) => {
            const total = newSizes.reduce((a, b) => a + b, 0);
            if (total > 0) {
              setSizes(newSizes.map(s => (s / total) * 100));
            }
          }}
          data-testid="splitter-primary"
        >
          <Splitter.Panel defaultSize="50%" min="20%" max="80%">
            <div style={{ padding: 12, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
              <span style={{ fontWeight: 500 }}>Fields</span>
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={{ padding: 12, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
              <span style={{ fontWeight: 500 }}>Preview</span>
            </div>
          </Splitter.Panel>
        </Splitter>
        <div style={{ marginTop: 8, textAlign: 'center', color: '#666', fontSize: 13 }}>
          Preview: {sizes[1].toFixed(0)}%
        </div>
      </Card>
    </div>
  );
}
