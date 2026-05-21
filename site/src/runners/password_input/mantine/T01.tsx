'use client';

/**
 * password_input-mantine-T01: Set account password (Mantine PasswordInput)
 * 
 * A centered card titled "Account security" contains one Mantine PasswordInput labeled
 * "Account password" with placeholder text. The input starts empty and includes Mantine's
 * built-in visibility toggle icon on the right.
 * No other inputs or buttons are present.
 * 
 * Success: The PasswordInput labeled "Account password" equals exactly "Maple-2026!".
 */

import React, { useState, useEffect } from 'react';
import { Card, PasswordInput, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === 'Maple-2026!') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Account security</Text>
      <PasswordInput
        label="Account password"
        placeholder="Enter your password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        data-testid="account-password-input"
      />
    </Card>
  );
}
