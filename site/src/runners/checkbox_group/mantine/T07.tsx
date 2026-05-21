'use client';

/**
 * checkbox_group-mantine-T07: Configure Billing add-ons (two groups)
 *
 * Scene: light theme; comfortable spacing; a form section centered in the viewport; instances=2.
 * Mantine checkout configuration page (light theme) shown as a form section with medium clutter.
 * Above the checkbox groups are unrelated inputs (Order name text input, Currency select) and helper text.
 * Target components are two Checkbox.Group instances:
 * 1) "Shipping add-ons" (distractor): Tracking emails (checked), Signature required, Saturday delivery, Customs forms
 * 2) "Billing add-ons" (target): Invoice reminders (unchecked), Tax summary (unchecked), Payment failed alerts (checked), PO number field (unchecked)
 * Success: In the 'Billing add-ons' checkbox group, exactly Invoice reminders and Tax summary are checked.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Checkbox, Stack, TextInput, Select, Divider, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const shippingOptions = ['Tracking emails', 'Signature required', 'Saturday delivery', 'Customs forms'];
const billingOptions = ['Invoice reminders', 'Tax summary', 'Payment failed alerts', 'PO number field'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [shippingAddons, setShippingAddons] = useState<string[]>(['Tracking emails']);
  const [billingAddons, setBillingAddons] = useState<string[]>(['Payment failed alerts']);

  useEffect(() => {
    const targetSet = new Set(['Invoice reminders', 'Tax summary']);
    const currentSet = new Set(billingAddons);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [billingAddons, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Checkout configuration</Text>
      
      {/* Distractor form elements */}
      <Group grow mb="md">
        <TextInput label="Order name" placeholder="Order #12345" />
        <Select
          label="Currency"
          placeholder="Select"
          data={['USD', 'EUR', 'GBP']}
          defaultValue="USD"
        />
      </Group>
      <Text size="xs" c="dimmed" mb="md">
        Configure optional add-ons for shipping and billing.
      </Text>

      <Divider my="md" />

      {/* Distractor: Shipping add-ons */}
      <Text fw={500} size="sm" mb="xs">Shipping add-ons</Text>
      <Checkbox.Group
        data-testid="cg-shipping-addons"
        value={shippingAddons}
        onChange={setShippingAddons}
        mb="lg"
      >
        <Stack gap="xs">
          {shippingOptions.map(option => (
            <Checkbox key={option} value={option} label={option} />
          ))}
        </Stack>
      </Checkbox.Group>

      {/* Target: Billing add-ons */}
      <Text fw={500} size="sm" mb="xs">Billing add-ons</Text>
      <Checkbox.Group
        data-testid="cg-billing-addons"
        value={billingAddons}
        onChange={setBillingAddons}
      >
        <Stack gap="xs">
          {billingOptions.map(option => (
            <Checkbox key={option} value={option} label={option} />
          ))}
        </Stack>
      </Checkbox.Group>
    </Card>
  );
}
