'use client';

/**
 * virtual_list-antd-v2-T05
 * Artifact browser: scroll inside the browser, pin the exact row, then save
 *
 * Nested scroll layout. Page has its own scroll; an inner "Artifact browser"
 * pane has a virtualized list with per-row "Pinned" toggles. Agent must pin
 * AST-148 and click "Save pins".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Switch, Typography, Breadcrumb, Tag, Space } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface ArtifactItem { key: string; code: string; label: string; }

const artifactLabels = [
  'Build output', 'Test report', 'Coverage map', 'Data export', 'Config snapshot',
  'Dependency graph', 'Bundle analysis', 'Schema diff', 'Migration log', 'Asset manifest',
];

function buildArtifacts(): ArtifactItem[] {
  return Array.from({ length: 500 }, (_, i) => ({
    key: `ast-${i}`,
    code: `AST-${i}`,
    label: artifactLabels[i % artifactLabels.length],
  }));
}

const artifacts = buildArtifacts();

export default function T05({ onSuccess }: TaskComponentProps) {
  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (saved && pinned.has('ast-148')) {
      successRef.current = true;
      onSuccess();
    }
  }, [saved, pinned, onSuccess]);

  const togglePin = (key: string) => {
    setPinned(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setSaved(false);
  };

  return (
    <div style={{ height: 600, overflow: 'auto', padding: 16 }}>
      <Breadcrumb items={[{ title: 'Home' }, { title: 'Builds' }, { title: 'Artifacts' }]} />
      <Space style={{ margin: '8px 0' }}>
        <Tag>Branch: main</Tag>
        <Tag color="blue">Build #412</Tag>
      </Space>

      <Card size="small" title="Metadata" style={{ marginBottom: 12, maxWidth: 500 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>Size: 2.4 GB · Artifacts: 500 · Region: us-east-1</Text>
      </Card>

      <Card size="small" title="Artifact browser" style={{ maxWidth: 520 }} data-testid="artifact-browser">
        <div style={{ border: '1px solid #f0f0f0', borderRadius: 4 }}>
          <VirtualList data={artifacts} height={320} itemHeight={44} itemKey="key">
            {(item: ArtifactItem) => (
              <div
                key={item.key}
                data-item-key={item.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderBottom: '1px solid #f5f5f5',
                  fontSize: 13,
                }}
              >
                <span>{item.code} — {item.label}</span>
                <Switch
                  size="small"
                  checked={pinned.has(item.key)}
                  onChange={() => togglePin(item.key)}
                  checkedChildren="Pinned"
                  unCheckedChildren="Pin"
                />
              </div>
            )}
          </VirtualList>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Pinned: {pinned.size}</Text>
          <Button size="small" type="primary" onClick={() => setSaved(true)}>Save pins</Button>
        </div>
      </Card>

      <div style={{ height: 400 }} />
    </div>
  );
}
