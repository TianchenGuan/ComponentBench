'use client';

/**
 * cascader-antd-v2-T05: Leaf-only displayRender with ambiguous Springfield branch
 *
 * Settings panel with one Cascader labeled "Event city" using a custom displayRender
 * that shows only the final leaf text. Duplicate "Springfield" leaves exist under
 * Massachusetts, Illinois, and Missouri. Select USA / Massachusetts / Springfield,
 * then click "Apply city".
 *
 * Success: path equals [USA, Massachusetts, Springfield] (values: usa/massachusetts/springfield-ma),
 *          "Apply city" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Cascader, Button } from 'antd';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

const options = [
  {
    value: 'usa',
    label: 'USA',
    children: [
      {
        value: 'massachusetts',
        label: 'Massachusetts',
        children: [
          { value: 'springfield-ma', label: 'Springfield' },
          { value: 'boston', label: 'Boston' },
        ],
      },
      {
        value: 'illinois',
        label: 'Illinois',
        children: [
          { value: 'springfield-il', label: 'Springfield' },
          { value: 'chicago', label: 'Chicago' },
        ],
      },
      {
        value: 'missouri',
        label: 'Missouri',
        children: [
          { value: 'springfield-mo', label: 'Springfield' },
          { value: 'kansas-city', label: 'Kansas City' },
        ],
      },
      {
        value: 'oregon',
        label: 'Oregon',
        children: [
          { value: 'portland-or', label: 'Portland' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['usa', 'massachusetts', 'springfield-ma'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleApply = () => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  };

  const displayRender = (labels: string[]) => labels[labels.length - 1] || '';

  return (
    <div style={{ padding: 24 }}>
      <Card title="Event Registration" style={{ width: 440, margin: '0 auto' }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: '#888' }}>
            Select the host city for the upcoming event.
          </span>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Event city
          </label>
          <Cascader
            style={{ width: '100%' }}
            options={options}
            value={value}
            onChange={(val) => setValue(val as string[])}
            placeholder="Select city"
            displayRender={displayRender}
          />
        </div>
        <Button type="primary" style={{ marginTop: 16 }} onClick={handleApply}>
          Apply city
        </Button>
      </Card>
    </div>
  );
}
