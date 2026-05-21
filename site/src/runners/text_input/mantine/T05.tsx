'use client';

/**
 * text_input-mantine-T05: Enter formatted phone number with validation
 * 
 * Scene is an isolated card centered in the viewport titled "Contact details". There is a single Mantine
 * TextInput labeled "Phone" with a description line: "Format: (212) 555-0199". The field is controlled with
 * simple validation: if the value does not match the required format, an error message appears under the
 * input (e.g., "Use the exact format shown"). Initial value is "212-555-0199" (missing parentheses), so the
 * field starts in an error state. No other text inputs or overlays exist.
 * 
 * Success: The "Phone" TextInput value equals "(212) 555-0199" exactly (trim whitespace), and the input is
 * in a valid (non-error) state after entry.
 */

import React, { useState, useEffect } from 'react';
import { Card, TextInput, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('212-555-0199');
  
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  const isValid = phoneRegex.test(value.trim());

  useEffect(() => {
    if (value.trim() === '(212) 555-0199' && isValid) {
      onSuccess();
    }
  }, [value, isValid, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Contact details</Text>
      <TextInput
        label="Phone"
        description="Format: (212) 555-0199"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={!isValid ? 'Use the exact format shown' : undefined}
        data-testid="phone-input"
        aria-invalid={!isValid}
      />
    </Card>
  );
}
