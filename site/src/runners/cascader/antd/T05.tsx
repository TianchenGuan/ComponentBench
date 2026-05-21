'use client';

/**
 * cascader-antd-T05: Dark theme: pick Europe / France / Paris
 *
 * Theme: dark.
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Travel destination".
 * Options: Region → Country → City with a small set:
 *   - Europe → France → Paris
 *   - Europe → Spain → Madrid
 *   - Asia → Japan → Tokyo
 * Initial state: empty (placeholder visible).
 * Distractors: none.
 *
 * Success: path_labels equal [Europe, France, Paris], path_values equal ['europe','fr','paris']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'europe',
    label: 'Europe',
    children: [
      {
        value: 'fr',
        label: 'France',
        children: [
          { value: 'paris', label: 'Paris' },
        ],
      },
      {
        value: 'es',
        label: 'Spain',
        children: [
          { value: 'madrid', label: 'Madrid' },
        ],
      },
    ],
  },
  {
    value: 'asia',
    label: 'Asia',
    children: [
      {
        value: 'jp',
        label: 'Japan',
        children: [
          { value: 'tokyo', label: 'Tokyo' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['europe', 'fr', 'paris'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Travel Booking" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Travel destination
        </label>
        <Cascader
          data-testid="travel-destination-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          placeholder="Please select"
        />
      </div>
    </Card>
  );
}
