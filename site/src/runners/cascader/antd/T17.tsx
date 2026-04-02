'use client';

/**
 * cascader-antd-T17: Search and select among similar results: United States / California / San Jose
 *
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "City" with showSearch enabled.
 * Options: Country → State/Territory → City. The dataset is larger and includes many cities starting with 'San':
 *   - United States → California → San Jose (target), San Diego
 *   - United States → Texas → San Antonio
 *   - Puerto Rico → (territory) → San Juan
 *   - United States → Florida → Sarasota
 * Search behavior: typing filters by path; results show full paths.
 * Initial state: blank.
 * Distractors: multiple search hits can appear for short queries like "San".
 *
 * Success: path_labels equal [United States, California, San Jose], path_values equal ['us','ca','san-jose']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'us',
    label: 'United States',
    children: [
      {
        value: 'ca',
        label: 'California',
        children: [
          { value: 'san-jose', label: 'San Jose' },
          { value: 'san-diego', label: 'San Diego' },
        ],
      },
      {
        value: 'tx',
        label: 'Texas',
        children: [
          { value: 'san-antonio', label: 'San Antonio' },
        ],
      },
      {
        value: 'fl',
        label: 'Florida',
        children: [
          { value: 'sarasota', label: 'Sarasota' },
        ],
      },
    ],
  },
  {
    value: 'pr',
    label: 'Puerto Rico',
    children: [
      {
        value: 'territory',
        label: 'Territory',
        children: [
          { value: 'san-juan', label: 'San Juan' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['us', 'ca', 'san-jose'];

export default function T17({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="City Selection" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          City
        </label>
        <Cascader
          data-testid="city-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          placeholder="Search or select city"
          showSearch
        />
      </div>
    </Card>
  );
}
