'use client';

/**
 * autocomplete_restricted-mantine-T05: Set shipping country among two selects
 *
 * setup_description:
 * The UI is a centered "Order details" card with two Mantine Select components:
 * 1) **Billing country** (preselected: United States)
 * 2) **Shipping country** (empty)  ← target
 *
 * Both are restricted selects with the same option list of 10 countries (including Japan).
 * - Theme: light; spacing: comfortable; size: default.
 * - Dropdown opens via click on the input/chevron; selecting commits immediately.
 *
 * The agent must change only the Shipping country field to Japan.
 *
 * Success: The "Shipping country" Select has selected value "Japan".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Select, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const countries = [
  'United States', 'Canada', 'Mexico', 'United Kingdom', 'France',
  'Germany', 'Japan', 'China', 'Australia', 'Brazil'
].map(country => ({ label: country, value: country }));

export default function T05({ onSuccess }: TaskComponentProps) {
  const [billingCountry, setBillingCountry] = useState<string | null>('United States');
  const [shippingCountry, setShippingCountry] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && shippingCountry === 'Japan') {
      successFired.current = true;
      onSuccess();
    }
  }, [shippingCountry, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Order details</Text>
      <Stack gap="md">
        <div>
          <Text fw={500} size="sm" mb={4}>Billing country</Text>
          <Select
            data-testid="billing-country-select"
            data={countries}
            value={billingCountry}
            onChange={setBillingCountry}
          />
        </div>

        <div>
          <Text fw={500} size="sm" mb={4}>Shipping country</Text>
          <Select
            data-testid="shipping-country-select"
            placeholder="Select country"
            data={countries}
            value={shippingCountry}
            onChange={setShippingCountry}
          />
        </div>
      </Stack>
    </Card>
  );
}
