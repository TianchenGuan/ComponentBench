'use client';

/**
 * popover-mantine-T02: Open popover with keyboard (Enter on focused target)
 *
 * Baseline isolated card centered in the viewport.
 * A button labeled 'Keyboard help' is inside Mantine Popover.Target.
 * Popover is uncontrolled; it supports keyboard interactions when the target is a button.
 * Popover dropdown contains one sentence about keyboard controls.
 * Initial state: popover closed; focus starts at the top of the page.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Popover } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
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
        Accessibility
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Press Enter on the button to open the popover.
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
            data-testid="popover-target-keyboard-help"
            aria-expanded={opened}
          >
            Keyboard help
          </Button>
        </Popover.Target>
        <Popover.Dropdown data-testid="popover-keyboard-help">
          <Text size="sm">
            Use Tab to navigate between elements, Enter to activate, and Escape to close dialogs.
          </Text>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
