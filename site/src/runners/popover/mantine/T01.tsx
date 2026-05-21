'use client';

/**
 * popover-mantine-T01: Set Shipping tips popover to open (toggle state)
 *
 * Baseline isolated card centered in the viewport.
 * A button labeled 'Shipping tips' is wrapped in Mantine Popover (uncontrolled toggle behavior).
 * Clicking the button toggles the popover dropdown.
 * Popover dropdown contains a short text; withArrow=true.
 * Initial state: popover is closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Popover } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
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
        Shipping Information
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Get helpful tips about shipping options.
      </Text>
      <Popover
        opened={opened}
        onChange={setOpened}
        width={250}
        position="bottom"
        withArrow
        shadow="md"
      >
        <Popover.Target>
          <Button
            onClick={() => setOpened((o) => !o)}
            data-testid="popover-target-shipping-tips"
          >
            Shipping tips
          </Button>
        </Popover.Target>
        <Popover.Dropdown data-testid="popover-shipping-tips">
          <Text size="sm">
            Standard shipping takes 5-7 business days. Express shipping is available for an additional fee.
          </Text>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
