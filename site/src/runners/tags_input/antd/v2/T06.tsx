'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Card, Select, Typography, Drawer, Button, Space } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

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

export default function T06({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(['legacy']);
  const [savedTags, setSavedTags] = useState<string[]>(['legacy']);

  const handleApply = () => {
    setSavedTags([...tags]);
    setDrawerOpen(false);
  };

  const handleCancel = () => {
    setTags([...savedTags]);
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(savedTags, ['alpha-beta', 'risk', 'qa'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [savedTags, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ maxWidth: 360 }}>
        <Text>Manage topic labels for the current workspace.</Text>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => setDrawerOpen(true)}>
            Edit topics
          </Button>
        </div>
      </Card>

      <Drawer
        title="Edit topics"
        open={drawerOpen}
        onClose={handleCancel}
        width={360}
        footer={
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleApply}>Apply topics</Button>
          </Space>
        }
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Topics</Text>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Type or paste values separated by ; or ,"
          value={tags}
          onChange={setTags}
          tokenSeparators={[';', ',']}
          open={false}
        />
      </Drawer>
    </div>
  );
}
