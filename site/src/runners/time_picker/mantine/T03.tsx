'use client';

/**
 * time_picker-mantine-T03: Open the time picker dropdown
 *
 * A centered isolated card contains one Mantine TimeInput labeled "Start time" with a popover
 * containing time selection options. The task requires opening the popover.
 *
 * Implementation: Using TimeInput with a Popover for dropdown simulation.
 *
 * Success: The dropdown popover belonging to the "Start time" time input is open/visible.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Popover, Stack, Button, Group, ActionIcon } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened) {
      onSuccess();
    }
  }, [opened, onSuccess]);

  const handleSelect = (hour: string, minute: string) => {
    setValue(`${hour}:${minute}`);
    setOpened(false);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Schedule</Text>
      
      <div>
        <Text component="label" htmlFor="tp-start" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Start time
        </Text>
        <Popover
          opened={opened}
          onChange={setOpened}
          position="bottom"
          width={300}
          shadow="md"
        >
          <Popover.Target>
            <div style={{ display: 'flex', gap: 8 }}>
              <TimeInput
                id="tp-start"
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                style={{ flex: 1 }}
                data-testid="tp-start"
              />
              <ActionIcon
                variant="light"
                size="lg"
                onClick={() => setOpened((o) => !o)}
                data-testid="tp-start-trigger"
              >
                <IconClock size={18} />
              </ActionIcon>
            </div>
          </Popover.Target>
          <Popover.Dropdown data-testid="tp-start-dropdown">
            <Text size="xs" c="dimmed" mb="xs">Select time</Text>
            <Group gap="xs">
              {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00'].map((t) => (
                <Button
                  key={t}
                  variant="light"
                  size="xs"
                  onClick={() => {
                    setValue(t);
                    setOpened(false);
                  }}
                >
                  {t}
                </Button>
              ))}
            </Group>
          </Popover.Dropdown>
        </Popover>
        <Text size="xs" c="dimmed" mt={8}>
          (Open dropdown)
        </Text>
      </div>
    </Card>
  );
}
