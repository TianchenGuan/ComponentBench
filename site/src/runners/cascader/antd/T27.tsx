'use client';

/**
 * cascader-antd-T27: Table cell: set Assign to for 'Password reset' rule
 *
 * Layout: table cell scenario.
 * Clutter: medium — a data table with multiple rows/columns plus a small toolbar (Search, Add rule) above it.
 * Table: "Routing rules" with rows like:
 *   - Password reset (target row)
 *   - Refund request
 *   - App crash
 * Only the target row's "Assign to" column contains an interactive AntD Cascader input;
 * other rows display read-only text.
 * Cascader options: Department → Tier → Specialty:
 *   - Support → Tier 1 → General
 *   - Support → Tier 2 → Identity (target), Billing
 *   - Engineering → On-call → Mobile
 * Initial state: target row currently shows "Support / Tier 1 / General".
 * Behavior: selecting a leaf updates the cell immediately; no additional Save action is required.
 *
 * Success: path_labels equal [Support, Tier 2, Identity], path_values equal ['support','t2','identity']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Cascader, Input, Button } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const assignOptions = [
  {
    value: 'support',
    label: 'Support',
    children: [
      {
        value: 't1',
        label: 'Tier 1',
        children: [
          { value: 'general', label: 'General' },
        ],
      },
      {
        value: 't2',
        label: 'Tier 2',
        children: [
          { value: 'identity', label: 'Identity' },
          { value: 'billing', label: 'Billing' },
        ],
      },
    ],
  },
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      {
        value: 'oncall',
        label: 'On-call',
        children: [
          { value: 'mobile', label: 'Mobile' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['support', 't2', 'identity'];

export default function T27({ onSuccess }: TaskComponentProps) {
  const [passwordResetAssign, setPasswordResetAssign] = useState<string[]>(['support', 't1', 'general']);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(passwordResetAssign, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [passwordResetAssign, onSuccess]);

  const columns = [
    {
      title: 'Rule Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: 'Assign to',
      dataIndex: 'assignTo',
      key: 'assignTo',
      width: 250,
      render: (_: unknown, record: { key: string; assignTo: string }) => {
        if (record.key === 'password-reset') {
          return (
            <Cascader
              data-testid="routing-table-password-reset-assign-to"
              style={{ width: '100%' }}
              options={assignOptions}
              value={passwordResetAssign}
              onChange={(val) => setPasswordResetAssign(val as string[])}
              placeholder="Select"
              size="small"
            />
          );
        }
        return <span style={{ color: '#666' }}>{record.assignTo}</span>;
      },
    },
  ];

  const data = [
    { key: 'password-reset', name: 'Password reset', category: 'Account', assignTo: '' },
    { key: 'refund-request', name: 'Refund request', category: 'Billing', assignTo: 'Support / Tier 1 / General' },
    { key: 'app-crash', name: 'App crash', category: 'Technical', assignTo: 'Engineering / On-call / Mobile' },
  ];

  return (
    <div style={{ width: 600 }}>
      <Card title="Routing Rules" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <Input.Search placeholder="Search rules" style={{ width: 200 }} />
          <Button type="primary">Add rule</Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}
