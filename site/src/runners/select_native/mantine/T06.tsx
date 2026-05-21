'use client';

/**
 * select_native-mantine-T06: Select Germany as country in shipping form
 *
 * Layout: a shipping address form section with multiple inputs (Name, Address, City) as clutter.
 * The target component is a Mantine NativeSelect labeled "Country".
 *
 * Options (label → value):
 * - United States → US
 * - Canada → CA
 * - Mexico → MX
 * - United Kingdom → GB
 * - Germany → DE  ← TARGET
 * - France → FR
 * - Spain → ES
 * - Italy → IT
 * - Netherlands → NL
 * - Sweden → SE
 * - Japan → JP
 * - Australia → AU
 *
 * Initial state: United States is selected.
 * Clutter: low — several nearby text inputs and a checkbox "Save this address", but they do not affect success.
 * Feedback: immediate.
 *
 * Success: The target native select has selected option value 'DE' (label 'Germany').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect, TextInput, Checkbox, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const countryOptions = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'Mexico', value: 'MX' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Spain', value: 'ES' },
  { label: 'Italy', value: 'IT' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Japan', value: 'JP' },
  { label: 'Australia', value: 'AU' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [country, setCountry] = useState<string>('US');
  const [saveAddress, setSaveAddress] = useState(false);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setCountry(value);
    if (value === 'DE') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Shipping Address</Text>
      
      <Stack gap="md">
        <TextInput
          label="Full name"
          defaultValue="John Smith"
        />
        
        <TextInput
          label="Street address"
          defaultValue="123 Main Street"
        />
        
        <TextInput
          label="City"
          defaultValue="Berlin"
        />

        <NativeSelect
          data-testid="country-select"
          data-canonical-type="select_native"
          data-selected-value={country}
          label="Country"
          value={country}
          onChange={handleCountryChange}
          data={countryOptions}
        />

        <Checkbox
          label="Save this address"
          checked={saveAddress}
          onChange={(e) => setSaveAddress(e.currentTarget.checked)}
        />
      </Stack>
    </Card>
  );
}
