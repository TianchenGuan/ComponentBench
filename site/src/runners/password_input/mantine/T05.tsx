'use client';

/**
 * password_input-mantine-T05: Use the generated password from the chip (dark theme)
 * 
 * The page uses a dark theme and shows a centered "Change password" card. At the top is a
 * Chip labeled "Generated password" displaying the token "SAND-PIANO-31".
 * Below are two Mantine PasswordInput components:
 * - "Current password" (disabled and pre-filled; shown only as context)
 * - "New password" (enabled, empty; this is the target)
 * Only the New password field is evaluated. No Save button is required.
 * 
 * Success: The PasswordInput labeled "New password" equals exactly the token shown in the
 * "Generated password" chip.
 */

import React, { useState, useEffect } from 'react';
import { Card, PasswordInput, Text, Badge, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const GENERATED_PASSWORD = 'SAND-PIANO-31';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (newPassword === GENERATED_PASSWORD) {
      onSuccess();
    }
  }, [newPassword, onSuccess]);

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      style={{ 
        width: 400, 
        background: '#1f1f1f', 
        borderColor: '#303030' 
      }}
    >
      <Text fw={600} size="lg" mb="md" c="white">Change password</Text>
      
      <div style={{ marginBottom: 16 }}>
        <Text size="xs" c="dimmed" mb={4}>Generated password</Text>
        <Badge 
          color="blue" 
          size="lg" 
          variant="filled"
          data-testid="generated-password-chip"
        >
          {GENERATED_PASSWORD}
        </Badge>
      </div>
      
      <Stack gap="md">
        <PasswordInput
          label="Current password"
          value="OldPassword123"
          disabled
          data-testid="current-password-input"
          data-cb-instance="current"
          styles={{
            label: { color: '#aaa' },
            input: { background: '#2a2a2a', borderColor: '#434343', color: '#888' }
          }}
        />
        <PasswordInput
          label="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          data-testid="new-password-input"
          data-cb-instance="new"
          styles={{
            label: { color: '#fff' },
            input: { background: '#141414', borderColor: '#434343', color: '#fff' }
          }}
        />
      </Stack>
    </Card>
  );
}
