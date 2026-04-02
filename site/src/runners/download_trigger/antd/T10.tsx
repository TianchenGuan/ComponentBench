'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, Input, DatePicker, Select, message, Tooltip, Space } from 'antd';
import { DownloadOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const blobUrlRef = useRef<Record<string, string>>({});

  useEffect(() => {
    blobUrlRef.current = {
      north: createMockBlobUrl('north-region-sales.csv', 'Region,Sales,Date'),
      south: createMockBlobUrl('south-region-sales.csv', 'Region,Sales,Date'),
      east: createMockBlobUrl('east-region-sales.csv', 'Region,Sales,Date'),
      west: createMockBlobUrl('west-region-sales.csv', 'Region,Sales,Date'),
    };
    return () => { Object.values(blobUrlRef.current).forEach(url => URL.revokeObjectURL(url)); };
  }, []);

  const handleDownload = (region: string) => {
    if (region === 'north' && !completed) {
      message.success('Download started: north-region-sales.csv');
      setCompleted(true);
      onSuccess();
    } else if (region !== 'north') {
      message.info(`Downloaded ${region} region data`);
    }
  };

  const data = [
    { key: 'north', region: 'North region', lastUpdated: '2026-01-15', owner: 'Alice' },
    { key: 'south', region: 'South region', lastUpdated: '2026-01-14', owner: 'Bob' },
    { key: 'east', region: 'East region', lastUpdated: '2026-01-13', owner: 'Carol' },
    { key: 'west', region: 'West region', lastUpdated: '2026-01-12', owner: 'Dave' },
  ];

  const columns = [
    { title: 'Region', dataIndex: 'region', key: 'region' },
    { title: 'Last updated', dataIndex: 'lastUpdated', key: 'lastUpdated' },
    { title: 'Owner', dataIndex: 'owner', key: 'owner' },
    { title: 'Actions', key: 'actions', render: (_: unknown, record: typeof data[0]) => (
      <Space size="small">
        <Tooltip title="View"><Button size="small" icon={<EyeOutlined />} /></Tooltip>
        <Tooltip title="Download">
          <Button size="small" icon={<DownloadOutlined />} onClick={(e) => { e.preventDefault(); handleDownload(record.key); }} data-testid={`download-${record.key}`} />
        </Tooltip>
      </Space>
    )},
  ];

  return (
    <Card title="Regional sales" style={{ width: 700 }} size="small">
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Select defaultValue="all" style={{ width: 120 }} options={[{ value: 'all', label: 'All regions' }]} />
          <DatePicker.RangePicker size="small" />
          <Button icon={<ReloadOutlined />} size="small">Refresh</Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} size="small" />
    </Card>
  );
}
