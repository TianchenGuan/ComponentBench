'use client';

/**
 * tree_select-antd-v2-T04: Lazy-loaded modal repository path with deferred children
 *
 * Modal flow: "Choose component path" opens a modal with a TreeSelect using loadData.
 * Top levels (repo, packages, ui) load immediately; children under "ui" load async.
 * Select "packages / ui / button" and click "Use path".
 *
 * Success: value = repo-packages-ui-button, "Use path" clicked.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Card, TreeSelect, Modal, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface TNode {
  id: string;
  pId: string;
  value: string;
  title: string;
  isLeaf?: boolean;
}

const initialTree: TNode[] = [
  { id: 'repo', pId: '0', value: 'repo', title: 'repo', isLeaf: false },
  { id: 'repo-packages', pId: 'repo', value: 'repo-packages', title: 'packages', isLeaf: false },
  { id: 'repo-src', pId: 'repo', value: 'repo-src', title: 'src', isLeaf: true },
  { id: 'repo-packages-ui', pId: 'repo-packages', value: 'repo-packages-ui', title: 'ui', isLeaf: false },
  { id: 'repo-packages-utils', pId: 'repo-packages', value: 'repo-packages-utils', title: 'utils', isLeaf: true },
];

const lazyChildren: TNode[] = [
  { id: 'repo-packages-ui-badge', pId: 'repo-packages-ui', value: 'repo-packages-ui-badge', title: 'badge', isLeaf: true },
  { id: 'repo-packages-ui-button', pId: 'repo-packages-ui', value: 'repo-packages-ui-button', title: 'button', isLeaf: true },
  { id: 'repo-packages-ui-button-group', pId: 'repo-packages-ui', value: 'repo-packages-ui-button-group', title: 'button-group', isLeaf: true },
  { id: 'repo-packages-ui-card', pId: 'repo-packages-ui', value: 'repo-packages-ui-card', title: 'card', isLeaf: true },
  { id: 'repo-packages-ui-input', pId: 'repo-packages-ui', value: 'repo-packages-ui-input', title: 'input', isLeaf: true },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [treeNodes, setTreeNodes] = useState<TNode[]>(initialTree);
  const [value, setValue] = useState<string | undefined>(undefined);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && value === 'repo-packages-ui-button') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, value, onSuccess]);

  const onLoadData = useCallback(
    ({ value: nodeVal }: { value: string }) =>
      new Promise<void>((resolve) => {
        if (nodeVal === 'repo-packages-ui') {
          setTimeout(() => {
            setTreeNodes((prev) => {
              const ids = new Set(prev.map((n) => n.id));
              const newNodes = lazyChildren.filter((n) => !ids.has(n.id));
              return newNodes.length ? [...prev, ...newNodes] : prev;
            });
            resolve();
          }, 600);
        } else {
          resolve();
        }
      }),
    [],
  );

  const handleUse = () => {
    setCommitted(true);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 16 }}>
      <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 12 }}>Code Review</Text>
      <Card size="small" style={{ maxWidth: 400, filter: modalOpen ? 'blur(2px)' : undefined }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>Select a component to review.</Text>
        <Button type="primary" onClick={() => setModalOpen(true)}>Choose component path</Button>
      </Card>

      <Modal
        title="Choose Component Path"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleUse}>Use path</Button>
          </Space>
        }
      >
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Repository path</Text>
        <TreeSelect
          style={{ width: '100%' }}
          value={value}
          onChange={(val) => { setValue(val); setCommitted(false); }}
          treeDataSimpleMode
          treeData={treeNodes}
          loadData={onLoadData as any}
          placeholder="Expand to select a path"
          showSearch={false}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        />
      </Modal>
    </div>
  );
}
