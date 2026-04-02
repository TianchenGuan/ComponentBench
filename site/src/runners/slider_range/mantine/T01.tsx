'use client';

/**
 * slider_range-mantine-T01: Set engagement range to 25-75
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Engagement". It contains one Mantine RangeSlider labeled "Engagement range".
 * - Slider configuration: min=0, max=100, step=1, defaultValue=[20, 60], labels show on hover/drag (default Mantine behavior).
 * - Initial state: the readout below shows "Selected: 20 - 60".
 * No Apply/Reset controls; changes are immediate.
 * 
 * Success: Target range is set to 25-75 units (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, RangeSlider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([20, 60]);

  useEffect(() => {
    if (value[0] === 25 && value[1] === 75) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Engagement</Text>
      <Text fw={500} size="sm" mb="md">Engagement range</Text>
      <RangeSlider
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={1}
        data-testid="engagement-range"
        mb="md"
      />
      <Text c="dimmed" size="sm">
        Selected: {value[0]} - {value[1]}
      </Text>
    </Card>
  );
}
