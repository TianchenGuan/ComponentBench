'use client';

/**
 * stepper-antd-T05: Billing vs Shipping: go to Tax info (Billing)
 *
 * Layout: form_section with two Ant Design Steps components.
 * Two steppers: "Billing setup" (target) and "Shipping setup" (distractor).
 * Billing steps: "Address" → "Tax info" → "Payment method" → "Confirm".
 * Shipping steps: "Address" → "Delivery method" → "Confirm".
 * Initial state: Billing at "Address", Shipping at "Delivery method".
 * Success: Billing setup active step is "Tax info" (index 1).
 */

import React, { useState } from 'react';
import { Steps, Card, Input } from 'antd';
import type { TaskComponentProps } from '../types';

const billingSteps = [
  { title: 'Address' },
  { title: 'Tax info' },
  { title: 'Payment method' },
  { title: 'Confirm' },
];

const shippingSteps = [
  { title: 'Address' },
  { title: 'Delivery method' },
  { title: 'Confirm' },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [billingCurrent, setBillingCurrent] = useState(0);
  const [shippingCurrent, setShippingCurrent] = useState(1);

  const handleBillingChange = (value: number) => {
    setBillingCurrent(value);
    if (value === 1) {
      onSuccess();
    }
  };

  const handleShippingChange = (value: number) => {
    setShippingCurrent(value);
  };

  return (
    <div style={{ width: 700 }}>
      <h2 style={{ marginBottom: 24, fontSize: 20 }}>Checkout Form</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Complete both billing and shipping information below.
      </p>

      <Card
        title="Billing setup"
        style={{ marginBottom: 16 }}
        data-testid="stepper-billing"
      >
        <Steps
          current={billingCurrent}
          onChange={handleBillingChange}
          items={billingSteps}
        />
      </Card>

      <Card
        title="Shipping setup"
        style={{ marginBottom: 16 }}
        data-testid="stepper-shipping"
      >
        <Steps
          current={shippingCurrent}
          onChange={handleShippingChange}
          items={shippingSteps}
        />
      </Card>

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <Input placeholder="Company name" disabled style={{ width: 200 }} />
        <Input placeholder="VAT number" disabled style={{ width: 200 }} />
      </div>
    </div>
  );
}
