'use client';

/**
 * popover-mantine-T05: Open corner-anchored popover (bottom-right placement)
 *
 * Isolated card anchored to the bottom-right of the viewport.
 * A small button labeled 'Need help?' is the Popover.Target.
 * Mantine Popover is uncontrolled and opens on click; position='top-start' so it appears above the button.
 * Popover dropdown contains a short help message and withArrow=true.
 * Initial state: popover closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Popover } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (opened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [opened, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 280 }}>
      <Text fw={500} size="lg" mb="md">
        Support
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Click the button below if you need assistance.
      </Text>
      <Popover
        opened={opened}
        onChange={setOpened}
        width={220}
        position="top-start"
        withArrow
        shadow="md"
      >
        <Popover.Target>
          <Button
            variant="light"
            onClick={() => setOpened((o) => !o)}
            data-testid="popover-target-need-help"
          >
            Need help?
          </Button>
        </Popover.Target>
        <Popover.Dropdown data-testid="popover-need-help">
          <Text size="sm">
            Our support team is available Monday-Friday, 9am-5pm EST. You can also email us at support@example.com.
          </Text>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
