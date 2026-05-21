'use client';

/**
 * link-mantine-T03: Open a seat definition popover from an Anchor
 * 
 * setup_description:
 * A centered isolated card titled "Pricing" includes one Mantine Anchor labeled
 * "What is a seat?". The Anchor triggers a small popover overlay (Mantine
 * Popover/Tooltip-style) anchored to the link.
 * 
 * Initial state: popover closed; the Anchor has aria-expanded="false" and
 * aria-haspopup="dialog". On activation, a popover appears below the link with a
 * short definition and a title "Seat".
 * 
 * success_trigger:
 * - The "What is a seat?" Anchor (data-testid="link-seat") was activated.
 * - The Anchor's aria-expanded equals "true".
 * - The popover (data-testid="popover-seat") is visible.
 */

import React, { useState } from 'react';
import { Card, Text, Anchor, Popover, Box, Title } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!opened) {
      setOpened(true);
      onSuccess();
    } else {
      setOpened(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">
        Pricing
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Our pricing is based on the number of seats in your organization.
      </Text>
      
      <Popover 
        opened={opened} 
        onClose={() => setOpened(false)}
        position="bottom"
        withArrow
      >
        <Popover.Target>
          <Anchor
            href="#"
            onClick={handleClick}
            data-testid="link-seat"
            aria-expanded={opened}
            aria-haspopup="dialog"
          >
            What is a seat?
          </Anchor>
        </Popover.Target>
        <Popover.Dropdown>
          <Box 
            data-testid="popover-seat" 
            role="dialog"
            style={{ maxWidth: 250 }}
          >
            <Title order={5} mb="xs">Seat</Title>
            <Text size="sm">
              A seat represents one user license in your subscription. 
              Each team member who needs access to the platform requires 
              their own seat.
            </Text>
          </Box>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
