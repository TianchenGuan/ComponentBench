'use client';

/**
 * cascader-antd-v2-T14: Responsive tags exact set in compact dashboard filter
 *
 * Compact dashboard panel with a multiple Cascader "Teams included" embedded in a
 * filter strip with responsive tag layout. Select exactly: Support / Tier 2 / Identity,
 * Support / Tier 2 / Billing, Platform / Database / Primary. Then click "Apply filters".
 *
 * Success: set equals 3 paths, "Apply filters" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, Tag, ConfigProvider } from 'antd';
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
          { value: 'identity', label: 'Identity' },
          { value: 'billing', label: 'Billing' },
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
];

const TARGET_PATHS = [
  ['support', 'tier-2', 'identity'],
  ['support', 'tier-2', 'billing'],
  ['platform', 'database', 'primary'],
];

export default function T14({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[][]>([]);
  const successFired = useRef(false);

  const handleApply = () => {
    if (!successFired.current && pathSetsEqual(value, TARGET_PATHS)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <ConfigProvider componentSize="small">
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16, marginLeft: 40 }}>
          <Card size="small" style={{ width: 130 }}>
            <div style={{ fontSize: 11, color: '#999' }}>Tickets</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>1,247</div>
          </Card>
          <Card size="small" style={{ width: 130 }}>
            <div style={{ fontSize: 11, color: '#999' }}>SLA met</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#52c41a' }}>94.2%</div>
          </Card>
          <Card size="small" style={{ width: 130 }}>
            <div style={{ fontSize: 11, color: '#999' }}>Escalated</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#fa8c16' }}>38</div>
          </Card>
        </div>

        <Card
          size="small"
          style={{ width: 540, margin: '0 0 0 40px' }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Tag>Status: All</Tag>
            <Tag>Priority: High</Tag>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ display: 'block', marginBottom: 2, fontWeight: 500, fontSize: 12 }}>
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
            <Button type="primary" size="small" onClick={handleApply}>
              Apply filters
            </Button>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
}
