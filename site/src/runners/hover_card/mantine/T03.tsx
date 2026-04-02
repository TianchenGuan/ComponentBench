'use client';

/**
 * hover_card-mantine-T03: Acknowledge a tip inside hover card
 *
 * Layout: isolated_card centered, light theme.
 *
 * The page shows a small "Keyboard shortcuts" label with a dotted underline.
 * - Hovering the label opens a Mantine HoverCard dropdown with a short tip about shortcuts.
 * - At the bottom of the dropdown are two buttons: "Got it" and "Remind me later".
 * - Clicking either button dismisses the dropdown and records the choice.
 *
 * Instances: 1 hover card.
 * Initial state: dropdown closed; no choice recorded.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Group, Button, Popover, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [decision, setDecision] = useState<'confirm' | 'cancel' | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (decision === 'confirm' && !opened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [decision, opened, onSuccess]);

  const handleGotIt = () => {
    setDecision('confirm');
    setOpened(false);
  };

  const handleRemindLater = () => {
    setDecision('cancel');
    setOpened(false);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="lg" mb="md">Help</Text>
      <Popover 
        width={280} 
        shadow="md"
        opened={opened}
        onChange={setOpened}
      >
        <Popover.Target>
          <Text 
            c="blue" 
            style={{ 
              cursor: 'pointer',
              textDecoration: 'underline',
              textDecorationStyle: 'dotted'
            }}
            data-testid="keyboard-shortcuts-trigger"
            data-cb-instance="Keyboard shortcuts"
            onMouseEnter={() => setOpened(true)}
            onMouseLeave={() => setOpened(false)}
          >
            Keyboard shortcuts
          </Text>
        </Popover.Target>
        <Popover.Dropdown data-testid="hover-card-content" data-cb-instance="Keyboard shortcuts" onMouseEnter={() => setOpened(true)} onMouseLeave={() => setOpened(false)}>
          <Stack gap="sm">
            <Text size="sm" fw={600}>Keyboard Shortcuts</Text>
            <Text size="xs" c="dimmed">
              Press <kbd>?</kbd> to view all available keyboard shortcuts. 
              You can navigate, search, and perform actions without using your mouse.
            </Text>
            <Group gap="xs" justify="flex-end">
              <Button 
                variant="subtle" 
                size="xs"
                onClick={handleRemindLater}
                data-testid="remind-later-button"
              >
                Remind me later
              </Button>
              <Button 
                size="xs"
                onClick={handleGotIt}
                data-testid="got-it-button"
              >
                Got it
              </Button>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
