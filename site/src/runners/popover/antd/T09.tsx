'use client';

/**
 * popover-antd-T09: Open the fee popover that matches the reference (table cell)
 *
 * Table-cell layout: a small pricing table is shown inside an isolated card.
 * At the top of the card there is a 'Reference' pill showing the target fee name (text) and a small preview.
 * Below, a table lists three fee rows: 'Processing fee', 'Handling fee', and 'Service fee'.
 * Each row has a tiny info icon in the rightmost cell that opens an AntD Popover (trigger='click').
 * All info icons look identical and are tightly spaced within the table.
 * Initial state: all popovers are closed.
 * Success: Open only the popover that matches the reference fee name.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Card, Popover, Table, Tag, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const FEE_OPTIONS = ['Processing fee', 'Handling fee', 'Service fee'] as const;

export default function T09({ task, onSuccess }: TaskComponentProps) {
  // Randomly select target fee on mount
  const targetFee = useMemo(() => {
    const index = Math.floor(Math.random() * FEE_OPTIONS.length);
    return FEE_OPTIONS[index];
  }, []);

  const [openFee, setOpenFee] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (openFee === targetFee && !successCalledRef.current) {
      // Check that no other popovers are open
      successCalledRef.current = true;
      onSuccess();
    }
  }, [openFee, targetFee, onSuccess]);

  const handleOpenChange = (fee: string, open: boolean) => {
    if (open) {
      setOpenFee(fee);
    } else if (openFee === fee) {
      setOpenFee(null);
    }
  };

  const feeDescriptions: Record<string, string> = {
    'Processing fee': 'A fee charged for processing your payment securely.',
    'Handling fee': 'A fee for packaging and preparing your order.',
    'Service fee': 'A fee for platform maintenance and support.',
  };

  const columns = [
    {
      title: 'Fee type',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Info',
      key: 'info',
      width: 50,
      render: (_: unknown, record: { name: string }) => (
        <Popover
          content={
            <div style={{ maxWidth: 200 }}>
              <p style={{ margin: 0 }}>{feeDescriptions[record.name]}</p>
            </div>
          }
          title={record.name}
          trigger="click"
          open={openFee === record.name}
          onOpenChange={(open) => handleOpenChange(record.name, open)}
        >
          <InfoCircleOutlined
            data-testid={`fee-popover-target-${record.name.toLowerCase().replace(' ', '-')}`}
            style={{ cursor: 'pointer', color: '#1677ff' }}
          />
        </Popover>
      ),
    },
  ];

  const data = [
    { key: '1', name: 'Processing fee', amount: '$1.50' },
    { key: '2', name: 'Handling fee', amount: '$2.00' },
    { key: '3', name: 'Service fee', amount: '$0.99' },
  ];

  return (
    <Card title="Fees breakdown" style={{ width: 400 }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Text strong>Reference:</Text>
        <Tag color="blue" data-testid="reference-fee-name">{targetFee}</Tag>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
        Open the matching fee info popover in the table below.
      </Text>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
