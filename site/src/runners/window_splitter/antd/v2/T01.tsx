'use client';

/**
 * window_splitter-antd-v2-T01: Inspector panel to 37% with saved layout
 *
 * Layout panel with compact spacing and medium clutter. Canvas (left) and Inspector (right)
 * on an Ant Design Splitter starting 50/50. Live readout; "Unsaved" chip when draft ≠ committed.
 * Success: committed Inspector (right) is 37% ±1% after "Apply layout".
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Splitter, Card, Switch, Select, Typography, Space, Tag, Button } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

function normalizePercents(raw: number[]): number[] {
  const total = raw.reduce((a, b) => a + b, 0);
  if (total <= 0) return raw.map(() => 50);
  return raw.map((s) => (s / total) * 100);
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [draft, setDraft] = useState<number[]>([50, 50]);
  const [committed, setCommitted] = useState<number[]>([50, 50]);
  const successFired = useRef(false);

  const unsaved = useMemo(() => {
    return draft.some((d, i) => Math.abs(d - committed[i]) > 0.05);
  }, [draft, committed]);

  useEffect(() => {
    if (successFired.current) return;
    const insp = committed[1] / 100;
    if (insp >= 0.36 && insp <= 0.38) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const apply = () => {
    setCommitted([...draft]);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 760,
        padding: 16,
        background: '#f5f5f5',
        borderRadius: 8,
      }}
    >
      <Title level={5} style={{ marginBottom: 12 }}>
        Layout
      </Title>
      <Space direction="vertical" size={10} style={{ width: '100%', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Snap to grid
          </Text>
          <Switch size="small" defaultChecked />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Density
          </Text>
          <Select
            size="small"
            style={{ width: 120 }}
            defaultValue="comfortable"
            options={[
              { label: 'Comfortable', value: 'comfortable' },
              { label: 'Compact', value: 'compact' },
            ]}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Theme token
          </Text>
          <Select
            size="small"
            style={{ width: 120 }}
            defaultValue="default"
            options={[
              { label: 'Default', value: 'default' },
              { label: 'Brand', value: 'brand' },
            ]}
          />
        </div>
      </Space>

      <Card
        size="small"
        title="Canvas / Inspector"
        extra={unsaved ? <Tag color="warning">Unsaved</Tag> : <Tag color="success">Saved</Tag>}
        data-testid="layout-splitter-card"
      >
        <Splitter
          style={{ height: 260, boxShadow: '0 0 4px rgba(0,0,0,0.08)' }}
          onResize={(newSizes) => {
            setDraft(normalizePercents(newSizes));
          }}
        >
          <Splitter.Panel min="10%" max="90%" size={draft[0]}>
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
              <Text strong>Canvas</Text>
            </div>
          </Splitter.Panel>
          <Splitter.Panel size={draft[1]}>
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
              <Text strong>Inspector</Text>
            </div>
          </Splitter.Panel>
        </Splitter>
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Canvas: {draft[0].toFixed(0)}% • Inspector: {draft[1].toFixed(0)}%
          </Text>
        </div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button size="small" onClick={() => setDraft([...committed])}>
            Reset draft
          </Button>
          <Button type="primary" size="small" onClick={apply}>
            Apply layout
          </Button>
        </div>
      </Card>
    </div>
  );
}
