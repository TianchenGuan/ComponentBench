'use client';

/**
 * button-mantine-T02: Open info popover (Mantine)
 * 
 * Baseline isolated card titled "Subscription".
 * Single Mantine Button "Show info" that opens a Popover.
 */

import React, { useState } from 'react';
import { Button, Card, Text, Popover } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    onSuccess();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Subscription
      </Text>
      <Popover
        opened={opened}
        onChange={setOpened}
        position="bottom"
        withArrow
        data-overlay-id="mantine-popover-subscription-info"
      >
        <Popover.Target>
          <Button onClick={handleOpen} data-testid="mantine-btn-show-info">
            Show info
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm">
            Your current plan includes unlimited access to all features.
            Billing occurs monthly on the 1st.
          </Text>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
