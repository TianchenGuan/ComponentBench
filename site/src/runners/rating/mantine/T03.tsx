'use client';

/**
 * rating-mantine-T03: Corner placement: set to 2 stars (Mantine)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=bottom_left.
 * Layout: isolated_card placed near the bottom-left of the viewport (placement robustness).
 * One Mantine Rating component labeled "Clarity of instructions".
 * Configuration: count=5, fractions=1.
 * Initial state: value = 5 (pre-filled).
 * No confirm controls; value changes commit immediately.
 * 
 * Success: Target rating value equals 2 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Rating, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(5);

  useEffect(() => {
    if (value === 2) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">Training feedback</Text>
        <div>
          <Text fw={500} mb={8}>Clarity of instructions</Text>
          <Rating
            value={value}
            onChange={setValue}
            fractions={1}
            data-testid="rating-clarity"
          />
        </div>
      </Stack>
    </Card>
  );
}
