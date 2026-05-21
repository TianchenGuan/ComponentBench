'use client';

/**
 * popover-mantine-T03: Close popover with Escape (dropdown focused)
 *
 * Baseline isolated card centered in the viewport.
 * A Mantine Popover titled 'Promo code help' is already open on page load (opened=true).
 * Inside the dropdown, a small close button has data-autofocus so focus starts within the dropdown.
 * Per Mantine keyboard interactions, Escape closes the dropdown when focus is within the dropdown.
 * Initial state: popover open, focus inside dropdown.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Popover, CloseButton, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
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

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Checkout
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Press Escape to close the popover.
      </Text>
      <Popover
        opened={opened}
        onChange={setOpened}
        width={280}
        position="bottom"
        withArrow
        shadow="md"
        trapFocus
      >
        <Popover.Target>
          <Button data-testid="popover-target-promo-code-help">
            Promo code help
          </Button>
        </Popover.Target>
        <Popover.Dropdown data-testid="popover-promo-code-help">
          <Stack gap="xs">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text fw={500} size="sm">Promo code help</Text>
              <CloseButton
                onClick={() => setOpened(false)}
                data-autofocus
              />
            </div>
            <Text size="sm">
              Enter your promo code in the checkout field. Codes are case-insensitive and can only be used once.
            </Text>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
