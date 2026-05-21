'use client';

/**
 * password_input-mantine-T04: Set Backup password in a two-field form section
 * 
 * A "Connection credentials" form section contains two Mantine PasswordInput components:
 * - "Database password" (top)
 * - "Backup password" (bottom)
 * Both inputs start empty and look identical, each with a visibility toggle icon. No Save
 * button is required.
 * A few non-password toggles appear below (e.g., "Enable backups") as low clutter.
 * 
 * Success: The PasswordInput labeled "Backup password" equals exactly "Backup#44".
 */

import React, { useState, useEffect } from 'react';
import { Card, PasswordInput, Text, Switch, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [dbPassword, setDbPassword] = useState('');
  const [backupPassword, setBackupPassword] = useState('');

  useEffect(() => {
    if (backupPassword === 'Backup#44') {
      onSuccess();
    }
  }, [backupPassword, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Connection credentials</Text>
      <Stack gap="md">
        <PasswordInput
          label="Database password"
          value={dbPassword}
          onChange={(e) => setDbPassword(e.target.value)}
          data-testid="db-password-input"
          data-cb-instance="database"
        />
        <PasswordInput
          label="Backup password"
          value={backupPassword}
          onChange={(e) => setBackupPassword(e.target.value)}
          data-testid="backup-password-input"
          data-cb-instance="backup"
        />
        <Switch label="Enable backups" defaultChecked />
        <Switch label="Auto-sync" />
      </Stack>
    </Card>
  );
}
