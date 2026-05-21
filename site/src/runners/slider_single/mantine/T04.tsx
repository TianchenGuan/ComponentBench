'use client';

/**
 * slider_single-mantine-T04: Match reference bar for Confidence
 * 
 * Layout: isolated card centered in the viewport titled "Model output".
 * The card contains one Mantine Slider labeled "Confidence".
 * Configuration: range 0–100, step=1, and marks are hidden. The slider label is shown only while dragging (labelAlwaysOn=false).
 * Visual guidance: to the right of the slider is a small "Reference" horizontal bar indicating the desired confidence level (no numeric text).
 * Initial state: Confidence starts at 20; the reference corresponds to a hidden target value of 66.
 * Feedback: while dragging, Mantine shows the current value in the floating label; after release, the label disappears and no persistent number is shown.
 * No other controls and no Apply/Cancel exist.
 * 
 * Success: The 'Confidence' slider matches the reference value (reference target is 66). Acceptance tolerance: within ±2 of the reference value.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Slider, Group, Progress } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = 66;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(20);

  useEffect(() => {
    if (Math.abs(value - TARGET_VALUE) <= 2) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Model output</Text>
      <Text fw={500} size="sm" mb="lg">Confidence</Text>
      <Group align="center" gap="lg">
        <div style={{ flex: 1 }}>
          <Slider
            value={value}
            onChange={setValue}
            min={0}
            max={100}
            step={1}
            label={(v) => v}
            data-testid="slider-confidence"
          />
        </div>
        <div style={{ width: 80 }}>
          <Text c="dimmed" size="xs" mb={4}>Reference</Text>
          <Progress
            value={TARGET_VALUE}
            size="sm"
            data-testid="ref-confidence"
            data-ref-value={TARGET_VALUE}
          />
        </div>
      </Group>
    </Card>
  );
}
