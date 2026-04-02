'use client';

/**
 * cascader-antd-T09: Compact spacing: select America / New York
 *
 * Spacing: compact mode (reduced padding between labels and controls).
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Timezone".
 * Options: Region → City (2 levels):
 *   - America → New York, Los Angeles
 *   - Europe → London
 * Initial state: blank.
 * Distractors: none.
 *
 * Success: path_labels equal [America, New York], path_values equal ['america','new-york']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader, ConfigProvider } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'america',
    label: 'America',
    children: [
      { value: 'new-york', label: 'New York' },
      { value: 'los-angeles', label: 'Los Angeles' },
    ],
  },
  {
    value: 'europe',
    label: 'Europe',
    children: [
      { value: 'london', label: 'London' },
    ],
  },
];

const TARGET_PATH = ['america', 'new-york'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <ConfigProvider componentSize="middle">
      <Card title="Timezone Settings" style={{ width: 350 }} styles={{ body: { padding: 12 } }}>
        <div style={{ marginBottom: 4 }}>
          <label style={{ display: 'block', marginBottom: 2, fontWeight: 500, fontSize: 13 }}>
            Timezone
          </label>
          <Cascader
            data-testid="timezone-cascader"
            style={{ width: '100%' }}
            options={options}
            value={value}
            onChange={(val) => setValue(val as string[])}
            placeholder="Please select"
            size="middle"
          />
        </div>
      </Card>
    </ConfigProvider>
  );
}
