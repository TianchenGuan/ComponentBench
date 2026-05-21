'use client';

/**
 * stepper-antd-T02: Profile wizard: advance to Profile
 *
 * Layout: isolated_card centered on the page.
 * Component: Ant Design Steps used as a linear wizard with a content area below it.
 * Steps: "Account" → "Profile" → "Preferences" → "Finish".
 * Step headers are NOT directly clickable (no onChange).
 * Navigation via "Next" button below content.
 * Initial state: Current/active step is "Account".
 * Success: Active step label is "Profile" (step 2, index 1).
 */

import React, { useState } from 'react';
import { Steps, Card, Button, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const steps = [
  { title: 'Account', description: 'Step 1 content: Account' },
  { title: 'Profile', description: 'Step 2 content: Profile' },
  { title: 'Preferences', description: 'Step 3 content: Preferences' },
  { title: 'Finish', description: 'Step 4 content: Finish' },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    const nextStep = current + 1;
    setCurrent(nextStep);
    if (nextStep === 1) {
      onSuccess();
    }
  };

  const handleBack = () => {
    setCurrent(current - 1);
  };

  return (
    <Card title="Profile Setup" style={{ width: 600 }}>
      <Steps
        current={current}
        items={steps.map((s) => ({ title: s.title }))}
        data-testid="stepper-profile"
      />
      <div style={{ marginTop: 24, padding: 16, background: '#fafafa', borderRadius: 8, minHeight: 100 }}>
        <p>{steps[current]?.description || 'Completed'}</p>
      </div>
      <Space style={{ marginTop: 16 }}>
        <Button
          disabled={current === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          type="primary"
          onClick={handleNext}
          disabled={current >= steps.length}
          data-testid="stepper-next"
        >
          Next
        </Button>
      </Space>
      <div style={{ marginTop: 16 }}>
        <a style={{ color: '#999', pointerEvents: 'none' }}>Help</a>
      </div>
    </Card>
  );
}
