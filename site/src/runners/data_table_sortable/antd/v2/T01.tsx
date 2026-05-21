'use client';

/**
 * data_table_sortable-antd-v2-T01: Renewals board – scroll to hidden Renewal % and sort descending
 *
 * A compact nested_scroll panel with one wide Ant Design table titled "Renewals".
 * The first column is fixed on the left; Renewal % sits near the far right, off-screen.
 * The table's own horizontal scroll region must be used before the sortable header can be clicked.
 * A small summary strip and an inactive export button add medium clutter.
 *
 * Success: Renewal % sorted descending (one key only).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Button, Typography, Space, Tag } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../../types';

const { Text } = Typography;

interface RenewalRow {
  key: string;
  account: string;
  owner: string;
  plan: string;
  seats: number;
  arr: number;
  startDate: string;
  endDate: string;
  status: string;
  healthScore: number;
  renewalPct: number;
}

const data: RenewalRow[] = [
  { key: '1', account: 'Acme Corp', owner: 'Li Wei', plan: 'Enterprise', seats: 120, arr: 48000, startDate: '2023-01-15', endDate: '2024-01-15', status: 'Active', healthScore: 88, renewalPct: 92 },
  { key: '2', account: 'TechStart', owner: 'Maria G.', plan: 'Pro', seats: 30, arr: 9600, startDate: '2023-03-01', endDate: '2024-03-01', status: 'Active', healthScore: 72, renewalPct: 78 },
  { key: '3', account: 'GlobalSys', owner: 'James K.', plan: 'Enterprise', seats: 250, arr: 100000, startDate: '2023-06-10', endDate: '2024-06-10', status: 'At risk', healthScore: 55, renewalPct: 45 },
  { key: '4', account: 'DataFlow', owner: 'Chen Y.', plan: 'Starter', seats: 10, arr: 2400, startDate: '2023-02-20', endDate: '2024-02-20', status: 'Active', healthScore: 90, renewalPct: 95 },
  { key: '5', account: 'CloudNet', owner: 'Aisha B.', plan: 'Pro', seats: 55, arr: 17600, startDate: '2023-04-05', endDate: '2024-04-05', status: 'Active', healthScore: 81, renewalPct: 85 },
  { key: '6', account: 'InnoLabs', owner: 'David M.', plan: 'Enterprise', seats: 180, arr: 72000, startDate: '2023-07-01', endDate: '2024-07-01', status: 'Churned', healthScore: 30, renewalPct: 12 },
  { key: '7', account: 'QuickShip', owner: 'Sara T.', plan: 'Starter', seats: 8, arr: 1920, startDate: '2023-05-15', endDate: '2024-05-15', status: 'Active', healthScore: 68, renewalPct: 65 },
  { key: '8', account: 'FinHub', owner: 'Raj P.', plan: 'Pro', seats: 40, arr: 12800, startDate: '2023-08-01', endDate: '2024-08-01', status: 'Active', healthScore: 93, renewalPct: 97 },
  { key: '9', account: 'MarketPro', owner: 'Li Wei', plan: 'Enterprise', seats: 300, arr: 120000, startDate: '2023-09-10', endDate: '2024-09-10', status: 'Active', healthScore: 76, renewalPct: 80 },
  { key: '10', account: 'DesignWk', owner: 'Maria G.', plan: 'Starter', seats: 5, arr: 1200, startDate: '2023-11-01', endDate: '2024-11-01', status: 'At risk', healthScore: 42, renewalPct: 35 },
  { key: '11', account: 'SecureIT', owner: 'James K.', plan: 'Pro', seats: 65, arr: 20800, startDate: '2023-10-15', endDate: '2024-10-15', status: 'Active', healthScore: 85, renewalPct: 88 },
  { key: '12', account: 'BuildRight', owner: 'Chen Y.', plan: 'Enterprise', seats: 200, arr: 80000, startDate: '2023-12-01', endDate: '2024-12-01', status: 'Active', healthScore: 61, renewalPct: 58 },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [sortedInfo, setSortedInfo] = useState<SorterResult<RenewalRow>>({});
  const successFired = useRef(false);

  const columns: ColumnsType<RenewalRow> = [
    { title: 'Account', dataIndex: 'account', key: 'account', fixed: 'left', width: 120 },
    { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 100 },
    { title: 'Plan', dataIndex: 'plan', key: 'plan', width: 100 },
    { title: 'Seats', dataIndex: 'seats', key: 'seats', width: 80 },
    { title: 'ARR', dataIndex: 'arr', key: 'arr', width: 100, render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Start date', dataIndex: 'startDate', key: 'startDate', width: 110 },
    { title: 'End date', dataIndex: 'endDate', key: 'endDate', width: 110 },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 100,
      render: (v: string) => <Tag color={v === 'Active' ? 'green' : v === 'At risk' ? 'orange' : 'red'}>{v}</Tag>,
    },
    { title: 'Health score', dataIndex: 'healthScore', key: 'healthScore', width: 110, sorter: (a, b) => a.healthScore - b.healthScore, sortOrder: sortedInfo.columnKey === 'healthScore' ? sortedInfo.order : null },
    {
      title: 'Renewal %', dataIndex: 'renewalPct', key: 'renewal_pct', width: 110,
      sorter: (a, b) => a.renewalPct - b.renewalPct,
      sortOrder: sortedInfo.columnKey === 'renewal_pct' ? sortedInfo.order : null,
      render: (v: number) => `${v}%`,
    },
  ];

  const handleChange = (_p: unknown, _f: unknown, sorter: SorterResult<RenewalRow> | SorterResult<RenewalRow>[]) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo(s || {});
  };

  useEffect(() => {
    if (successFired.current) return;
    if (sortedInfo.columnKey === 'renewal_pct' && sortedInfo.order === 'descend') {
      successFired.current = true;
      onSuccess();
    }
  }, [sortedInfo, onSuccess]);

  const sortModel: SortModel = sortedInfo.columnKey && sortedInfo.order
    ? [{ column_key: String(sortedInfo.columnKey), direction: sortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <div style={{ position: 'absolute', bottom: 24, right: 24, width: 700 }}>
      <Card size="small">
        <Space style={{ marginBottom: 8, width: '100%', justifyContent: 'space-between' }}>
          <Text strong>Renewals</Text>
          <Space size="small">
            <Text type="secondary" style={{ fontSize: 12 }}>12 accounts · $486k ARR</Text>
            <Button size="small" icon={<ExportOutlined />} disabled>Export</Button>
          </Space>
        </Space>

        <Table<RenewalRow>
          dataSource={data}
          columns={columns}
          pagination={false}
          size="small"
          rowKey="key"
          onChange={handleChange}
          scroll={{ x: 1200 }}
          data-testid="table-renewals"
          data-sort-model={JSON.stringify(sortModel)}
        />
      </Card>
    </div>
  );
}
