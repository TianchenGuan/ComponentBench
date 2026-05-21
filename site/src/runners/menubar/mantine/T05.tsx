'use client';

/**
 * menubar-mantine-T05: Navigate to Billing (form section clutter)
 * 
 * Layout: form_section.
 * A "Subscription" form section has a header row implemented with Mantine components (AppShell.Header-like styling).
 * - Menubar links: Overview, Billing, Usage, Settings.
 * - Initial state: Overview is active.
 * - Clicking a link switches the active state and swaps a read-only preview panel below (not required for success).
 * - Clutter (low): the form section includes a couple of disabled inputs and a "Save" button below the header.
 * 
 * Success: The menubar's active item is "Billing".
 */

import React, { useState, useEffect } from 'react';
import { Paper, Group, UnstyledButton, Text, TextInput, Button, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const menuItems = ['Overview', 'Billing', 'Usage', 'Settings'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Overview');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (activeKey === 'Billing' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [activeKey, successTriggered, onSuccess]);

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 500 }}>
      <Text fw={600} mb="xs">Subscription</Text>
      <Text size="xs" c="dimmed" mb="sm" fw={500}>
        Top menu bar: Overview · Billing · Usage · Settings (Billing should be active)
      </Text>
      
      {/* Header menubar */}
      <Paper withBorder p="xs" radius="sm" bg="gray.0" mb="md">
        <Group gap="xs" data-testid="menubar-main">
          {menuItems.map((item) => (
            <UnstyledButton
              key={item}
              onClick={() => setActiveKey(item)}
              aria-current={activeKey === item ? 'page' : undefined}
              data-testid={`menubar-item-${item.toLowerCase()}`}
              style={{
                padding: '8px 16px',
                borderRadius: 4,
                borderBottom: activeKey === item ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
                color: activeKey === item ? 'var(--mantine-color-blue-6)' : 'inherit',
                fontWeight: activeKey === item ? 600 : 400,
              }}
            >
              {item}
            </UnstyledButton>
          ))}
        </Group>
      </Paper>

      {/* Form clutter */}
      <Stack gap="sm">
        <TextInput
          label="Plan"
          value="Professional"
          disabled
          size="sm"
        />
        <TextInput
          label="Renewal date"
          value="March 15, 2026"
          disabled
          size="sm"
        />
        <Button disabled size="sm" style={{ alignSelf: 'flex-start' }}>
          Save changes
        </Button>
      </Stack>
    </Paper>
  );
}
