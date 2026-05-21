'use client';

/**
 * slider_range-antd-v2-T14: Service windows table — per-row Retry window + row Save
 *
 * Success: Gateway committed 20–60 s, Billing 15–45 s, after Gateway row Save.
 */

import React, { useState, useEffect } from 'react';
import { Button, Slider, Space, Table, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

export default function T14({ onSuccess }: TaskComponentProps) {
  const [gwPending, setGwPending] = useState<[number, number]>([10, 50]);
  const [billPending, setBillPending] = useState<[number, number]>([15, 45]);
  const [gwCommitted, setGwCommitted] = useState<[number, number]>([10, 50]);
  const [billCommitted, setBillCommitted] = useState<[number, number]>([15, 45]);

  useEffect(() => {
    if (
      gwCommitted[0] === 20 &&
      gwCommitted[1] === 60 &&
      billCommitted[0] === 15 &&
      billCommitted[1] === 45
    ) {
      onSuccess();
    }
  }, [gwCommitted, billCommitted, onSuccess]);

  const saveGateway = () => {
    setGwCommitted(gwPending);
  };

  const saveBilling = () => {
    setBillCommitted(billPending);
  };

  const dataSource = [
    {
      key: 'gw',
      service: 'Gateway',
      pending: gwPending,
      setPending: setGwPending,
      committed: gwCommitted,
      onSave: saveGateway,
      testId: 'gateway-retry-range',
      saveTestId: 'save-gateway-retry-window',
    },
    {
      key: 'bill',
      service: 'Billing',
      pending: billPending,
      setPending: setBillPending,
      committed: billCommitted,
      onSave: saveBilling,
      testId: 'billing-retry-range',
      saveTestId: 'save-billing-retry-window',
    },
  ];

  return (
    <div style={{ width: 720 }}>
      <Space wrap style={{ marginBottom: 8 }}>
        <Text strong style={{ fontSize: 15 }}>
          Service windows
        </Text>
        <Button size="small" disabled>
          Search
        </Button>
        <Button size="small" disabled>
          Export
        </Button>
        <span style={{ fontSize: 11, padding: '2px 8px', background: '#f5f5f5', borderRadius: 4 }}>HA pair</span>
        <span style={{ fontSize: 11, padding: '2px 8px', background: '#fff7e6', borderRadius: 4 }}>Degraded</span>
      </Space>
      <Table
        size="small"
        pagination={false}
        dataSource={dataSource}
        columns={[
          { title: 'Service', dataIndex: 'service', key: 'service', width: 100 },
          {
            title: 'Retry window',
            key: 'retry',
            render: (_, row) => (
              <div style={{ minWidth: 200 }}>
                <Slider
                  range
                  min={0}
                  max={120}
                  step={1}
                  value={row.pending}
                  onChange={(v) => row.setPending(v as [number, number])}
                  data-testid={row.testId}
                  style={{ marginBottom: 4 }}
                />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Row: {row.pending[0]}–{row.pending[1]} s · Saved: {row.committed[0]}–{row.committed[1]} s
                </Text>
              </div>
            ),
          },
          {
            title: '',
            key: 'save',
            width: 90,
            render: (_, row) => (
              <Button size="small" type="primary" onClick={row.onSave} data-testid={row.saveTestId}>
                Save
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
