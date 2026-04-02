'use client';

/**
 * time_input_text-mantine-T03: Clear a prefilled Mantine TimeInput
 * 
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * A single Mantine TimeInput labeled "Custom time" is shown.
 * - Native input[type='time'].
 * - Initial state: value is 13:05.
 * - No built-in clear button is shown; the user clears by selecting the text and deleting/backspacing.
 * - Clutter=none.
 * 
 * Success: The TimeInput labeled "Custom time" has no value (empty string).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('13:05');

  useEffect(() => {
    if (value === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Custom Settings</Text>
      
      <div>
        <Text component="label" htmlFor="custom-time" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Custom time
        </Text>
        <TimeInput
          id="custom-time"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          data-testid="custom-time"
        />
      </div>
    </Card>
  );
}
