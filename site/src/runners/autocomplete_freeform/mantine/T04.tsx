'use client';

/**
 * autocomplete_freeform-mantine-T04: Search and select with auto-highlighted first option
 *
 * setup_description:
 * A centered isolated card titled "Shipping" contains one Mantine Autocomplete labeled "Country".
 *
 * The Autocomplete has selectFirstOptionOnChange enabled: when the user types, the first matching suggestion is automatically highlighted so pressing Enter will select it. The suggestion data includes multiple similar "United ..." options: United States, United Kingdom, United Arab Emirates, United Republic of Tanzania.
 *
 * Initial state: empty input. Distractors: a non-interactive helper text "Type to search countries". Feedback: selected option appears as the input value immediately.
 *
 * Success: The Country Autocomplete input's displayed value equals "United States" (trim whitespace). Case-sensitive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Autocomplete } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const countries = [
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'United Republic of Tanzania',
  'Canada',
  'Mexico',
  'France',
  'Germany',
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = value.trim();
  const targetValue = 'United States';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Shipping</Text>
      <Text fw={500} size="sm" mb={8}>Country</Text>
      <Autocomplete
        data-testid="country"
        placeholder="Select country"
        data={countries}
        value={value}
        onChange={setValue}
        selectFirstOptionOnChange
      />
      <Text size="xs" c="dimmed" mt={4}>Type to search countries</Text>
    </Card>
  );
}
