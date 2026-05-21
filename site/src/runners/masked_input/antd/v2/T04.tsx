'use client';

/**
 * masked_input-antd-v2-T04: Gateway serial code in compact asset table
 *
 * Compact table_cell layout bottom-right with medium clutter. An AntD Table
 * titled "Asset registry" has rows Gateway (SN-1024-8890) and Billing
 * (SN-5550-1001) with columns Asset, Serial code, Status. Serial code cells
 * are editable masked inputs (SN-####-####) at size="small" with a per-row
 * Save button. Only Gateway should become SN-1024-8896.
 *
 * Success: Gateway serial committed = 'SN-1024-8896' via row Save,
 * Billing row unchanged.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Table, Tag, Space, Typography } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface AssetRow {
  key: string;
  asset: string;
  initialSerial: string;
  status: string;
}

const initialRows: AssetRow[] = [
  { key: 'gateway', asset: 'Gateway', initialSerial: 'SN-1024-8890', status: 'Online' },
  { key: 'billing', asset: 'Billing', initialSerial: 'SN-5550-1001', status: 'Standby' },
];

const inputStyle: React.CSSProperties = {
  width: 130,
  padding: '1px 6px',
  fontSize: 12,
  lineHeight: 1.5,
  border: '1px solid #d9d9d9',
  borderRadius: 4,
  outline: 'none',
  fontFamily: 'monospace',
};

export default function T04({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [drafts, setDrafts] = useState<Record<string, string>>(
    Object.fromEntries(initialRows.map(r => [r.key, r.initialSerial]))
  );
  const [saved, setSaved] = useState<Record<string, string>>(
    Object.fromEntries(initialRows.map(r => [r.key, r.initialSerial]))
  );

  const handleSave = (key: string) => {
    setSaved(prev => ({ ...prev, [key]: drafts[key] }));
  };

  useEffect(() => {
    if (successFired.current) return;
    if (saved.gateway === 'SN-1024-8896' && saved.billing === 'SN-5550-1001') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, onSuccess]);

  const columns = [
    { title: 'Asset', dataIndex: 'asset', key: 'asset', width: 80 },
    {
      title: 'Serial code',
      key: 'serial',
      width: 170,
      render: (_: unknown, record: AssetRow) => (
        <IMaskInput
          mask="SN-0000-0000"
          definitions={{ '0': /[0-9]/ }}
          placeholder="SN-####-####"
          value={drafts[record.key]}
          onAccept={(val: string) => setDrafts(prev => ({ ...prev, [record.key]: val }))}
          data-testid={`serial-${record.key}`}
          style={inputStyle}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 70,
      render: (_: unknown, record: AssetRow) => (
        <Tag color={record.status === 'Online' ? 'green' : 'default'} style={{ fontSize: 11 }}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_: unknown, record: AssetRow) => (
        <Button size="small" type="primary" onClick={() => handleSave(record.key)}>
          Save
        </Button>
      ),
    },
  ];

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, width: 440 }}>
      <Space size="small" style={{ marginBottom: 6 }} wrap>
        <Tag color="blue" style={{ fontSize: 11 }}>Filter: All</Tag>
        <Tag style={{ fontSize: 11 }}>Region: US</Tag>
        <Tag color="orange" style={{ fontSize: 11 }}>3 warnings</Tag>
      </Space>
      <Card title="Asset registry" size="small" styles={{ header: { fontSize: 13 }, body: { padding: 0 } }}>
        <Table
          dataSource={initialRows}
          columns={columns}
          pagination={false}
          size="small"
          rowKey="key"
        />
      </Card>
    </div>
  );
}
