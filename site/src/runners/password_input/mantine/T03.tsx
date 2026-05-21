'use client';

/**
 * password_input-mantine-T03: Reset a password field to empty
 * 
 * A centered card titled "Temporary password" contains one Mantine PasswordInput labeled
 * "Temporary password" with a pre-filled masked value. To the right of the input is a small
 * button labeled "Reset".
 * Clicking "Reset" clears the PasswordInput value to an empty string. The visibility toggle
 * icon may be present, but it is not required.
 * 
 * Success: The PasswordInput labeled "Temporary password" has an empty string value.
 */

import React, { useState, useEffect } from 'react';
import { Card, PasswordInput, Text, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('TempPass!2026');

  useEffect(() => {
    if (value === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Temporary password</Text>
      <Group align="flex-end" gap="sm">
        <PasswordInput
          label="Temporary password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ flex: 1 }}
          data-testid="temp-password-input"
        />
        <Button 
          variant="outline" 
          onClick={() => setValue('')}
          data-testid="reset-btn"
        >
          Reset
        </Button>
      </Group>
    </Card>
  );
}
