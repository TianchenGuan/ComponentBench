'use client';

/**
 * cascader-antd-v2-T04: Visual target chips — exact three-path team set in drawer
 *
 * Drawer with one multiple Cascader labeled "Teams included" and a visual target card
 * showing three chips: Engineering / Platform / API, Engineering / Support / Identity,
 * Customer Success / Enterprise / Onboarding. Click "Save teams" to confirm.
 *
 * Success: set matches reference (3 paths), "Save teams" clicked.
 */

import React, { useState, useRef } from 'react';
import { Button, Drawer, Cascader, Space, Tag, Card, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathSetsEqual } from '../../types';

const options = [
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      {
        value: 'platform',
        label: 'Platform',
        children: [
          { value: 'api', label: 'API' },
          { value: 'queues', label: 'Queues' },
          { value: 'cache', label: 'Cache' },
        ],
      },
      {
        value: 'support',
        label: 'Support',
        children: [
          { value: 'identity', label: 'Identity' },
          { value: 'billing', label: 'Billing' },
        ],
      },
      {
        value: 'product',
        label: 'Product',
        children: [
          { value: 'search', label: 'Search' },
        ],
      },
    ],
  },
  {
    value: 'customer-success',
    label: 'Customer Success',
    children: [
      {
        value: 'enterprise',
        label: 'Enterprise',
        children: [
          { value: 'onboarding', label: 'Onboarding' },
          { value: 'adoption', label: 'Adoption' },
          { value: 'renewal', label: 'Renewal' },
        ],
      },
      {
        value: 'smb',
        label: 'SMB',
        children: [
          { value: 'onboarding', label: 'Onboarding' },
        ],
      },
    ],
  },
];

const TARGET_PATHS = [
  ['engineering', 'platform', 'api'],
  ['engineering', 'support', 'identity'],
  ['customer-success', 'enterprise', 'onboarding'],
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState<string[][]>([]);
  const successFired = useRef(false);

  const handleSave = () => {
    if (!successFired.current && pathSetsEqual(value, TARGET_PATHS)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ maxWidth: 500, margin: '20px 60px' }}>
        <Typography.Title level={4}>Team Management</Typography.Title>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
          <Tag color="green">12 teams</Tag>
          <Tag>48 members</Tag>
          <Tag color="orange">3 pending</Tag>
        </div>
        <p style={{ color: '#666', marginBottom: 16 }}>
          Configure team assignments for the current project scope.
        </p>
        <Button type="primary" onClick={() => setDrawerOpen(true)}>
          Teams included
        </Button>
      </div>

      <Drawer
        title="Teams included"
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={420}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSave}>Save teams</Button>
            </Space>
          </div>
        }
      >
        <Card
          size="small"
          title="Target teams"
          style={{ marginBottom: 16, background: '#fafafa' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Tag color="blue">Engineering / Platform / API</Tag>
            <Tag color="blue">Engineering / Support / Identity</Tag>
            <Tag color="blue">Customer Success / Enterprise / Onboarding</Tag>
          </div>
        </Card>

        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Teams included
          </label>
          <Cascader
            style={{ width: '100%' }}
            options={options}
            value={value}
            onChange={(val) => setValue(val as string[][])}
            placeholder="Select teams"
            multiple
            maxTagCount="responsive"
          />
        </div>
      </Drawer>
    </div>
  );
}
