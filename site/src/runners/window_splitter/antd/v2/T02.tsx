'use client';

/**
 * window_splitter-antd-v2-T02: Lazy mode — Preview 41% after release only
 *
 * Splitter with lazy=true; readout updates only onResizeEnd. Fields (left), Preview (right), 50/50.
 * Success: Preview (right) fraction 40%–42% after final release (evaluated from committed sizes on end).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Splitter, Card, Input, Checkbox, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Title } = Typography;

function normalizePercents(raw: number[]): number[] {
  const total = raw.reduce((a, b) => a + b, 0);
  if (total <= 0) return [50, 50];
  return raw.map((s) => (s / total) * 100);
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [sizes, setSizes] = useState<number[]>([50, 50]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const preview = sizes[1] / 100;
    if (preview >= 0.4 && preview <= 0.42) {
      successFired.current = true;
      onSuccess();
    }
  }, [sizes, onSuccess]);

  return (
    <div style={{ width: 720 }}>
      <Title level={4} style={{ marginBottom: 14 }}>
        Operations dashboard
      </Title>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>
            Owner
          </Typography.Text>
          <Input size="small" placeholder="Filter owner" />
        </div>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>
            Region
          </Typography.Text>
          <Input size="small" placeholder="Filter region" />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <Checkbox>Alerts</Checkbox>
        <Checkbox style={{ marginLeft: 14 }}>Maintenance</Checkbox>
      </div>

      <Card size="small" title="Lazy splitter" data-testid="lazy-splitter-card">
        <Splitter
          lazy
          style={{ height: 260, boxShadow: '0 0 4px rgba(0,0,0,0.08)' }}
          onResizeEnd={(newSizes) => {
            setSizes(normalizePercents(newSizes));
          }}
        >
          <Splitter.Panel defaultSize="50%" min="15%" max="85%">
            <div
              style={{
                padding: 12,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa',
              }}
            >
              <span style={{ fontWeight: 600 }}>Fields</span>
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div
              style={{
                padding: 12,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f0f0f0',
              }}
            >
              <span style={{ fontWeight: 600 }}>Preview</span>
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
