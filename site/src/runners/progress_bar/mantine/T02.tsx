'use client';

/**
 * progress_bar-mantine-T02: Enable striped style on progress bar
 *
 * Layout: isolated_card centered, titled "Progress styling".
 *
 * Target component: one Mantine Progress bar at 55% (static).
 *
 * Sub-controls:
 * - Checkbox labeled "Striped": toggles Progress striped prop.
 * - Checkbox labeled "Animated stripes": toggles Progress animated prop (distractor; not required).
 *
 * Initial state:
 * - Striped OFF.
 * - Animated stripes OFF.
 *
 * Success: Progress bar has striped styling enabled (striped=true).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Checkbox, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [striped, setStriped] = useState(false);
  const [animated, setAnimated] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (striped && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [striped, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">Progress styling</Text>
        <div>
          <Progress
            value={55}
            striped={striped}
            animated={animated}
            aria-label="Styled progress"
            data-testid="styled-progress"
            data-striped={striped}
          />
        </div>
        <Stack gap="xs">
          <Checkbox
            label="Striped"
            checked={striped}
            onChange={(event) => setStriped(event.currentTarget.checked)}
          />
          <Checkbox
            label="Animated stripes"
            checked={animated}
            onChange={(event) => setAnimated(event.currentTarget.checked)}
          />
        </Stack>
      </Stack>
    </Card>
  );
}
