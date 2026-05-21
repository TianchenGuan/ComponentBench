'use client';

/**
 * number_input_spinbutton-antd-T08: Edit seats in pricing table
 * 
 * The UI is a compact table (table_cell layout) centered on the page with three rows: Basic, Pro, Enterprise.
 * Column "Seats" contains an Ant Design InputNumber in each row (three instances total):
 * - Basic seats: initial value 3
 * - Pro seats: initial value 8  (TARGET)
 * - Enterprise seats: initial value 20
 * Each InputNumber uses compact spacing with small size to fit in the cell; step=1, min=1, max=99.
 * When a Seats value in a row is edited, a small "Save" button appears at the end of that row (and a "Cancel" link appears next to it). Saving commits the change.
 * For clutter, the table also includes a non-editable "Price" column and a header filter dropdown, but they do not affect success.
 * 
 * Success: The numeric value of the target number input (Pro plan / Seats) is 12, and the Save button for that row has been clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Button, Table, Typography, Select } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface PlanRow {
  key: string;
  plan: string;
  price: string;
  seats: number;
  originalSeats: number;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<PlanRow[]>([
    { key: 'basic', plan: 'Basic', price: '$9/mo', seats: 3, originalSeats: 3 },
    { key: 'pro', plan: 'Pro', price: '$29/mo', seats: 8, originalSeats: 8 },
    { key: 'enterprise', plan: 'Enterprise', price: '$99/mo', seats: 20, originalSeats: 20 },
  ]);
  const [proSaved, setProSaved] = useState(false);

  useEffect(() => {
    const proRow = data.find(row => row.key === 'pro');
    if (proRow && proRow.seats === 12 && proSaved) {
      onSuccess();
    }
  }, [data, proSaved, onSuccess]);

  const handleSeatsChange = (key: string, value: number | null) => {
    setData(prev => prev.map(row => 
      row.key === key ? { ...row, seats: value ?? row.originalSeats } : row
    ));
    if (key === 'pro') {
      setProSaved(false);
    }
  };

  const handleSave = (key: string) => {
    setData(prev => prev.map(row =>
      row.key === key ? { ...row, originalSeats: row.seats } : row
    ));
    if (key === 'pro') {
      setProSaved(true);
    }
  };

  const handleCancel = (key: string) => {
    setData(prev => prev.map(row =>
      row.key === key ? { ...row, seats: row.originalSeats } : row
    ));
  };

  const columns = [
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
      key: 'seats',
      render: (_: number, record: PlanRow) => (
        <InputNumber
          size="small"
          min={1}
          max={99}
          step={1}
          value={record.seats}
          onChange={(val) => handleSeatsChange(record.key, val)}
          style={{ width: 70 }}
          data-testid={`${record.key}-seats-input`}
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: PlanRow) => {
        const isDirty = record.seats !== record.originalSeats;
        return isDirty ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              size="small" 
              type="primary"
              onClick={() => handleSave(record.key)}
              data-testid={`${record.key}-save-btn`}
            >
              Save
            </Button>
            <Button 
              size="small" 
              type="link"
              onClick={() => handleCancel(record.key)}
            >
              Cancel
            </Button>
          </div>
        ) : null;
      },
    },
  ];

  return (
    <Card title="Pricing" style={{ width: 500 }} styles={{ body: { padding: 0 } }}>
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Select
          size="small"
          defaultValue="all"
          style={{ width: 120 }}
          options={[
            { value: 'all', label: 'All plans' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'annual', label: 'Annual' },
          ]}
        />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
