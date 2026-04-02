'use client';

/**
 * text_input-mantine-T04: Set shipping name among two fields
 * 
 * Scene is a settings_panel titled "Address settings" centered in the viewport. Two Mantine TextInput
 * components are shown (instances=2) with stacked labels: "Billing name" and "Shipping name". Billing name
 * is pre-filled with "Maya Patel", while Shipping name is pre-filled with "Maya P.". A few non-text controls
 * (a switch 'Use billing for shipping' and a Country select) appear as distractors, but no save button is
 * required for success.
 * 
 * Success: The TextInput labeled "Shipping name" has value "M. Patel" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, TextInput, Switch, Select, Stack, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [billingName, setBillingName] = useState('Maya Patel');
  const [shippingName, setShippingName] = useState('Maya P.');

  useEffect(() => {
    if (shippingName.trim() === 'M. Patel') {
      onSuccess();
    }
  }, [shippingName, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Address settings</Text>
      <Stack gap="md">
        <TextInput
          label="Billing name"
          value={billingName}
          onChange={(e) => setBillingName(e.target.value)}
          data-testid="billing-name-input"
        />
        <TextInput
          label="Shipping name"
          value={shippingName}
          onChange={(e) => setShippingName(e.target.value)}
          data-testid="shipping-name-input"
        />
        <Switch label="Use billing for shipping" />
        <Select
          label="Country"
          placeholder="Select country"
          data={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
            { value: 'uk', label: 'United Kingdom' },
          ]}
        />
      </Stack>
    </Card>
  );
}
