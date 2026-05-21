'use client';

/**
 * cascader-antd-T02: Change preferred warehouse to Europe / Germany / Berlin
 *
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Preferred warehouse".
 * Initial state: pre-selected value shown in the input as "Americas / USA / New York".
 * Options: a 3-level geography tree (Region → Country → City) with a few entries:
 *   - Americas → USA → New York, Chicago
 *   - Americas → Canada → Toronto
 *   - Europe → Germany → Berlin
 * Behavior: selecting a new leaf replaces the existing selection immediately.
 * Distractors: a short paragraph explaining that this selection affects shipping estimates.
 *
 * Success: path_labels equal [Europe, Germany, Berlin], path_values equal ['europe','de','berlin']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'americas',
    label: 'Americas',
    children: [
      {
        value: 'usa',
        label: 'USA',
        children: [
          { value: 'new-york', label: 'New York' },
          { value: 'chicago', label: 'Chicago' },
        ],
      },
      {
        value: 'canada',
        label: 'Canada',
        children: [
          { value: 'toronto', label: 'Toronto' },
        ],
      },
    ],
  },
  {
    value: 'europe',
    label: 'Europe',
    children: [
      {
        value: 'de',
        label: 'Germany',
        children: [
          { value: 'berlin', label: 'Berlin' },
        ],
      },
    ],
  },
];

const INITIAL_VALUE = ['americas', 'usa', 'new-york'];
const TARGET_PATH = ['europe', 'de', 'berlin'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(INITIAL_VALUE);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Shipping Preferences" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Preferred warehouse
        </label>
        <Cascader
          data-testid="preferred-warehouse-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          placeholder="Please select"
        />
        <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
          This selection affects shipping estimates and delivery times.
        </div>
      </div>
    </Card>
  );
}
