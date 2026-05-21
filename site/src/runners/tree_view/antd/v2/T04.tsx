'use client';

/**
 * tree_view-antd-v2-T04: Virtual modules tree — scroll inside tree and apply exact sync set
 *
 * Nested scroll layout, dark theme, high clutter. Page has outer scroll with release notes/cards.
 * Target panel: AntD Tree with virtual scroll, fixed height. Root "All modules" expanded,
 * 120 leaf nodes Module 001..120. Module 003 checked by default. Target offscreen.
 * Success: committed checked = exactly {modules/084, modules/085}, "Apply sync set" clicked.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Tree, Button, Typography, Tag, Space } from 'antd';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text, Title } = Typography;

function pad(n: number): string {
  return String(n).padStart(3, '0');
}

function buildModuleTree(): TreeDataNode[] {
  const children: TreeDataNode[] = [];
  for (let i = 1; i <= 120; i++) {
    children.push({ title: `Module ${pad(i)}`, key: `modules/${pad(i)}`, isLeaf: true });
  }
  return [{ title: 'All modules', key: 'modules', children }];
}

const treeData = buildModuleTree();
const TARGET_CHECKED = ['modules/084', 'modules/085'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [expandedKeys] = useState<React.Key[]>(['modules']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['modules/003']);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const leafChecked = (checkedKeys as string[]).filter((k) => k.startsWith('modules/') && k !== 'modules');
    if (committed && setsEqual(leafChecked, TARGET_CHECKED)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, checkedKeys, onSuccess]);

  const handleApply = () => setCommitted(true);

  return (
    <div style={{ padding: 16, maxWidth: 780, height: '100vh', overflow: 'auto' }}>
      <Title level={4}>Deployment Console</Title>

      <Card size="small" style={{ marginBottom: 12 }}>
        <Space><Tag color="green">v3.12.1</Tag><Text type="secondary">Released 2026-03-15</Text></Space>
      </Card>
      <Card size="small" style={{ marginBottom: 12 }}>
        <Text>Release notes: Performance improvements and bug fixes for telemetry pipeline.</Text>
      </Card>
      <Card size="small" style={{ marginBottom: 12 }}>
        <Space><Tag>Action</Tag><Text type="secondary">Re-deploy staging</Text><Button size="small" disabled>Run</Button></Space>
      </Card>

      <Card title="Sync modules" size="small">
        <div style={{ height: 320, overflow: 'hidden' }}>
          <Tree
            treeData={treeData}
            expandedKeys={expandedKeys}
            checkedKeys={checkedKeys}
            onCheck={(checked) => {
              const keys = Array.isArray(checked) ? checked : checked.checked;
              setCheckedKeys(keys);
              setCommitted(false);
            }}
            checkable
            checkStrictly
            selectable={false}
            virtual
            height={320}
            data-testid="tree-root"
          />
        </div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #303030', paddingTop: 12 }}>
          <Button size="small" onClick={() => { setCheckedKeys([]); setCommitted(false); }}>Reset</Button>
          <Button type="primary" size="small" onClick={handleApply}>Apply sync set</Button>
        </div>
      </Card>
    </div>
  );
}
