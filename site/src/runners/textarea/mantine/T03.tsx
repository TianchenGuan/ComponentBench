'use client';

/**
 * textarea-mantine-T03: Two-line shipping update
 *
 * A centered card titled "Order update" contains one Mantine Textarea labeled "Shipping update".
 * - Light theme, comfortable spacing, default scale.
 * - The textarea starts empty and is configured with autosize=true (minRows=2, maxRows=6).
 * - A subtle character counter is shown below (page-level helper, not required).
 * - No other textareas are present.
 *
 * Success: Value equals exactly (whitespace=flexible):
 *   ETA 3 days
 *   Tracking will be emailed
 */

import React, { useState, useEffect } from 'react';
import { Card, Textarea, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = `ETA 3 days
Tracking will be emailed`;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const normalize = (s: string) =>
      s.replace(/\r\n/g, '\n').split('\n').map((l) => l.trimEnd()).join('\n').trim();
    if (normalize(value) === normalize(TARGET_VALUE)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">
        Order update
      </Text>
      <Textarea
        label="Shipping update"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autosize
        minRows={2}
        maxRows={6}
        data-testid="textarea-shipping-update"
      />
      <Text size="xs" c="dimmed" mt="xs">
        {value.length} characters
      </Text>
    </Card>
  );
}
