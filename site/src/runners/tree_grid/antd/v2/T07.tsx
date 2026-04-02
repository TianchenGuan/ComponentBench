'use client';

/**
 * tree_grid-antd-v2-T07: Exact descendant checkbox set with row-highlight distractor
 *
 * "Incident map" tree grid. Expand Platform, check ONLY API Gateway and Queues via
 * the checkbox column (not row highlight). Click "Apply incident subset".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography, Button, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathSetsEqual } from '../../types';

const { Text } = Typography;

interface IncidentNode {
  key: string;
  name: string;
  children?: IncidentNode[];
}

const DATA: IncidentNode[] = [
  {
    key: 'platform', name: 'Platform',
    children: [
      { key: 'platform/api-gateway', name: 'API Gateway' },
      { key: 'platform/auth-service', name: 'Auth Service' },
      { key: 'platform/queues', name: 'Queues' },
    ],
  },
  {
    key: 'finance', name: 'Finance',
    children: [
      { key: 'finance/billing', name: 'Billing' },
    ],
  },
];

function getPath(rows: IncidentNode[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.name];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.name, ...p]; }
  }
  return [];
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const paths = (checkedKeys as string[]).map(k => getPath(DATA, k));
    if (pathSetsEqual(paths, [['Platform', 'API Gateway'], ['Platform', 'Queues']])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, checkedKeys, onSuccess]);

  const columns: TableColumnsType<IncidentNode> = [
    { title: 'Service', dataIndex: 'name', key: 'name', width: 250 },
  ];

  return (
    <Space direction="horizontal" size="middle">
      <Card title="Incident map" style={{ width: 400 }} size="small">
        <Table<IncidentNode>
          columns={columns}
          dataSource={DATA}
          rowKey="key"
          pagination={false}
          size="small"
          expandable={{
            expandedRowKeys: expandedKeys,
            onExpand: (expanded, record) => {
              setExpandedKeys(expanded
                ? [...expandedKeys, record.key]
                : expandedKeys.filter(k => k !== record.key));
            },
          }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: checkedKeys,
            onChange: (keys) => setCheckedKeys(keys),
            hideSelectAll: true,
          }}
          onRow={(record) => ({
            onClick: () => setHighlightedKey(record.key),
            style: { backgroundColor: highlightedKey === record.key ? '#e6f7ff' : undefined },
          })}
          data-testid="tree-grid"
        />
        <Button type="primary" block style={{ marginTop: 8 }} onClick={() => setSaved(true)}>
          Apply incident subset
        </Button>
      </Card>
      <Card style={{ width: 220, minHeight: 200 }} size="small" title="Details">
        <Text type="secondary">
          {highlightedKey
            ? `Highlighted: ${getPath(DATA, highlightedKey).join(' → ')}`
            : 'Click a row to preview details'}
        </Text>
      </Card>
    </Space>
  );
}
