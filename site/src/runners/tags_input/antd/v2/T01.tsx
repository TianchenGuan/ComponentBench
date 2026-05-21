'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Card, Select, Typography, Drawer, Button, Space } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const suggestions = [
  'release', 'ops', 'nightly', 'qa', 'finance',
  'support', 'urgent', 'client', 'blocked',
];

function setsEqual(a: string[], b: string[]): boolean {
  const sa = new Set(a.map(s => s.toLowerCase().trim()));
  const sb = new Set(b.map(s => s.toLowerCase().trim()));
  if (sa.size !== sb.size) return false;
  const arr = Array.from(sa);
  for (let i = 0; i < arr.length; i++) {
    if (!sb.has(arr[i])) return false;
  }
  return true;
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [publicTags, setPublicTags] = useState<string[]>(['todo', 'draft']);
  const [internalTags, setInternalTags] = useState<string[]>(['internal', 'private']);
  const [savedPublic, setSavedPublic] = useState<string[]>(['todo', 'draft']);
  const [savedInternal, setSavedInternal] = useState<string[]>(['internal', 'private']);

  const handleApply = () => {
    setSavedPublic([...publicTags]);
    setSavedInternal([...internalTags]);
    setDrawerOpen(false);
  };

  const handleCancel = () => {
    setPublicTags([...savedPublic]);
    setInternalTags([...savedInternal]);
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(savedPublic, ['urgent', 'client', 'blocked']) &&
      setsEqual(savedInternal, ['internal', 'private'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [savedPublic, savedInternal, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Card title="Label management" style={{ maxWidth: 500 }}>
        <Text>Manage your labels for the current project.</Text>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => setDrawerOpen(true)}>
            Edit labels
          </Button>
        </div>
      </Card>

      <Drawer
        title="Edit labels"
        open={drawerOpen}
        onClose={handleCancel}
        width={400}
        footer={
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleApply}>Apply labels</Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Public labels</Text>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Type and press Enter…"
            value={publicTags}
            onChange={setPublicTags}
            options={suggestions.map(s => ({ label: s, value: s }))}
            tokenSeparators={[',']}
          />
        </div>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Internal labels</Text>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Type and press Enter…"
            value={internalTags}
            onChange={setInternalTags}
            options={suggestions.map(s => ({ label: s, value: s }))}
            tokenSeparators={[',']}
          />
        </div>
      </Drawer>
    </div>
  );
}
