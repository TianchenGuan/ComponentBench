'use client';

/**
 * cascader-antd-v2-T17: Two identical leaf labels with leaf-only display and wrong-instance lure
 *
 * Dashboard panel with two Cascaders: "Report city" (empty, target) and "Fallback city"
 * (prefilled USA / Illinois / Springfield). Both use displayRender showing only the leaf.
 * The hierarchy has duplicate "Springfield" under Massachusetts, Illinois, Missouri.
 * Select USA / Massachusetts / Springfield in Report city, then click "Apply cities".
 * Fallback city must remain unchanged.
 *
 * Success: Report city path equals [USA, Massachusetts, Springfield],
 *          Fallback city unchanged, "Apply cities" clicked.
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
          { value: 'st-louis', label: 'St. Louis' },
        ],
      },
      {
        value: 'oregon',
        label: 'Oregon',
        children: [
          { value: 'portland', label: 'Portland' },
        ],
      },
    ],
  },
];

const FALLBACK_INITIAL = ['usa', 'illinois', 'springfield-il'];
const TARGET_PATH = ['usa', 'massachusetts', 'springfield-ma'];

export default function T17({ onSuccess }: TaskComponentProps) {
  const [reportValue, setReportValue] = useState<string[]>([]);
  const [fallbackValue, setFallbackValue] = useState<string[]>(FALLBACK_INITIAL);
  const successFired = useRef(false);

  const displayRender = (labels: string[]) => labels[labels.length - 1] || '';

  const handleApply = () => {
    if (
      !successFired.current &&
      pathEquals(reportValue, TARGET_PATH) &&
      pathEquals(fallbackValue, FALLBACK_INITIAL)
    ) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="City Configuration" style={{ width: 460, margin: '20px 0 0 40px' }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Report city
          </label>
          <Cascader
            style={{ width: '100%' }}
            options={options}
            value={reportValue}
            onChange={(val) => setReportValue(val as string[])}
            placeholder="Select city"
            displayRender={displayRender}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Fallback city
          </label>
          <Cascader
            style={{ width: '100%' }}
            options={options}
            value={fallbackValue}
            onChange={(val) => setFallbackValue(val as string[])}
            placeholder="Select city"
            displayRender={displayRender}
          />
        </div>
        <Button type="primary" onClick={handleApply}>Apply cities</Button>
      </Card>
    </div>
  );
}
