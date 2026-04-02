'use client';

/**
 * tree_grid-antd-v2-T06: Reference preview and exact row in the lower archived grid
 *
 * Two stacked grids: "Active Projects" (top, already has Platform → Auth Service selected)
 * and "Archived Projects" (bottom). Reference card shows Marketing → Campaigns → Q2 Launch.
 * Select that path in Archived Projects and click "Use row".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography, Button, Space, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps, TreeGridRow } from '../../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathEquals } from '../../types';

const { Text } = Typography;

const columns: TableColumnsType<TreeGridRow> = [
  { title: 'Service', dataIndex: 'service', key: 'service', width: 200 },
  { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 120 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 80 },
];

function TreeGrid({ title, data, selectedKey, onSelect, expandedKeys, onExpandedChange, footer }: {
  title: string;
  data: TreeGridRow[];
  selectedKey: string | null;
  onSelect: (k: string) => void;
  expandedKeys: React.Key[];
  onExpandedChange: (k: React.Key[]) => void;
  footer?: React.ReactNode;
}) {
  return (
    <Card size="small" title={title} style={{ width: '100%' }}>
      <Table<TreeGridRow>
        columns={columns}
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
          type: 'radio',
          selectedRowKeys: selectedKey ? [selectedKey] : [],
          onChange: (keys) => onSelect(keys[0] as string),
          hideSelectAll: true,
        }}
        onRow={(record) => ({ onClick: () => onSelect(record.key) })}
      />
      {footer && <div style={{ marginTop: 8 }}>{footer}</div>}
    </Card>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string | null>('platform/auth-service');
  const [archivedKey, setArchivedKey] = useState<string | null>(null);
  const [activeExpanded, setActiveExpanded] = useState<React.Key[]>([]);
  const [archivedExpanded, setArchivedExpanded] = useState<React.Key[]>([]);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const archivedPath = archivedKey ? getRowPath(SERVICE_CATALOG_DATA, archivedKey) : [];

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (pathEquals(archivedPath, ['Marketing', 'Campaigns', 'Q2 Launch'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, archivedPath, onSuccess]);

  return (
    <Space direction="vertical" style={{ width: 580 }}>
      <Card size="small">
        <Text strong>Reference: </Text>
        <Tag color="blue">Marketing</Tag>
        <Tag color="blue">Campaigns</Tag>
        <Tag color="blue">Q2 Launch</Tag>
      </Card>
      <TreeGrid
        title="Active Projects"
        data={SERVICE_CATALOG_DATA}
        selectedKey={activeKey}
        onSelect={setActiveKey}
        expandedKeys={activeExpanded}
        onExpandedChange={setActiveExpanded}
      />
      <TreeGrid
        title="Archived Projects"
        data={SERVICE_CATALOG_DATA}
        selectedKey={archivedKey}
        onSelect={setArchivedKey}
        expandedKeys={archivedExpanded}
        onExpandedChange={setArchivedExpanded}
        footer={<Button type="primary" block onClick={() => setSaved(true)}>Use row</Button>}
      />
    </Space>
  );
}
