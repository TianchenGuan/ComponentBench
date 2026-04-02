'use client';

/**
 * rating-mantine-T04: Half-star fractions: set to 3.5 (Mantine)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered.
 * One Mantine Rating component labeled "Lesson usefulness".
 * Configuration: count=5, fractions=2 (each star split into halves, allowing 0.5 steps).
 * Initial state: value = 0.0.
 * A small text note reads "Half-star ratings are enabled".
 * No save/confirm button; selection commits immediately.
 * 
 * Success: Target rating value equals 3.5 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Rating, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (value === 3.5) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">Course feedback</Text>
        <div>
          <Text fw={500} mb={8}>Lesson usefulness</Text>
          <Rating
            value={value}
            onChange={setValue}
            fractions={2}
            data-testid="rating-lesson-usefulness"
          />
          <Text size="sm" c="dimmed" mt={8}>
            Half-star ratings are enabled
          </Text>
        </div>
      </Stack>
    </Card>
  );
}
