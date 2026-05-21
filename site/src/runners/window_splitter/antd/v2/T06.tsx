'use client';

/**
 * window_splitter-antd-v2-T06: Bottom drawer vertical split — Timeline 62% height, Save layout
 *
 * Chart layout drawer: vertical Splitter Timeline (top) / Errors (bottom). Committed split after save.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Splitter, Card, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

function normalizePercents(raw: number[]): number[] {
  const total = raw.reduce((a, b) => a + b, 0);
  if (total <= 0) return [50, 50];
  return raw.map((s) => (s / total) * 100);
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<number[]>([50, 50]);
  const [committed, setCommitted] = useState<number[]>([50, 50]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const top = committed[0] / 100;
    if (top >= 0.61 && top <= 0.63) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  return (
    <div style={{ padding: 8 }}>
      <Button type="primary" onClick={() => setOpen(true)}>
        Chart layout
      </Button>

      <Drawer
        title="Chart layout"
        placement="bottom"
        height={420}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => setCommitted([...draft])}>
              Save layout
            </Button>
          </div>
        }
      >
        <Card size="small" bordered={false} style={{ marginBottom: 10 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Resize the horizontal divider so Timeline uses about 62% of the drawer body height, then save.
          </Text>
        </Card>
        <Splitter
          layout="vertical"
          style={{ height: 260, boxShadow: '0 0 4px rgba(0,0,0,0.08)' }}
          onResize={(raw) => setDraft(normalizePercents(raw))}
        >
          <Splitter.Panel min="15%" max="85%" size={draft[0]}>
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
              <Text strong>Timeline</Text>
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
              <Text strong>Errors</Text>
            </div>
          </Splitter.Panel>
        </Splitter>
        <div style={{ marginTop: 10, textAlign: 'center', fontSize: 13, color: '#666' }}>
          Timeline: {draft[0].toFixed(0)}% • Errors: {draft[1].toFixed(0)}%
        </div>
      </Drawer>
    </div>
  );
}
