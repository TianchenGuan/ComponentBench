'use client';

/**
 * transfer_list-antd-T07: Show Profit margin column in a settings panel
 *
 * Layout: settings panel anchored in the top-right of the viewport (not centered).
 * The page looks like a typical analytics settings sidebar with several toggles
 * and dropdowns (e.g., "Compact charts", "Currency", "Time zone") that serve as
 * medium clutter but do not affect task success.
 *
 * Within the panel, a section titled "Report columns" contains a single AntD Transfer component.
 * Its columns are titled "Hidden columns" (left) and "Visible columns" (right). No search input.
 *
 * Initial state:
 * - Visible columns (right): Date, Customer, Total, Notes.
 * - Hidden columns (left): Profit margin, Tax, Discount.
 *
 * Goal: move Profit margin to Visible and move Notes back to Hidden
 * so the Visible set matches the requested four columns.
 *
 * Success: Target (right) list contains exactly: Date, Customer, Total, Profit margin (order ignore).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Transfer, Switch, Select, Typography, Space, Divider } from 'antd';
import type { TransferProps } from 'antd';
import type { TaskComponentProps, TransferItem } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const allItems: TransferItem[] = [
  { key: 'date', title: 'Date' },
  { key: 'customer', title: 'Customer' },
  { key: 'total', title: 'Total' },
  { key: 'notes', title: 'Notes' },
  { key: 'profit-margin', title: 'Profit margin' },
  { key: 'tax', title: 'Tax' },
  { key: 'discount', title: 'Discount' },
];

const initialTargetKeys = ['date', 'customer', 'total', 'notes'];
const goalTargetKeys = ['date', 'customer', 'total', 'profit-margin'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [targetKeyState, setTargetKeyState] = useState<string[]>(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(targetKeyState, goalTargetKeys)) {
      successFired.current = true;
      onSuccess();
    }
  }, [targetKeyState, onSuccess]);

  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeyState(newTargetKeys as string[]);
  };

  const handleSelectChange: TransferProps['onSelectChange'] = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys] as string[]);
  };

  return (
    <Card title="Analytics Settings" style={{ width: 700 }} data-testid="settings-panel">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Clutter controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text>Compact charts</Text>
          <Switch defaultChecked={false} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text>Currency</Text>
          <Select defaultValue="usd" style={{ width: 120 }} options={[
            { value: 'usd', label: 'USD' },
            { value: 'eur', label: 'EUR' },
            { value: 'gbp', label: 'GBP' },
          ]} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text>Time zone</Text>
          <Select defaultValue="utc" style={{ width: 150 }} options={[
            { value: 'utc', label: 'UTC' },
            { value: 'est', label: 'EST' },
            { value: 'pst', label: 'PST' },
          ]} />
        </div>

        <Divider />

        {/* Report columns section */}
        <div data-testid="report-columns-section">
          <Text strong style={{ display: 'block', marginBottom: 12 }}>
            Report columns
          </Text>
          <Transfer
            dataSource={allItems}
            titles={['Hidden columns', 'Visible columns']}
            targetKeys={targetKeyState}
            selectedKeys={selectedKeys}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            render={(item) => item.title}
            listStyle={{ width: 220, height: 220 }}
            data-testid="transfer-columns"
          />
        </div>
      </Space>
    </Card>
  );
}
