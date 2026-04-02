'use client';

/**
 * popover-mantine-T06: Open Password rules popover in dark theme
 *
 * Robustness variant: dark theme.
 * Isolated card centered in the viewport titled 'Create account'.
 * Next to the 'Password' label, a small ActionIcon opens a Mantine Popover on click.
 * Popover title: 'Password rules'; dropdown lists three rules as plain text.
 * Initial state: popover closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Popover, PasswordInput, ActionIcon, Stack, List } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (opened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [opened, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Create account
      </Text>
      
      <Stack gap="md">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text size="sm" fw={500}>Password</Text>
            <Popover
              opened={opened}
              onChange={setOpened}
              width={250}
              position="right"
              withArrow
              shadow="md"
            >
              <Popover.Target>
                <ActionIcon
                  variant="subtle"
                  size="xs"
                  onClick={() => setOpened((o) => !o)}
                  data-testid="popover-target-password-rules"
                >
                  <IconInfoCircle size={14} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown data-testid="popover-password-rules">
                <Text size="sm" fw={500} mb="xs">Password rules</Text>
                <List size="xs" spacing="xs">
                  <List.Item>At least 8 characters long</List.Item>
                  <List.Item>Include at least one uppercase letter</List.Item>
                  <List.Item>Include at least one number or symbol</List.Item>
                </List>
              </Popover.Dropdown>
            </Popover>
          </div>
          <PasswordInput placeholder="Enter password" />
        </div>

        <Button>Create account</Button>
      </Stack>
    </Card>
  );
}
