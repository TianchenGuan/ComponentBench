'use client';

/**
 * select_custom_single-antd-v2-T04: Table row status — set Order A-204 to Delayed
 *
 * Compact dark table near bottom-right. Four rows with the same small Ant Design Select
 * in the "Status" column: A-203, A-204, A-205, A-206. Icon-decorated options:
 * Pending, Shipped, Delayed, Cancelled. A-204 starts at "Shipped".
 * Each row has its own "Save" button. Table header has sortable columns, search box, Export.
 *
 * Success: A-204 Status = "Delayed", row-local Save for A-204 clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Table, Select, Button, Card, Typography, Space, Input, Tag,
} from 'antd';
import {
  ClockCircleOutlined, SendOutlined, WarningOutlined, StopOutlined, SearchOutlined, ExportOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const statusOptions = [
  { value: 'Pending', label: <Space size={4}><ClockCircleOutlined />Pending</Space> },
  { value: 'Shipped', label: <Space size={4}><SendOutlined />Shipped</Space> },
  { value: 'Delayed', label: <Space size={4}><WarningOutlined />Delayed</Space> },
  { value: 'Cancelled', label: <Space size={4}><StopOutlined />Cancelled</Space> },
];

interface OrderRow {
  key: string;
  order: string;
  amount: string;
  defaultStatus: string;
}

const orders: OrderRow[] = [
  { key: 'A-203', order: 'Order A-203', amount: '$312.00', defaultStatus: 'Pending' },
  { key: 'A-204', order: 'Order A-204', amount: '$89.50', defaultStatus: 'Shipped' },
  { key: 'A-205', order: 'Order A-205', amount: '$1,204.00', defaultStatus: 'Pending' },
  { key: 'A-206', order: 'Order A-206', amount: '$45.00', defaultStatus: 'Cancelled' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [statuses, setStatuses] = useState<Record<string, string>>({
    'A-203': 'Pending',
    'A-204': 'Shipped',
    'A-205': 'Pending',
    'A-206': 'Cancelled',
  });
  const [savedRows, setSavedRows] = useState<Record<string, boolean>>({});
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (savedRows['A-204'] && statuses['A-204'] === 'Delayed') {
      successFired.current = true;
      onSuccess();
    }
  }, [savedRows, statuses, onSuccess]);

  const handleStatusChange = (key: string, val: string) => {
    setStatuses((prev) => ({ ...prev, [key]: val }));
    setSavedRows((prev) => ({ ...prev, [key]: false }));
  };

  const handleSaveRow = (key: string) => {
    setSavedRows((prev) => ({ ...prev, [key]: true }));
  };

  const columns = [
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      sorter: true,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', sorter: true },
    {
      title: 'Status',
      key: 'status',
      width: 160,
      render: (_: unknown, record: OrderRow) => (
        <Select
          size="small"
          style={{ width: '100%' }}
          value={statuses[record.key]}
          onChange={(val) => handleStatusChange(record.key, val)}
          options={statusOptions}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      width: 70,
      render: (_: unknown, record: OrderRow) => (
        <Button
          size="small"
          type="primary"
          data-testid={`save-row-${record.key}`}
          onClick={() => handleSaveRow(record.key)}
        >
          Save
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 16, background: '#141414', minHeight: '100vh', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
      <Card
        title={<Title level={5} style={{ margin: 0, color: '#fff' }}>Orders</Title>}
        size="small"
        style={{ width: 560, background: '#1f1f1f', border: '1px solid #303030' }}
        extra={
          <Space size="small">
            <Input prefix={<SearchOutlined />} size="small" placeholder="Search..." style={{ width: 140 }} />
            <Button size="small" icon={<ExportOutlined />}>Export</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={orders}
          pagination={false}
          size="small"
          rowKey="key"
        />
        <div style={{ marginTop: 8 }}>
          <Tag color="blue">Region: US-West</Tag>
          <Text style={{ color: '#666', marginLeft: 8 }}>Last sync: 1m ago</Text>
        </div>
      </Card>
    </div>
  );
}
