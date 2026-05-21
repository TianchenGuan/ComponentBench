'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Card, Select, Typography, Modal, Button, Tag, Space, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const suggestions = ['hotfix', 'qa', 'docs', 'client-facing', 'release', 'notes'];

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

export default function T04({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(['draft']);
  const [savedTags, setSavedTags] = useState<string[]>(['draft']);

  const handleApply = () => {
    setSavedTags([...tags]);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setTags([...savedTags]);
    setModalOpen(false);
  };

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(savedTags, ['release', 'notes'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [savedTags, onSuccess]);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ minHeight: '100vh', background: '#1a1a2e', padding: 40 }}>
        <Card style={{ maxWidth: 420, margin: '0 auto', background: '#16213e' }}>
          <Text style={{ display: 'block', marginBottom: 12, color: '#ccc' }}>Target badges:</Text>
          <Space style={{ marginBottom: 20 }}>
            <Tag color="blue">release</Tag>
            <Tag color="green">notes</Tag>
          </Space>
          <div>
            <Button type="primary" onClick={() => setModalOpen(true)}>
              Edit keywords
            </Button>
          </div>
        </Card>

        <Modal
          title="Edit keywords"
          open={modalOpen}
          onCancel={handleCancel}
          footer={
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={handleApply}>Apply</Button>
            </Space>
          }
        >
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Tags</Text>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Type and press Enter…"
            value={tags}
            onChange={setTags}
            options={suggestions.map(s => ({ label: s, value: s }))}
            tokenSeparators={[',']}
          />
        </Modal>
      </div>
    </ConfigProvider>
  );
}
