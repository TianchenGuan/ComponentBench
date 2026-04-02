'use client';

/**
 * stepper-antd-T06: Vertical review flow: open Review step
 *
 * Layout: isolated_card placed near top-right of viewport (placement=top_right).
 * Component: Ant Design Steps in vertical orientation.
 * Steps (top→bottom): "Draft" → "Details" → "Review" → "Approve" → "Done".
 * Steps are clickable via onChange.
 * Initial state: Current/active step is "Details" (step 2, index 1).
 * Success: Active step label is "Review" (step 3, index 2).
 */

import React, { useState } from 'react';
import { Steps, Card } from 'antd';
import type { TaskComponentProps } from '../types';

const steps = [
  { title: 'Draft' },
  { title: 'Details' },
  { title: 'Review' },
  { title: 'Approve' },
  { title: 'Done' },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [current, setCurrent] = useState(1); // Start at "Details"

  const handleChange = (value: number) => {
    setCurrent(value);
    if (value === 2) {
      onSuccess();
    }
  };

  return (
    <Card title="Document Approval" style={{ width: 300 }}>
      <Steps
        current={current}
        onChange={handleChange}
        direction="vertical"
        items={steps}
        data-testid="stepper-document"
      />
      <div style={{ marginTop: 16, padding: 12, background: '#fafafa', borderRadius: 8 }}>
        <p style={{ fontSize: 12, color: '#666', margin: 0 }}>Activity log</p>
        <p style={{ fontSize: 11, color: '#999', margin: '4px 0 0' }}>No recent activity</p>
      </div>
    </Card>
  );
}
