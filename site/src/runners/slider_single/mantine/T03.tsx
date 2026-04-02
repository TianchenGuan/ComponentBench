'use client';

/**
 * slider_single-mantine-T03: Reset Corner radius to default (12)
 * 
 * Layout: isolated card centered in the viewport titled "Theme editor".
 * The card contains one Mantine Slider labeled "Corner radius (default: 12)".
 * Configuration: range 0–30, step=1, no marks. The label appears while dragging and shows the numeric value.
 * A small "Reset" button appears to the right of the label.
 * Initial state: Corner radius is set to 18.
 * Feedback: a persistent text line under the slider reads "Current radius: 18px" and updates immediately on change/reset.
 * No Apply/Cancel step exists.
 * 
 * Success: The 'Corner radius' slider value equals 12 (the labeled default).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Slider, Group, Button } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(18);

  useEffect(() => {
    if (value === 12) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleReset = () => {
    setValue(12);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Theme editor</Text>
      <Group justify="space-between" mb="md">
        <Text fw={500} size="sm">Corner radius (default: 12)</Text>
        <Button variant="subtle" size="xs" onClick={handleReset} data-testid="btn-reset-corner-radius">
          Reset
        </Button>
      </Group>
      <Slider
        value={value}
        onChange={setValue}
        min={0}
        max={30}
        step={1}
        data-testid="slider-corner-radius"
        mb="md"
      />
      <Text c="dimmed" size="sm">
        Current radius: {value}px
      </Text>
    </Card>
  );
}
