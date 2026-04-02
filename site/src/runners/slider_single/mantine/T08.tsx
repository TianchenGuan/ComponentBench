'use client';

/**
 * slider_single-mantine-T08: Set Gamma to 1.37 (fine step, minimal feedback)
 * 
 * Layout: isolated card centered in the viewport titled "Color correction".
 * The card contains one Mantine Slider labeled "Gamma".
 * Configuration: range 1.00–2.00 with step=0.01 (two-decimal precision). Marks are hidden.
 * Feedback is intentionally minimal: the slider's floating label is disabled (label=null), and the only numeric feedback is a small text under the slider that updates after release (e.g., "Current gamma: 1.xx").
 * Initial state: Gamma starts at 1.20.
 * No Apply/Cancel step exists; changes apply immediately.
 * 
 * Success: The 'Gamma' slider value is within ±0.005 of 1.37 (i.e., snaps to 1.37).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Slider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(1.20);

  useEffect(() => {
    if (Math.abs(value - 1.37) <= 0.005) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="lg" mb="md">Color correction</Text>
      <Text fw={500} size="sm" mb="lg">Gamma</Text>
      <Slider
        value={value}
        onChange={setValue}
        min={1}
        max={2}
        step={0.01}
        label={null}
        data-testid="slider-gamma"
        mb="md"
      />
      <Text c="dimmed" size="sm">
        Current gamma: {value.toFixed(2)}
      </Text>
    </Card>
  );
}
