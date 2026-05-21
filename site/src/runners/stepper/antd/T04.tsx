'use client';

/**
 * stepper-antd-T04: Reset wizard back to Start
 *
 * Layout: isolated_card centered on the page.
 * Component: Ant Design Steps used as a simple wizard progress indicator with a reset control.
 * Steps: "Start" → "Details" → "Review" → "Complete".
 * Initial state: The wizard is currently at "Complete" (step 4, index 3).
 * A link-styled button labeled "Reset" sets the active step back to "Start".
 * Success: Active step label is "Start" (step 1, index 0).
 */

import React, { useState } from 'react';
import { Steps, Card, Button } from 'antd';
import type { TaskComponentProps } from '../types';

const steps = [
  { title: 'Start', description: 'Step 1 content' },
  { title: 'Details', description: 'Step 2 content' },
  { title: 'Review', description: 'Step 3 content' },
  { title: 'Complete', description: 'Step 4 content' },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [current, setCurrent] = useState(3); // Start at "Complete"

  const handleReset = () => {
    setCurrent(0);
    onSuccess();
  };

  return (
    <Card title="Setup Wizard" style={{ width: 600 }}>
      <Steps
        current={current}
        items={steps.map((s) => ({ title: s.title }))}
        data-testid="stepper-setup"
      />
      <div style={{ marginTop: 24, padding: 16, background: '#fafafa', borderRadius: 8, minHeight: 60 }}>
        <p>{steps[current]?.description || 'Completed'}</p>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
        <Button
          type="link"
          onClick={handleReset}
          data-testid="stepper-reset"
          style={{ padding: 0 }}
        >
          Reset
        </Button>
        <Button disabled style={{ color: '#999' }}>
          Print summary
        </Button>
      </div>
    </Card>
  );
}
