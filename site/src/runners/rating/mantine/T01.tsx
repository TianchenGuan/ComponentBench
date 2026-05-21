'use client';

/**
 * rating-mantine-T01: Set workspace comfort to 4 stars (Mantine)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered.
 * One Mantine Rating component labeled "Workspace comfort".
 * Configuration: count=5, fractions=1 (whole-step), default star symbols.
 * Initial state: value = 0 (empty).
 * The rating updates immediately on selection; there is no submit/confirm control.
 * 
 * Success: Target rating value equals 4 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Rating, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (value === 4) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">Office survey</Text>
        <div>
          <Text fw={500} mb={8}>Workspace comfort</Text>
          <Rating
            value={value}
            onChange={setValue}
            fractions={1}
            data-testid="rating-workspace-comfort"
          />
        </div>
      </Stack>
    </Card>
  );
}
