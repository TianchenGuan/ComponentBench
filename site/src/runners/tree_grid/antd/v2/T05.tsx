'use client';

/**
 * tree_grid-antd-v2-T05: Reset view exactly – clear filters, selection, sort, and expansions
 *
 * Initial state: selected rows (Auth Service, Billing), Owner filter: Priya Singh,
 * sort: Last updated desc, expanded: Platform and Finance.
 * Clear everything and click "Apply view".
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Table, Typography, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FilterValue, SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import type { TaskComponentProps, TreeGridRow } from '../../types';
import { SERVICE_CATALOG_DATA } from '../../types';

const { Text } = Typography;

function flatRows(rows: TreeGridRow[]): TreeGridRow[] {
  const result: TreeGridRow[] = [];
  for (const r of rows) { result.push(r); if (r.children) result.push(...flatRows(r.children)); }
  return result;
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const allOwners = useMemo(() => Array.from(new Set(flatRows(SERVICE_CATALOG_DATA).map(r => r.owner))), []);

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['platform', 'finance']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['platform/auth-service', 'finance/billing']);
  const [ownerFilters, setOwnerFilters] = useState<string[]>(['Priya Singh']);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>('descend');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const clean =
      selectedKeys.length === 0 &&
      ownerFilters.length === 0 &&
      sortOrder === null &&
      expandedKeys.length === 0;
    if (clean) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, selectedKeys, ownerFilters, sortOrder, expandedKeys, onSuccess]);

  const columns: ColumnsType<TreeGridRow> = [
    { title: 'Service', dataIndex: 'service', key: 'service', width: 200 },
    {
      title: 'Owner', dataIndex: 'owner', key: 'owner', width: 150,
      filters: allOwners.map(o => ({ text: o, value: o })),
      filteredValue: ownerFilters.length ? ownerFilters : null,
      onFilter: (val, rec) => rec.owner === val,
    },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100 },
    {
      title: 'Last updated', dataIndex: 'lastUpdated', key: 'lastUpdated', width: 130,
      sorter: (a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
      sortOrder: sortOrder,
    },
  ];

  return (
    <Card title="Service Catalog" style={{ width: 700 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space wrap>
          <Card size="small"><Text type="secondary">Dashboard widget A</Text></Card>
          <Card size="small"><Text type="secondary">Dashboard widget B</Text></Card>
        </Space>
        <Text type="secondary">
          Reset the grid to default: no selection, no filters, no sort, all collapsed.
        </Text>
        <Table<TreeGridRow>
          columns={columns}
          dataSource={SERVICE_CATALOG_DATA}
          rowKey="key"
          pagination={false}
          size="small"
          expandable={{
            expandedRowKeys: expandedKeys,
            onExpand: (expanded: boolean, record: TreeGridRow) => {
              setExpandedKeys(expanded
                ? [...expandedKeys, record.key]
                : expandedKeys.filter(k => k !== record.key));
            },
          }}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: (keys) => setSelectedKeys(keys),
          }}
          onChange={(
            _pag: TablePaginationConfig,
            filters: Record<string, FilterValue | null>,
            sorter: SorterResult<TreeGridRow> | SorterResult<TreeGridRow>[],
          ) => {
            setOwnerFilters((filters.owner as string[]) || []);
            const s = Array.isArray(sorter) ? sorter[0] : sorter;
            setSortOrder(s?.order ?? null);
          }}
          data-testid="tree-grid"
        />
        <Button type="primary" block onClick={() => setSaved(true)}>Apply view</Button>
      </Space>
    </Card>
  );
}
