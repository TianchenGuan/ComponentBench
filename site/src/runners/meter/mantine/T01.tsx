'use client';

/**
 * meter-mantine-T01: Set Fuel Level meter to 50% (Mantine)
 *
 * Setup Description:
 * A centered isolated card shows one Mantine Progress bar used as a meter.
 * - Layout: isolated_card, placement center.
 * - Component: Mantine Progress with a single filled section (scalar value 0–100).
 * - Spacing/scale: comfortable, default.
 * - Instances: 1 labeled "Fuel Level".
 * - Interaction: clicking on the progress bar sets the meter value to the nearest whole percent (harness behavior).
 * - Initial state: 20%.
 * - Feedback: a text label next to the meter shows the exact percent; updates immediately.
 * - Distractors: none.
 *
 * Success: Fuel Level meter value is 50% (±3 percentage points).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(20);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(value - 50) <= 3 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">Fuel Level</Text>
        <div>
          <Group gap="sm" align="center">
            <div
              onClick={handleClick}
              style={{ flex: 1, cursor: 'pointer' }}
              data-testid="mantine-meter-fuel"
              data-meter-value={value}
              role="meter"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Fuel Level"
            >
              <Progress value={value} />
            </div>
            <Text size="sm" c="dimmed" style={{ minWidth: 40 }}>{value}%</Text>
          </Group>
        </div>
      </Stack>
    </Card>
  );
}
