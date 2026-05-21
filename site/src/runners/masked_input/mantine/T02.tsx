'use client';

/**
 * masked_input-mantine-T02: Enter date of birth
 * 
 * Baseline isolated card centered in the viewport titled "Personal details".
 * It contains one masked Mantine TextInput labeled "Date of birth (MM/DD/YYYY)".
 * The mask enforces two digits, slash, two digits, slash, four digits with placeholder "__/__/____".
 * The field starts empty; no other masked inputs exist and there is no submit action required.
 * 
 * Success: The "Date of birth (MM/DD/YYYY)" masked input value equals "07/04/1996".
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '07/04/1996') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Personal details</Text>
      <div style={{ marginBottom: 8 }}>
        <Text component="label" htmlFor="dob-field" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Date of birth (MM/DD/YYYY)
        </Text>
        <IMaskInput
          id="dob-field"
          mask="00/00/0000"
          definitions={{
            '0': /[0-9]/
          }}
          placeholder="__/__/____"
          value={value}
          onAccept={(val: string) => setValue(val)}
          data-testid="dob-field"
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
