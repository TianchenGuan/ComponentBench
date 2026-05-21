'use client';

/**
 * stepper-antd-T03: Dark onboarding: jump to Verify email
 *
 * Layout: isolated_card centered on the page.
 * Theme: Dark theme (dark background card with light text).
 * Component: Ant Design Steps with clickable step headers (onChange enabled).
 * Steps: "Create account" → "Verify email" → "Get access".
 * Initial state: Current/active step is "Create account".
 * Success: Active step label is "Verify email" (step 2, index 1).
 */

import React, { useState } from 'react';
import { Steps, Card } from 'antd';
import type { TaskComponentProps } from '../types';

const steps = [
  { title: 'Create account' },
  { title: 'Verify email' },
  { title: 'Get access' },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [current, setCurrent] = useState(0);

  const handleChange = (value: number) => {
    setCurrent(value);
    if (value === 1) {
      onSuccess();
    }
  };

  return (
    <Card
      title="Onboarding"
      style={{ width: 500, background: '#1f1f1f', borderColor: '#303030' }}
      styles={{ header: { color: '#fff', borderBottomColor: '#303030' }, body: { color: '#fff' } }}
    >
      <Steps
        current={current}
        onChange={handleChange}
        items={steps}
        data-testid="stepper-onboarding"
      />
      <p style={{ marginTop: 16, color: '#aaa' }}>
        You can click steps to navigate.
      </p>
    </Card>
  );
}
