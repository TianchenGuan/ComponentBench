'use client';

/**
 * window_splitter-antd-T03: Reset to equal split using divider control
 * 
 * A centered isolated card titled "Primary splitter" contains an Ant Design Splitter 
 * with two panes ("Left pane" and "Right pane"). The initial layout is intentionally 
 * uneven: Left pane about 70%, Right pane about 30%. The splitter handle is customized 
 * to include a small inline control labeled "Reset" (a circular arrow icon with text) 
 * embedded on the bar itself. A percentage readout below the splitter shows the current 
 * sizes to one decimal place. Clicking the embedded Reset control immediately restores 
 * the default equal split.
 * 
 * Success: Both panes are equal within ±2% (50/50)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Splitter, Card, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [sizes, setSizes] = useState<number[]>([70, 30]);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const leftFraction = sizes[0] / 100;
    // Success: both panes equal within ±2% (0.48 to 0.52)
    if (!successFiredRef.current && leftFraction >= 0.48 && leftFraction <= 0.52) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [sizes, onSuccess]);

  const handleReset = () => {
    setSizes([50, 50]);
  };

  return (
    <Card title="Primary splitter" style={{ width: 700 }}>
      <div style={{ position: 'relative' }}>
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
          <Splitter.Panel size={sizes[0]} min="10%" max="90%">
            <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
              <span style={{ fontWeight: 500 }}>Left pane</span>
            </div>
          </Splitter.Panel>
          <Splitter.Panel size={sizes[1]} min="10%" max="90%">
            <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
              <span style={{ fontWeight: 500 }}>Right pane</span>
            </div>
          </Splitter.Panel>
        </Splitter>
        {/* Reset button overlay on the splitter bar */}
        <div
          style={{
            position: 'absolute',
            left: `${sizes[0]}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={handleReset}
            data-testid="reset-button"
            style={{ 
              fontSize: 11, 
              padding: '2px 8px',
              height: 'auto',
              background: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <div style={{ marginTop: 12, textAlign: 'center', color: '#666', fontSize: 14 }}>
        Left pane: {sizes[0].toFixed(1)}% • Right pane: {sizes[1].toFixed(1)}%
      </div>
    </Card>
  );
}
