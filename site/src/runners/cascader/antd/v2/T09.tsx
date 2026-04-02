'use client';

/**
 * cascader-antd-v2-T09: Drawer assignee group with sibling decoys and explicit save
 *
 * "Assignment settings" button opens a drawer. Inside: one Cascader labeled
 * "Default assignee group". Under Customer Success > Enterprise the final column
 * has Onboarding, Adoption, and Renewal. Select Customer Success / Enterprise / Onboarding,
 * then click "Save settings".
 *
 * Success: path equals [Customer Success, Enterprise, Onboarding], "Save settings" clicked.
 */

import React, { useState, useRef } from 'react';
import { Button, Drawer, Cascader, Space, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const options = [
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
          { value: 'retention', label: 'Retention' },
        ],
      },
    ],
  },
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      {
        value: 'platform',
        label: 'Platform',
        children: [
          { value: 'api', label: 'API' },
          { value: 'infra', label: 'Infrastructure' },
        ],
      },
    ],
  },
  {
    value: 'support',
    label: 'Support',
    children: [
      {
        value: 'tier-2',
        label: 'Tier 2',
        children: [
          { value: 'identity', label: 'Identity' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['customer-success', 'enterprise', 'onboarding'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleSave = () => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ maxWidth: 500, margin: '20px 0 0 40px' }}>
        <Typography.Title level={4}>Workflow Configuration</Typography.Title>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
          <Tag>Active rules: 14</Tag>
          <Tag color="green">Healthy</Tag>
        </div>
        <p style={{ color: '#666', marginBottom: 16 }}>
          Manage default assignment groups and routing configuration.
        </p>
        <Button type="primary" onClick={() => setDrawerOpen(true)}>
          Assignment settings
        </Button>
      </div>

      <Drawer
        title="Assignment Settings"
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={400}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSave}>Save settings</Button>
            </Space>
          </div>
        }
      >
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Default assignee group
          </label>
          <Cascader
            style={{ width: '100%' }}
            options={options}
            value={value}
            onChange={(val) => setValue(val as string[])}
            placeholder="Select group"
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
            Tickets without explicit assignment will route to this group.
          </div>
        </div>
      </Drawer>
    </div>
  );
}
