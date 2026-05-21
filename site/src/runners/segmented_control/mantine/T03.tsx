'use client';

/**
 * segmented_control-mantine-T03: Billing plan → Yearly (2 controls)
 *
 * Layout: form section titled "Checkout settings".
 * Two Mantine SegmentedControls are displayed:
 * 1) "Billing plan" options: "Monthly", "Yearly"
 *    Initial state: Monthly
 * 2) "Invoice delivery" options: "Email", "Download"
 *    Initial state: Email
 *
 * Clutter (low): a non-required text input labeled "Company name" is above the segmented controls.
 * No Apply/Save step; selection updates immediately.
 *
 * Success: The SegmentedControl labeled "Billing plan" selected value = Yearly.
 */

import React, { useState } from 'react';
import { Card, Text, TextInput, Stack, SegmentedControl } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const billingOptions = ['Monthly', 'Yearly'];
const deliveryOptions = ['Email', 'Download'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [billingPlan, setBillingPlan] = useState<string>('Monthly');
  const [invoiceDelivery, setInvoiceDelivery] = useState<string>('Email');

  const handleBillingChange = (value: string) => {
    setBillingPlan(value);
    if (value === 'Yearly') {
      onSuccess();
    }
  };

  const handleDeliveryChange = (value: string) => {
    setInvoiceDelivery(value);
    // No success for delivery
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Checkout settings</Text>
      
      <Stack gap="md">
        <TextInput label="Company name" placeholder="Enter company name..." />

        <div>
          <Text fw={500} mb="xs">Billing plan</Text>
          <SegmentedControl
            data-testid="billing-plan"
            data-canonical-type="segmented_control"
            data-selected-value={billingPlan}
            data={billingOptions}
            value={billingPlan}
            onChange={handleBillingChange}
          />
        </div>

        <div>
          <Text fw={500} mb="xs">Invoice delivery</Text>
          <SegmentedControl
            data-testid="invoice-delivery"
            data-canonical-type="segmented_control"
            data-selected-value={invoiceDelivery}
            data={deliveryOptions}
            value={invoiceDelivery}
            onChange={handleDeliveryChange}
          />
        </div>
      </Stack>
    </Card>
  );
}
