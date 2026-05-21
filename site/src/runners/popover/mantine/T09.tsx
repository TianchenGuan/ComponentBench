'use client';

/**
 * popover-mantine-T09: Dismiss overlay popover using the Close button (click outside disabled)
 *
 * Isolated card centered in the viewport.
 * A Mantine Popover titled 'Account preview' is open on load (opened=true).
 * Popover is configured with closeOnClickOutside=false, so clicking outside does NOT dismiss it.
 * Inside the dropdown, there are two buttons: 'Close' and 'Cancel'. Only 'Close' dismisses the popover.
 * The popover dropdown contains some profile text above the buttons.
 * Initial state: popover open.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Popover, Stack, Group, Avatar } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(true);
  const successCalledRef = useRef(false);
  const initialCheckDone = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      initialCheckDone.current = true;
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (initialCheckDone.current && !opened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [opened, onSuccess]);

  const handleClose = () => {
    setOpened(false);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Profile
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Use the Close button in the popover to dismiss it.
      </Text>
      
      <Popover
        opened={opened}
        onChange={setOpened}
        width={280}
        position="bottom"
        withArrow
        shadow="md"
        closeOnClickOutside={false}
      >
        <Popover.Target>
          <Button variant="light" data-testid="popover-target-account-preview">
            View account
          </Button>
        </Popover.Target>
        <Popover.Dropdown data-testid="popover-account-preview">
          <Stack gap="sm">
            <Text fw={500} size="sm">Account preview</Text>
            <Group>
              <Avatar color="blue" radius="xl">JD</Avatar>
              <div>
                <Text size="sm">John Doe</Text>
                <Text size="xs" c="dimmed">john.doe@example.com</Text>
              </div>
            </Group>
            <Text size="xs" c="dimmed">
              Premium member since 2023
            </Text>
            <Group justify="flex-end" mt="xs">
              <Button variant="subtle" size="xs">
                Cancel
              </Button>
              <Button
                size="xs"
                onClick={handleClose}
                data-testid="popover-close-button"
              >
                Close
              </Button>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
