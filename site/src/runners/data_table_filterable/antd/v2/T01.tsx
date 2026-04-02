'use client';

/**
 * data_table_filterable-antd-v2-T01: Dashboard approvals – filter Orders, not Returns
 *
 * Two AntD tables ("Orders" and "Returns") in a compact dashboard_panel with KPI chips and clutter.
 * Target: Orders only – set Status=Escalated AND Region=APAC via the column-header funnel dropdowns,
 * clicking OK in each. Returns must remain unfiltered.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Tag, Space } from 'antd';
import type { ColumnsType, FilterValue, TablePaginationConfig } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../../types';

interface RowData {
  key: string;
  id: string;
  customer: string;
  status: string;
  region: string;
  amount: number;
}

const statusOptions = ['Pending', 'Approved', 'Escalated', 'Rejected', 'On Hold', 'Cancelled'];
const regionOptions = ['NA', 'EMEA', 'APAC', 'LATAM'];

const ordersData: RowData[] = [
  { key: 'o1', id: 'ORD-2001', customer: 'Aria Park', status: 'Pending', region: 'NA', amount: 420 },
  { key: 'o2', id: 'ORD-2002', customer: 'Ben Torres', status: 'Escalated', region: 'APAC', amount: 870 },
  { key: 'o3', id: 'ORD-2003', customer: 'Clara Xu', status: 'Approved', region: 'EMEA', amount: 310 },
  { key: 'o4', id: 'ORD-2004', customer: 'Derek Roy', status: 'Escalated', region: 'LATAM', amount: 560 },
  { key: 'o5', id: 'ORD-2005', customer: 'Elaine Wu', status: 'On Hold', region: 'APAC', amount: 190 },
  { key: 'o6', id: 'ORD-2006', customer: 'Felix Cho', status: 'Escalated', region: 'APAC', amount: 740 },
  { key: 'o7', id: 'ORD-2007', customer: 'Gina Voss', status: 'Rejected', region: 'NA', amount: 1100 },
  { key: 'o8', id: 'ORD-2008', customer: 'Hugo Lam', status: 'Cancelled', region: 'EMEA', amount: 250 },
];

const returnsData: RowData[] = [
  { key: 'r1', id: 'RET-3001', customer: 'Ivy Dunn', status: 'Pending', region: 'NA', amount: 110 },
  { key: 'r2', id: 'RET-3002', customer: 'Jake Soto', status: 'Escalated', region: 'APAC', amount: 55 },
  { key: 'r3', id: 'RET-3003', customer: 'Kim Lee', status: 'Approved', region: 'LATAM', amount: 200 },
  { key: 'r4', id: 'RET-3004', customer: 'Leo Grant', status: 'Rejected', region: 'EMEA', amount: 320 },
  { key: 'r5', id: 'RET-3005', customer: 'Mia Ford', status: 'Pending', region: 'APAC', amount: 80 },
];

function buildFilterModel(tableId: string, info: Record<string, FilterValue | null>): FilterModel {
  return {
    table_id: tableId,
    logic_operator: 'AND',
    global_filter: null,
    column_filters: Object.entries(info)
      .filter(([, v]) => v && v.length > 0)
      .map(([col, values]) => ({
        column: col.charAt(0).toUpperCase() + col.slice(1),
        operator: (values?.length ?? 0) > 1 ? 'in' : ('equals' as const),
        value: values?.length === 1 ? String(values[0]) : (values as string[]),
      })),
  };
}

function makeColumns(
  filteredInfo: Record<string, FilterValue | null>,
): ColumnsType<RowData> {
  return [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 110 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 130 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      filters: statusOptions.map(s => ({ text: s, value: s })),
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
      filterMultiple: false,
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      width: 100,
      filters: regionOptions.map(r => ({ text: r, value: r })),
      filteredValue: filteredInfo.region || null,
      onFilter: (value, record) => record.region === value,
      filterMultiple: false,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 90,
      render: (v: number) => `$${v.toFixed(2)}`,
    },
  ];
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [ordersFilter, setOrdersFilter] = useState<Record<string, FilterValue | null>>({});
  const [returnsFilter, setReturnsFilter] = useState<Record<string, FilterValue | null>>({});
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;
    const s = ordersFilter.status;
    const r = ordersFilter.region;
    const retHasFilter = Object.values(returnsFilter).some(v => v && v.length > 0);
    if (
      s && s.length === 1 && s[0] === 'Escalated' &&
      r && r.length === 1 && r[0] === 'APAC' &&
      !retHasFilter
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [ordersFilter, returnsFilter, onSuccess]);

  const kpis = [
    { label: 'Total Orders', value: '1,247' },
    { label: 'Open Escalations', value: '38' },
    { label: 'Avg Resolution', value: '2.1 d' },
  ];

  return (
    <div style={{ width: 980, padding: 16, background: '#f5f5f5' }}>
      <Space style={{ marginBottom: 12 }}>
        {kpis.map(k => (
          <Tag key={k.label} color="blue" style={{ fontSize: 12, padding: '2px 8px' }}>
            {k.label}: {k.value}
          </Tag>
        ))}
      </Space>

      <Card size="small" title="Orders" style={{ marginBottom: 12 }}>
        <Table<RowData>
          dataSource={ordersData}
          columns={makeColumns(ordersFilter)}
          pagination={false}
          size="small"
          rowKey="key"
          onChange={(_p: TablePaginationConfig, f: Record<string, FilterValue | null>) => setOrdersFilter(f)}
          data-testid="table-orders"
          data-filter-model={JSON.stringify(buildFilterModel('orders', ordersFilter))}
        />
      </Card>

      <Card size="small" title="Returns">
        <Table<RowData>
          dataSource={returnsData}
          columns={makeColumns(returnsFilter)}
          pagination={false}
          size="small"
          rowKey="key"
          onChange={(_p: TablePaginationConfig, f: Record<string, FilterValue | null>) => setReturnsFilter(f)}
          data-testid="table-returns"
          data-filter-model={JSON.stringify(buildFilterModel('returns', returnsFilter))}
        />
      </Card>
    </div>
  );
}
