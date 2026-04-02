'use client';

/**
 * stepper-antd-T01: Checkout: select Shipping step
 *
 * Layout: isolated_card centered on the page (single card, no scrolling).
 * Component: Ant Design Steps configured as a 3-step checkout progress indicator with clickable steps.
 * Steps (left→right): "Cart" → "Shipping" → "Payment".
 * Initial state: Current/active step is "Cart" (step 1).
 * Success: Active step label is "Shipping" (step 2, index 1).
 */

import React, { useState } from 'react';
import { Steps, Card } from 'antd';
import type { TaskComponentProps } from '../types';

const steps = [
  { title: 'Cart' },
  { title: 'Shipping' },
  { title: 'Payment' },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [current, setCurrent] = useState(0);

  const handleChange = (value: number) => {
    setCurrent(value);
    if (value === 1) {
      onSuccess();
    }
  };

  return (
    <Card title="Checkout" style={{ width: 500 }}>
      <Steps
        current={current}
        onChange={handleChange}
        items={steps}
        data-testid="stepper-checkout"
      />
      <p style={{ marginTop: 24, color: '#666' }}>
        {task.ui_copy}
      </p>
    </Card>
  );
}
