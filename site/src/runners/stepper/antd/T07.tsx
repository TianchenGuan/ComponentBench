'use client';

/**
 * stepper-antd-T07: Compact small stepper: jump to Security
 *
 * Layout: isolated_card centered on the page.
 * Spacing/scale: spacing=compact and scale=small.
 * Component: Ant Design Steps (horizontal) with clickable headers.
 * Steps: "Start" → "Profile" → "Preferences" → "Security" → "Confirm" → "Complete".
 * Initial state: Active step is "Start" (index 0).
 * Success: Active step label is "Security" (step 4, index 3).
 */

import React, { useState } from 'react';
import { Steps, Card } from 'antd';
import type { TaskComponentProps } from '../types';

const steps = [
  { title: 'Start' },
  { title: 'Profile' },
  { title: 'Preferences' },
  { title: 'Security' },
  { title: 'Confirm' },
  { title: 'Complete' },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [current, setCurrent] = useState(0);

  const handleChange = (value: number) => {
    setCurrent(value);
    if (value === 3) {
      onSuccess();
    }
  };

  return (
    <Card
      title="Compact Onboarding"
      style={{ width: 650, padding: '8px' }}
      styles={{ body: { padding: 12 } }}
    >
      <Steps
        current={current}
        onChange={handleChange}
        items={steps}
        size="small"
        data-testid="stepper-compact"
      />
      <p style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
        Tip: You can click steps
      </p>
    </Card>
  );
}
