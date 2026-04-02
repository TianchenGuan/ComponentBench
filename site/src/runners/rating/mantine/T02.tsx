'use client';

/**
 * rating-mantine-T02: Match reference: 3 out of 5 (Mantine)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered.
 * A non-interactive reference row shows "Reference: ★★★☆☆" (3 out of 5).
 * Below it, one Mantine Rating component labeled "Your rating".
 * Configuration: count=5, fractions=1.
 * Initial state: Your rating = 0 (empty).
 * No confirm controls; success depends only on the committed rating value.
 * 
 * Success: Target rating value equals 3 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Rating, Stack, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (value === 3) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">Match the reference</Text>
        
        <Group>
          <Text fw={500}>Reference: </Text>
          <Text size="lg" style={{ letterSpacing: 2 }}>★★★☆☆</Text>
        </Group>
        
        <div>
          <Text fw={500} mb={8}>Your rating</Text>
          <Rating
            value={value}
            onChange={setValue}
            fractions={1}
            data-testid="rating-your-rating"
          />
        </div>
      </Stack>
    </Card>
  );
}
