'use client';

/**
 * rating-mantine-T08: Quarter-step rating in dark theme: set to 2.75 (Mantine)
 * 
 * Scene details: theme=dark, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered in dark theme.
 * One Mantine Rating component labeled "Design polish".
 * Configuration: count=5, fractions=4 (each star divided into quarters, allowing 0.25 increments).
 * Initial state: value = 0.0.
 * A small numeric readout "Current value: X.XX" is shown beneath the rating to help observability.
 * No confirm button; selection commits immediately.
 * 
 * Success: Target rating value equals 2.75 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Rating, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    // Use a small tolerance for floating point comparison
    if (Math.abs(value - 2.75) < 0.01) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">Design review</Text>
        <div>
          <Text fw={500} mb={8}>Design polish</Text>
          <Rating
            value={value}
            onChange={setValue}
            fractions={4}
            data-testid="rating-design-polish"
          />
          <Text size="sm" c="dimmed" mt={8}>
            Current value: {value.toFixed(2)}
          </Text>
        </div>
      </Stack>
    </Card>
  );
}
