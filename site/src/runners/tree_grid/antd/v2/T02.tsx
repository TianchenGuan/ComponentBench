'use client';

/**
 * tree_grid-antd-v2-T02: Blocked-owner filter plus exact target row with explicit OK
 *
 * Tree grid with Status and Owner column filter dropdowns (each with OK/Reset).
 * Apply Status=Blocked AND Owner=Priya Singh, select Finance → Invoicing, click "Use row".
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Table, Typography, Button, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const { Text } = Typography;

interface CatalogRow {
  key: string;
  service: string;
  owner: string;
  status: string;
  children?: CatalogRow[];
}

const DATA: CatalogRow[] = [
  {
    key: 'finance', service: 'Finance', owner: 'Eve Wilson', status: 'Active',
    children: [
      { key: 'finance/billing', service: 'Billing', owner: 'Frank Brown', status: 'Active' },
      { key: 'finance/invoicing', service: 'Invoicing', owner: 'Priya Singh', status: 'Blocked' },
      { key: 'finance/payments', service: 'Payments', owner: 'Henry Martinez', status: 'Blocked' },
    ],
  },
  {
    key: 'platform', service: 'Platform', owner: 'Alice Chen', status: 'Active',
    children: [
      { key: 'platform/api-gateway', service: 'API Gateway', owner: 'Priya Singh', status: 'Active' },
      { key: 'platform/auth-service', service: 'Auth Service', owner: 'Carol Davis', status: 'Blocked' },
    ],
  },
];

function getPath(rows: CatalogRow[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.service];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.service, ...p]; }
  }
  return [];
}

function flatRows(rows: CatalogRow[]): CatalogRow[] {
  const result: CatalogRow[] = [];
  for (const r of rows) {
    result.push(r);
    if (r.children) result.push(...flatRows(r.children));
  }
  return result;
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [ownerFilters, setOwnerFilters] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const allOwners = useMemo(() => Array.from(new Set(flatRows(DATA).map(r => r.owner))), []);
  const allStatuses = useMemo(() => Array.from(new Set(flatRows(DATA).map(r => r.status))), []);

  const selectedPath = selectedKey ? getPath(DATA, selectedKey) : [];

  useEffect(() => {
    if (successFired.current) return;
    if (!saved) return;
    const filtersOk =
      statusFilters.length === 1 && statusFilters[0] === 'Blocked' &&
      ownerFilters.length === 1 && ownerFilters[0] === 'Priya Singh';
    if (filtersOk && pathEquals(selectedPath, ['Finance', 'Invoicing'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, statusFilters, ownerFilters, selectedPath, onSuccess]);

  const filteredData = useMemo(() => {
    if (!statusFilters.length && !ownerFilters.length) return DATA;
    const matchesRow = (r: CatalogRow) => {
      const statusOk = !statusFilters.length || statusFilters.includes(r.status);
      const ownerOk = !ownerFilters.length || ownerFilters.includes(r.owner);
      return statusOk && ownerOk;
    };
    const filterTree = (rows: CatalogRow[]): CatalogRow[] => {
      const result: CatalogRow[] = [];
      for (const r of rows) {
        const filteredChildren = r.children ? filterTree(r.children) : [];
        if (matchesRow(r) || filteredChildren.length > 0) {
          result.push({ ...r, children: filteredChildren.length > 0 ? filteredChildren : undefined });
        }
      }
      return result;
    };
    return filterTree(DATA);
  }, [statusFilters, ownerFilters]);

  const columns: TableColumnsType<CatalogRow> = [
    { title: 'Service', dataIndex: 'service', key: 'service', width: 200 },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 120,
      filters: allStatuses.map(s => ({ text: s, value: s })),
      filteredValue: statusFilters.length ? statusFilters : null,
      filterMultiple: true,
    },
    {
      title: 'Owner', dataIndex: 'owner', key: 'owner', width: 150,
      filters: allOwners.map(o => ({ text: o, value: o })),
      filteredValue: ownerFilters.length ? ownerFilters : null,
      filterMultiple: true,
    },
  ];

  return (
    <Card title="Service Catalog" style={{ width: 600 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Button disabled>Export</Button>
          <Text type="secondary">2 groups, 5 services</Text>
        </Space>
        {selectedKey && <Text strong>Selected: {selectedPath.join(' → ')}</Text>}
        <Table<CatalogRow>
          columns={columns}
          dataSource={filteredData}
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
            type: 'radio',
            selectedRowKeys: selectedKey ? [selectedKey] : [],
            onChange: (keys) => setSelectedKey((keys[0] as string) || null),
            hideSelectAll: true,
          }}
          onRow={(record) => ({ onClick: () => setSelectedKey(record.key) })}
          onChange={(_pagination, filters) => {
            setStatusFilters((filters.status as string[]) || []);
            setOwnerFilters((filters.owner as string[]) || []);
            setExpandedKeys(filteredData.filter(r => r.children?.length).map(r => r.key));
          }}
          data-testid="tree-grid"
        />
        <Button type="primary" block onClick={() => setSaved(true)}>Use row</Button>
      </Space>
    </Card>
  );
}
