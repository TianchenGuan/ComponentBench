'use client';

/**
 * password_input-mantine-T02: Reveal a stored password
 * 
 * A centered card titled "Saved credential" contains one Mantine PasswordInput labeled
 * "Stored password". It is pre-filled and initially masked. A visibility toggle icon (eye)
 * appears on the right side of the input.
 * Clicking the icon reveals the password (input type switches to text). No other controls are required.
 * 
 * Success: The "Stored password" PasswordInput is in the revealed state (visible text).
 */

import React, { useState, useEffect } from 'react';
import { Card, PasswordInput, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [visible, setVisible] = useState(false);
  const prefilledValue = 'StoredSecret@99';

  useEffect(() => {
    if (visible) {
      onSuccess();
    }
  }, [visible, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Saved credential</Text>
      <PasswordInput
        label="Stored password"
        value={prefilledValue}
        readOnly
        visible={visible}
        onVisibilityChange={setVisible}
        data-testid="stored-password-input"
      />
    </Card>
  );
}
