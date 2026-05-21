'use client';

/**
 * window_splitter-antd-v2-T03: Collapse Files, re-expand to 28%, Save layout
 *
 * Drawer with Workspace splitter: Files (left, collapsible) | Editor (right), starts 36/64.
 * Must complete a Files collapse cycle, then committed Files width 27%–29% after "Save layout".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Splitter, Card, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

function normalizePercents(raw: number[]): number[] {
  const total = raw.reduce((a, b) => a + b, 0);
  if (total <= 0) return [36, 64];
  return raw.map((s) => (s / total) * 100);
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<number[]>([36, 64]);
  const [committed, setCommitted] = useState<number[]>([36, 64]);
  const sawFilesCollapsed = useRef(false);
  const collapseCycleDone = useRef(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const files = committed[0] / 100;
    if (collapseCycleDone.current && files >= 0.27 && files <= 0.29) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  useEffect(() => {
    if (draft[0] < 3) {
      sawFilesCollapsed.current = true;
    }
    if (sawFilesCollapsed.current && draft[0] >= 5) {
      collapseCycleDone.current = true;
    }
  }, [draft]);

  return (
    <div style={{ padding: 8 }}>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open workspace layout
      </Button>

      <Drawer
        title="Workspace layout"
        placement="right"
        width={560}
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
        <Card size="small" bordered={false} style={{ marginBottom: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Drag the divider or use the Files collapse control, then resize Files to about 28% and save.
          </Text>
        </Card>
        <Splitter
          style={{ height: 280, boxShadow: '0 0 4px rgba(0,0,0,0.08)' }}
          onResize={(newSizes) => {
            const next = normalizePercents(newSizes);
            setDraft(next);
          }}
        >
          <Splitter.Panel min="0%" max="90%" size={draft[0]} collapsible>
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
              <Text strong>Files</Text>
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
              <Text strong>Editor</Text>
            </div>
          </Splitter.Panel>
        </Splitter>
        <div style={{ marginTop: 10, textAlign: 'center', fontSize: 13, color: '#666' }}>
          Files: {draft[0].toFixed(0)}% • Editor: {draft[1].toFixed(0)}%
        </div>
      </Drawer>
    </div>
  );
}
