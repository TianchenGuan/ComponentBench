'use client';

/**
 * data_table_sortable-antd-v2-T05: Deployments drawer – hidden Rollback ETA ascending
 *
 * Clicking "Deployments" opens a bottom Drawer containing a wide AntD table with many
 * operational columns. The leftmost identifier column is fixed. Rollback ETA sits near
 * the far right and is not visible on open. A short legend and a non-functional refresh
 * icon fill the drawer header area.
 *
 * Success: Rollback ETA sorted ascending (one key only).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Button, Drawer, Typography, Space, Tag } from 'antd';
import { ReloadOutlined, RocketOutlined } from '@ant-design/icons';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../../types';

const { Text } = Typography;

interface DeployRow {
  key: string;
  deployId: string;
  service: string;
  version: string;
  env: string;
  status: string;
  startedAt: string;
  duration: string;
  cpu: string;
  memory: string;
  replicas: number;
  updated: string;
  rollbackEta: string;
}

const data: DeployRow[] = [
  { key: '1', deployId: 'DEP-001', service: 'api-gateway', version: 'v2.4.1', env: 'prod', status: 'Running', startedAt: '2024-02-15 06:00', duration: '4m 12s', cpu: '45%', memory: '1.2 GB', replicas: 3, updated: '2024-02-15 08:30', rollbackEta: '2024-02-15 12:00' },
  { key: '2', deployId: 'DEP-002', service: 'auth-svc', version: 'v1.9.0', env: 'prod', status: 'Running', startedAt: '2024-02-15 05:30', duration: '2m 45s', cpu: '22%', memory: '800 MB', replicas: 2, updated: '2024-02-15 07:15', rollbackEta: '2024-02-15 09:30' },
  { key: '3', deployId: 'DEP-003', service: 'data-pipeline', version: 'v3.1.2', env: 'staging', status: 'Deploying', startedAt: '2024-02-15 10:00', duration: '—', cpu: '—', memory: '—', replicas: 1, updated: '2024-02-15 10:05', rollbackEta: '2024-02-15 16:00' },
  { key: '4', deployId: 'DEP-004', service: 'web-frontend', version: 'v5.0.3', env: 'prod', status: 'Running', startedAt: '2024-02-14 22:00', duration: '3m 08s', cpu: '58%', memory: '2.1 GB', replicas: 4, updated: '2024-02-15 09:00', rollbackEta: '2024-02-15 08:00' },
  { key: '5', deployId: 'DEP-005', service: 'notification', version: 'v1.3.7', env: 'prod', status: 'Failed', startedAt: '2024-02-15 07:45', duration: '1m 02s', cpu: '—', memory: '—', replicas: 0, updated: '2024-02-15 07:46', rollbackEta: '2024-02-15 10:00' },
  { key: '6', deployId: 'DEP-006', service: 'search-index', version: 'v2.0.0', env: 'prod', status: 'Running', startedAt: '2024-02-14 18:00', duration: '5m 30s', cpu: '70%', memory: '3.5 GB', replicas: 2, updated: '2024-02-15 06:45', rollbackEta: '2024-02-15 14:00' },
  { key: '7', deployId: 'DEP-007', service: 'billing-svc', version: 'v4.2.1', env: 'staging', status: 'Running', startedAt: '2024-02-15 08:00', duration: '2m 18s', cpu: '30%', memory: '600 MB', replicas: 1, updated: '2024-02-15 08:15', rollbackEta: '2024-02-15 11:00' },
  { key: '8', deployId: 'DEP-008', service: 'ml-inference', version: 'v1.1.0', env: 'prod', status: 'Running', startedAt: '2024-02-14 20:00', duration: '8m 55s', cpu: '90%', memory: '8.0 GB', replicas: 6, updated: '2024-02-15 04:30', rollbackEta: '2024-02-15 07:00' },
];

const statusColor = (s: string) => s === 'Running' ? 'green' : s === 'Deploying' ? 'blue' : 'red';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DeployRow>>({});
  const successFired = useRef(false);

  const columns: ColumnsType<DeployRow> = [
    { title: 'Deploy ID', dataIndex: 'deployId', key: 'deployId', fixed: 'left', width: 100 },
    { title: 'Service', dataIndex: 'service', key: 'service', width: 120 },
    { title: 'Version', dataIndex: 'version', key: 'version', width: 80 },
    { title: 'Env', dataIndex: 'env', key: 'env', width: 80 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (v: string) => <Tag color={statusColor(v)}>{v}</Tag> },
    { title: 'Started at', dataIndex: 'startedAt', key: 'startedAt', width: 140 },
    { title: 'Duration', dataIndex: 'duration', key: 'duration', width: 90 },
    { title: 'CPU', dataIndex: 'cpu', key: 'cpu', width: 70 },
    { title: 'Memory', dataIndex: 'memory', key: 'memory', width: 90 },
    { title: 'Replicas', dataIndex: 'replicas', key: 'replicas', width: 80 },
    { title: 'Updated', dataIndex: 'updated', key: 'updated', width: 140, sorter: (a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime(), sortOrder: sortedInfo.columnKey === 'updated' ? sortedInfo.order : null },
    {
      title: 'Rollback ETA', dataIndex: 'rollbackEta', key: 'rollback_eta', width: 140,
      sorter: (a, b) => new Date(a.rollbackEta).getTime() - new Date(b.rollbackEta).getTime(),
      sortOrder: sortedInfo.columnKey === 'rollback_eta' ? sortedInfo.order : null,
    },
  ];

  const handleChange = (_p: unknown, _f: unknown, sorter: SorterResult<DeployRow> | SorterResult<DeployRow>[]) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo(s || {});
  };

  useEffect(() => {
    if (successFired.current) return;
    if (sortedInfo.columnKey === 'rollback_eta' && sortedInfo.order === 'ascend') {
      successFired.current = true;
      onSuccess();
    }
  }, [sortedInfo, onSuccess]);

  const sortModel: SortModel = sortedInfo.columnKey && sortedInfo.order
    ? [{ column_key: String(sortedInfo.columnKey), direction: sortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <div style={{ padding: 16 }}>
      <Card size="small">
        <Space>
          <Button type="primary" icon={<RocketOutlined />} onClick={() => setDrawerOpen(true)}>Deployments</Button>
          <Text type="secondary">8 active services</Text>
        </Space>
      </Card>

      <Drawer
        title="Deployments"
        placement="bottom"
        height={480}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Space style={{ marginBottom: 8 }}>
          <Tag color="green">Running</Tag>
          <Tag color="blue">Deploying</Tag>
          <Tag color="red">Failed</Tag>
          <Button size="small" icon={<ReloadOutlined />} disabled style={{ marginLeft: 8 }}>Refresh</Button>
        </Space>
        <Table<DeployRow>
          dataSource={data}
          columns={columns}
          pagination={false}
          size="small"
          rowKey="key"
          onChange={handleChange}
          scroll={{ x: 1500 }}
          data-testid="table-deployments"
          data-sort-model={JSON.stringify(sortModel)}
        />
      </Drawer>
    </div>
  );
}
