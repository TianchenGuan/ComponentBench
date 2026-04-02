'use client';

/**
 * cascader-antd-T25: Ambiguous leaf labels with leaf-only displayRender: choose Springfield (MA)
 *
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Event city".
 * Custom rendering: displayRender is customized to show ONLY the final leaf label in the input
 * (e.g., it will display "Springfield", not the full path).
 * Options: Country → State → City, with duplicate city names:
 *   - USA → Illinois → Springfield
 *   - USA → Massachusetts → Springfield (target)
 *   - USA → Oregon → Portland
 *   - USA → Maine → Portland
 * Initial state: blank.
 * Distractors: because the input displays only the leaf, the agent must rely on the dropdown columns
 * to ensure the correct state/city branch.
 *
 * Success: path_labels equal [USA, Massachusetts, Springfield], path_values equal ['us','ma','springfield-ma']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'us',
    label: 'USA',
    children: [
      {
        value: 'il',
        label: 'Illinois',
        children: [
          { value: 'springfield-il', label: 'Springfield' },
        ],
      },
      {
        value: 'ma',
        label: 'Massachusetts',
        children: [
          { value: 'springfield-ma', label: 'Springfield' },
        ],
      },
      {
        value: 'or',
        label: 'Oregon',
        children: [
          { value: 'portland-or', label: 'Portland' },
        ],
      },
      {
        value: 'me',
        label: 'Maine',
        children: [
          { value: 'portland-me', label: 'Portland' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['us', 'ma', 'springfield-ma'];

export default function T25({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  // Custom display render showing only the leaf label
  const displayRender = (labels: string[]) => {
    return labels[labels.length - 1] || '';
  };

  return (
    <Card title="Event Registration" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Event city
        </label>
        <Cascader
          data-testid="event-city-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          placeholder="Select city"
          displayRender={displayRender}
        />
        <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
          Select USA / Massachusetts / Springfield
        </div>
      </div>
    </Card>
  );
}
