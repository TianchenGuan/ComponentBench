'use client';

/**
 * tree_grid-antd-v2-T08: Deep branch plus horizontal edit – far-right owner cell commit
 *
 * "Operations ownership" tree grid with horizontal scroll. First column is hierarchy;
 * far-right columns include Budget, Region, Owner (editable). Expand Operations → Data Centers → US-East,
 * scroll to Rack 18, scroll horizontally to Owner, change to "infra-east", commit, click "Save ownership".
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, Table, Typography, Button, Input } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const { Text } = Typography;

interface OwnerRow {
  key: string;
  service: string;
  budget: string;
  region: string;
  owner: string;
  children?: OwnerRow[];
}

function buildTree(): OwnerRow[] {
  const racks: OwnerRow[] = Array.from({ length: 20 }, (_, i) => ({
    key: `ops/dc/us-east/rack-${i + 1}`,
    service: `Rack ${i + 1}`,
    budget: `$${(5000 + i * 500).toLocaleString()}`,
    region: 'US-East',
    owner: `tech-${i + 1}`,
  }));
  return [{
    key: 'ops', service: 'Operations', budget: '$500,000', region: '-', owner: 'ops-lead',
    children: [{
      key: 'ops/dc', service: 'Data Centers', budget: '$300,000', region: '-', owner: 'dc-lead',
      children: [{
        key: 'ops/dc/us-east', service: 'US-East', budget: '$150,000', region: 'US-East', owner: 'east-lead',
        children: racks,
      }],
    }],
  }];
}

function getPath(rows: OwnerRow[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.service];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.service, ...p]; }
  }
  return [];
}

function findNode(rows: OwnerRow[], key: string): OwnerRow | null {
  for (const r of rows) {
    if (r.key === key) return r;
    if (r.children) { const f = findNode(r.children, key); if (f) return f; }
  }
  return null;
}

function updateOwner(rows: OwnerRow[], key: string, owner: string): OwnerRow[] {
  return rows.map(r => {
    if (r.key === key) return { ...r, owner };
    if (r.children) return { ...r, children: updateOwner(r.children, key, owner) };
    return r;
  });
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState(buildTree);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const commitEdit = useCallback(() => {
    if (editingKey) {
      setData(prev => updateOwner(prev, editingKey, editValue));
      setEditingKey(null);
      setEditValue('');
    }
  }, [editingKey, editValue]);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const node = findNode(data, 'ops/dc/us-east/rack-18');
    if (node && node.owner === 'infra-east') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, data, onSuccess]);

  const columns: TableColumnsType<OwnerRow> = [
    { title: 'Service', dataIndex: 'service', key: 'service', width: 200, fixed: 'left' },
    { title: 'Budget', dataIndex: 'budget', key: 'budget', width: 120 },
    { title: 'Region', dataIndex: 'region', key: 'region', width: 120 },
    {
      title: 'Owner', dataIndex: 'owner', key: 'owner', width: 160,
      render: (val: string, record: OwnerRow) => {
        if (editingKey === record.key) {
          return (
            <Input
              autoFocus
              size="small"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onPressEnter={commitEdit}
              onBlur={commitEdit}
              style={{ width: 140 }}
            />
          );
        }
        return (
          <span
            style={{ cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); setEditingKey(record.key); setEditValue(val); }}
          >
            {val}
          </span>
        );
      },
    },
  ];

  return (
    <Card title="Operations ownership" style={{ width: 480 }} size="small">
      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Scroll horizontally to find the Owner column.
      </Text>
      <div style={{ maxHeight: 350, overflow: 'auto' }}>
        <Table<OwnerRow>
          columns={columns}
          dataSource={data}
          rowKey="key"
          pagination={false}
          size="small"
          scroll={{ x: 700 }}
          expandable={{
            expandedRowKeys: expandedKeys,
            onExpand: (expanded, record) => {
              setExpandedKeys(expanded
                ? [...expandedKeys, record.key]
                : expandedKeys.filter(k => k !== record.key));
            },
          }}
          data-testid="tree-grid"
        />
      </div>
      <Button type="primary" block style={{ marginTop: 8 }} onClick={() => setSaved(true)}>
        Save ownership
      </Button>
    </Card>
  );
}
