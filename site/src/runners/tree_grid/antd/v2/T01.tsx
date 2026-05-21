'use client';

/**
 * tree_grid-antd-v2-T01: Write permissions grid – exact checked descendants in target drawer grid
 *
 * Drawer with two tree grids (Read permissions distractor, Write permissions target).
 * In Write permissions, expand Platform, uncheck pre-checked Logs, check Deployments + Incidents.
 * Click "Save permissions". Success: committed set equals {Platform/Deployments, Platform/Incidents}.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Checkbox, Drawer, Table, Typography, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathSetsEqual } from '../../types';

const { Text } = Typography;

interface PermNode {
  key: string;
  name: string;
  children?: PermNode[];
}

const PERM_TREE: PermNode[] = [
  {
    key: 'platform', name: 'Platform', children: [
      { key: 'platform/deployments', name: 'Deployments' },
      { key: 'platform/incidents', name: 'Incidents' },
      { key: 'platform/logs', name: 'Logs' },
    ],
  },
  {
    key: 'finance', name: 'Finance', children: [
      { key: 'finance/budgets', name: 'Budgets' },
    ],
  },
];

function getPath(rows: PermNode[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.name];
    if (r.children) {
      const p = getPath(r.children, key);
      if (p.length) return [r.name, ...p];
    }
  }
  return [];
}

function PermGrid({
  title, data, checkedKeys, onCheckedChange, expandedKeys, onExpandedChange,
}: {
  title: string;
  data: PermNode[];
  checkedKeys: Set<string>;
  onCheckedChange: (keys: Set<string>) => void;
  expandedKeys: React.Key[];
  onExpandedChange: (keys: React.Key[]) => void;
}) {
  const cols: TableColumnsType<PermNode> = [
    { title: 'Permission', dataIndex: 'name', key: 'name', width: 250 },
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>{title}</Text>
      <Table<PermNode>
        columns={cols}
        dataSource={data}
        rowKey="key"
        pagination={false}
        size="small"
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpand: (expanded, record) => {
            onExpandedChange(expanded
              ? [...expandedKeys, record.key]
              : expandedKeys.filter(k => k !== record.key));
          },
        }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: Array.from(checkedKeys),
          onChange: (keys) => onCheckedChange(new Set(keys as string[])),
          hideSelectAll: true,
        }}
        data-testid={`perm-grid-${title.toLowerCase().replace(/\s+/g, '-')}`}
      />
    </div>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [readChecked, setReadChecked] = useState<Set<string>>(new Set());
  const [writeChecked, setWriteChecked] = useState<Set<string>>(new Set(['platform/logs']));
  const [readExpanded, setReadExpanded] = useState<React.Key[]>([]);
  const [writeExpanded, setWriteExpanded] = useState<React.Key[]>([]);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!saved) return;
    const paths = Array.from(writeChecked).map(k => getPath(PERM_TREE, k));
    if (pathSetsEqual(paths, [['Platform', 'Deployments'], ['Platform', 'Incidents']])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, writeChecked, onSuccess]);

  return (
    <Card title="Role Manager" style={{ width: 500 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text type="secondary">Manage role permissions using the Edit role drawer.</Text>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Card size="small" style={{ flex: 1, minWidth: 150 }}><Text type="secondary">Audit log: 12 entries</Text></Card>
          <Card size="small" style={{ flex: 1, minWidth: 150 }}><Text type="secondary">Last reviewed: Jan 15</Text></Card>
        </div>
        <Button type="primary" onClick={() => setDrawerOpen(true)}>Edit role</Button>
      </Space>
      <Drawer
        title="Edit role"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={480}
        footer={
          <Button type="primary" block onClick={() => { setSaved(true); }}>
            Save permissions
          </Button>
        }
      >
        <PermGrid
          title="Read permissions"
          data={PERM_TREE}
          checkedKeys={readChecked}
          onCheckedChange={setReadChecked}
          expandedKeys={readExpanded}
          onExpandedChange={setReadExpanded}
        />
        <PermGrid
          title="Write permissions"
          data={PERM_TREE}
          checkedKeys={writeChecked}
          onCheckedChange={setWriteChecked}
          expandedKeys={writeExpanded}
          onExpandedChange={setWriteExpanded}
        />
      </Drawer>
    </Card>
  );
}
