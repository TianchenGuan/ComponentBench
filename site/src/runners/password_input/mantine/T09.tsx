'use client';

/**
 * password_input-mantine-T09: Reveal password when visibility is synced across two inputs (compact)
 * 
 * A centered signup card uses compact spacing (tight vertical gaps). It contains two Mantine
 * PasswordInput fields: "Password" and "Confirm password". Both are pre-filled and initially masked.
 * The two inputs share a controlled visibility state: toggling visibility on either field reveals/hides
 * both at once (synced behavior). Each field shows a visibility toggle icon.
 * No submission button is present; the goal is only to end with the Password field revealed.
 * 
 * Success: The PasswordInput labeled "Password" is revealed (visible text).
 */

import React, { useState, useEffect } from 'react';
import { Card, PasswordInput, Text, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [visible, setVisible] = useState(false);
  const password1 = 'SyncedPass@1';
  const password2 = 'SyncedPass@1';

  useEffect(() => {
    if (visible) {
      onSuccess();
    }
  }, [visible, onSuccess]);

  return (
    <Card 
      shadow="sm" 
      padding="sm" 
      radius="md" 
      withBorder 
      style={{ width: 350 }}
    >
      <Text fw={600} size="md" mb="xs">Create account</Text>
      <Text size="xs" c="dimmed" mb="sm">
        Note: Visibility toggle is synced.
      </Text>
      <Stack gap="xs">
        <PasswordInput
          label="Password"
          value={password1}
          readOnly
          visible={visible}
          onVisibilityChange={setVisible}
          size="sm"
          data-testid="password-input"
          data-cb-instance="password"
        />
        <PasswordInput
          label="Confirm password"
          value={password2}
          readOnly
          visible={visible}
          onVisibilityChange={setVisible}
          size="sm"
          data-testid="confirm-password-input"
          data-cb-instance="confirm"
        />
      </Stack>
    </Card>
  );
}
