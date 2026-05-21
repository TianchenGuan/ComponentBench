'use client';

/**
 * masked_input-mantine-T03: Enter 5-digit ZIP code
 * 
 * Baseline isolated card centered in the viewport titled "Address".
 * It contains a single masked Mantine TextInput labeled "ZIP code".
 * The mask allows only digits and enforces exactly five digits; the placeholder shows "_____".
 * The field starts empty and there is no additional form submission required.
 * 
 * Success: The "ZIP code" masked input value equals "02139".
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '02139') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Address</Text>
      <div style={{ marginBottom: 8 }}>
        <Text component="label" htmlFor="zip-code" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          ZIP code
        </Text>
        <IMaskInput
          id="zip-code"
          mask="00000"
          definitions={{
            '0': /[0-9]/
          }}
          placeholder="_____"
          value={value}
          onAccept={(val: string) => setValue(val)}
          inputMode="numeric"
          data-testid="zip-code"
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: 14,
            lineHeight: 1.55,
            border: '1px solid #ced4da',
            borderRadius: 4,
            outline: 'none',
          }}
        />
      </div>
    </Card>
  );
}
