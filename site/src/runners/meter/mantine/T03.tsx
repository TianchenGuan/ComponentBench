'use client';

/**
 * meter-mantine-T03: Reset Battery Health meter to 0% (Mantine)
 *
 * Setup Description:
 * A centered isolated card shows one meter titled "Battery Health".
 * - Layout: isolated_card, placement center.
 * - Component: Mantine Progress (scalar percent) used as a meter.
 * - Spacing/scale: comfortable, default.
 * - Instances: 1.
 * - Sub-controls: a small "Reset" action icon appears next to the label (part of the meter widget). 
 *   Clicking it sets value to 0%.
 * - Initial state: 65%.
 * - Distractors: below the card is a disabled "Reset all" button (disabled).
 * - Feedback: value text updates immediately; no Apply/Save.
 *
 * Success: Battery Health meter value is exactly 0%.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Group, Stack, Button, ActionIcon } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(65);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (value === 0 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleReset = () => {
    setValue(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Stack gap="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={600} size="lg">Battery Health</Text>
            <ActionIcon 
              variant="light" 
              onClick={handleReset}
              data-testid="meter-battery-reset"
              title="Reset"
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Group>
          
          <div>
            <Group gap="sm" align="center">
              <div
                onClick={handleClick}
                style={{ flex: 1, cursor: 'pointer' }}
                data-testid="meter-battery"
                data-meter-value={value}
                role="meter"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Battery Health"
              >
                <Progress value={value} />
              </div>
              <Text size="sm" c="dimmed" style={{ minWidth: 40 }}>{value}%</Text>
            </Group>
          </div>
        </Stack>
      </Card>
      
      <Button disabled style={{ width: 100 }}>
        Reset all
      </Button>
    </Stack>
  );
}
