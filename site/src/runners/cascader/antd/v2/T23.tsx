'use client';

/**
 * cascader-antd-v2-T23: Drawer visual chip match after popup shifts and wraps
 *
 * "Assignment rules" button opens a drawer. Inside: one multiple Cascader
 * "Assignee groups" and a visual target card showing two chips:
 * Support / Tier 2 / Identity and Platform / Database / Primary.
 * The input width is narrow so chips reflow after the first selection.
 * Click "Save groups" to confirm.
 *
 * Success: set matches reference (2 paths), "Save groups" clicked.
 */

import React, { useState, useRef } from 'react';
import { Button, Drawer, Cascader, Space, Tag, Card, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathSetsEqual } from '../../types';

const options = [
  {
    value: 'support',
    label: 'Support',
    children: [
      {
        value: 'tier-1',
        label: 'Tier 1',
        children: [
          { value: 'billing', label: 'Billing' },
          { value: 'identity', label: 'Identity' },
        ],
      },
      {
        value: 'tier-2',
        label: 'Tier 2',
        children: [
          { value: 'identity', label: 'Identity' },
          { value: 'billing', label: 'Billing' },
          { value: 'escalation', label: 'Escalation' },
        ],
      },
    ],
  },
  {
    value: 'platform',
    label: 'Platform',
    children: [
      {
        value: 'database',
        label: 'Database',
        children: [
          { value: 'primary', label: 'Primary' },
          { value: 'replica', label: 'Replica' },
        ],
      },
      {
        value: 'compute',
        label: 'Compute',
        children: [
          { value: 'lambda', label: 'Lambda' },
        ],
      },
    ],
  },
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      {
        value: 'product',
        label: 'Product',
        children: [
          { value: 'search', label: 'Search' },
        ],
      },
    ],
  },
];

const TARGET_PATHS = [
  ['support', 'tier-2', 'identity'],
  ['platform', 'database', 'primary'],
];

export default function T23({ onSuccess }: TaskComponentProps) {
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
      <div style={{ maxWidth: 480, margin: '20px 0 0 60px' }}>
        <Typography.Title level={4}>Workflow Configuration</Typography.Title>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Tag>Rules: 8</Tag>
          <Tag color="green">Synced</Tag>
          <Tag color="orange">2 drafts</Tag>
        </div>
        <Button type="primary" onClick={() => setDrawerOpen(true)}>
          Assignment rules
        </Button>
      </div>

      <Drawer
        title="Assignment Rules"
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={380}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSave}>Save groups</Button>
            </Space>
          </div>
        }
      >
        <Card
          size="small"
          title="Target groups"
          style={{ marginBottom: 16, background: '#fafafa' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Tag color="blue">Support / Tier 2 / Identity</Tag>
            <Tag color="blue">Platform / Database / Primary</Tag>
          </div>
        </Card>

        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Assignee groups
          </label>
          <Cascader
            style={{ width: '100%' }}
            options={options}
            value={value}
            onChange={(val) => setValue(val as string[][])}
            placeholder="Select groups"
            multiple
            maxTagCount="responsive"
          />
        </div>
      </Drawer>
    </div>
  );
}
