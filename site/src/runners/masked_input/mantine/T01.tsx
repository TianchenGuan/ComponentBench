'use client';

/**
 * masked_input-mantine-T01: Enter primary phone number
 * 
 * Baseline isolated card centered in the viewport titled "Contact info".
 * It contains a single Mantine TextInput labeled "Primary phone (US)".
 * The input is masked to the US phone format with placeholder "(###) ###-####"; digits are accepted and formatting characters are inserted automatically.
 * The field starts empty and there are no other masked inputs or submission controls.
 * 
 * Success: The "Primary phone (US)" masked input value equals "(718) 555-0133".
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '(718) 555-0133') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Contact info</Text>
      <div style={{ marginBottom: 8 }}>
        <Text component="label" htmlFor="primary-phone" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Primary phone (US)
        </Text>
        <IMaskInput
          id="primary-phone"
          mask="(000) 000-0000"
          definitions={{
            '0': /[0-9]/
          }}
          placeholder="(###) ###-####"
          value={value}
          onAccept={(val: string) => setValue(val)}
          data-testid="primary-phone"
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
