'use client';

/**
 * cascader-antd-v2-T20: Nested-scroll deep leaf near bottom of scrollable third column
 *
 * Nested-scroll layout with a 4-level Cascader "Access scope". Under
 * Organization > Europe > Dublin, the final Zone options extend beyond the initial
 * third-column viewport, so the cascader menu must be scrolled. Select
 * Organization / Europe / Dublin / Zone 2, then click "Apply scope".
 *
 * Success: path equals [Organization, Europe, Dublin, Zone 2], "Apply scope" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button, ConfigProvider } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const options = [
  {
    value: 'organization',
    label: 'Organization',
    children: [
      {
        value: 'north-america',
        label: 'North America',
        children: [
          {
            value: 'seattle',
            label: 'Seattle',
            children: [
              { value: 'zone-1', label: 'Zone 1' },
              { value: 'zone-2', label: 'Zone 2' },
            ],
          },
        ],
      },
      {
        value: 'europe',
        label: 'Europe',
        children: [
          {
            value: 'dublin',
            label: 'Dublin',
            children: [
              { value: 'bay-area', label: 'Bay Area' },
              { value: 'central', label: 'Central' },
              { value: 'docklands', label: 'Docklands' },
              { value: 'finance', label: 'Finance' },
              { value: 'harbor', label: 'Harbor' },
              { value: 'ifsc', label: 'IFSC' },
              { value: 'north-side', label: 'North Side' },
              { value: 'south-side', label: 'South Side' },
              { value: 'zone-1', label: 'Zone 1' },
              { value: 'zone-2', label: 'Zone 2' },
              { value: 'zone-3', label: 'Zone 3' },
            ],
          },
          {
            value: 'london',
            label: 'London',
            children: [
              { value: 'zone-1', label: 'Zone 1' },
            ],
          },
        ],
      },
      {
        value: 'asia',
        label: 'Asia',
        children: [
          {
            value: 'tokyo',
            label: 'Tokyo',
            children: [
              { value: 'zone-1', label: 'Zone 1' },
            ],
          },
        ],
      },
    ],
  },
  {
    value: 'team-only',
    label: 'Team only',
  },
];

const TARGET_PATH = ['organization', 'europe', 'dublin', 'zone-2'];

export default function T20({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleApply = () => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <ConfigProvider componentSize="small">
      <div style={{ padding: 24, maxHeight: '100vh', overflow: 'auto' }}>
        <Card
          title="Security Settings"
          style={{ width: 480, margin: '0 auto' }}
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
              Select the organizational scope for access control. Zone selection
              may require scrolling the final popup column.
            </div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              Access scope
            </label>
            <Cascader
              style={{ width: '100%' }}
              options={options}
              value={value}
              onChange={(val) => setValue(val as string[])}
              placeholder="Select scope"
            />
          </div>
          <Button type="primary" onClick={handleApply}>Apply scope</Button>
        </Card>
      </div>
    </ConfigProvider>
  );
}
