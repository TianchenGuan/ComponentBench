'use client';

/**
 * slider_single-mantine-T01: Set Volume to 20 (marked slider)
 * 
 * Layout: isolated card centered in the viewport titled "Audio".
 * The card contains one Mantine Slider labeled "Volume".
 * Configuration: range 0–100, step=10, with visible marks at 0, 20, 40, 60, 80, 100 (labels under the track).
 * The slider has labelAlwaysOn=true, so the current value label is always visible above the thumb.
 * Initial state: Volume starts at 40.
 * No other controls are present; changes apply immediately with no Apply/Cancel.
 * 
 * Success: The 'Volume' slider value equals 20.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Slider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const marks = [
  { value: 0, label: '0' },
  { value: 20, label: '20' },
  { value: 40, label: '40' },
  { value: 60, label: '60' },
  { value: 80, label: '80' },
  { value: 100, label: '100' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(40);

  useEffect(() => {
    if (value === 20) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Audio</Text>
      <Text fw={500} size="sm" mb="lg">Volume</Text>
      <Slider
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={10}
        marks={marks}
        labelAlwaysOn
        data-testid="slider-volume"
        mb="xl"
      />
      <Text c="dimmed" size="sm" mt="xl">
        Current: {value}
      </Text>
    </Card>
  );
}
