'use client';

/**
 * slider_single-mantine-T02: Set Donation amount to 75
 * 
 * Layout: isolated card centered in the viewport titled "Donate".
 * The card contains one Mantine Slider labeled "Donation amount".
 * Configuration: range 0–200, step=5. Marks are shown at 0, 50, 100, 150, 200 (numeric labels).
 * A tooltip-style label shows the current value while dragging (default Mantine behavior), and a small text "Selected: $XX" appears below after release.
 * Initial state: Donation amount starts at 50.
 * No other inputs are required; the slider is the only interactive element.
 * 
 * Success: The 'Donation amount' slider value equals 75.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Slider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const marks = [
  { value: 0, label: '$0' },
  { value: 50, label: '$50' },
  { value: 100, label: '$100' },
  { value: 150, label: '$150' },
  { value: 200, label: '$200' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(50);

  useEffect(() => {
    if (value === 75) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Donate</Text>
      <Text fw={500} size="sm" mb="lg">Donation amount</Text>
      <Slider
        value={value}
        onChange={setValue}
        min={0}
        max={200}
        step={5}
        marks={marks}
        data-testid="slider-donation"
        mb="xl"
      />
      <Text c="dimmed" size="sm" mt="xl">
        Selected: ${value}
      </Text>
    </Card>
  );
}
