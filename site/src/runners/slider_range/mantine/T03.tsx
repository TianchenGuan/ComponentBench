'use client';

/**
 * slider_range-mantine-T03: Reset saturation window to default
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Color correction". It contains one Mantine RangeSlider labeled "Saturation window".
 * - Slider configuration: min=0, max=100, step=1.
 * - Default range shown as helper text: "Default: 30 - 70".
 * - Initial state: Selected starts at 10-90 and is displayed as "Selected: 10 - 90".
 * A single button labeled "Reset to default" is below the slider; clicking it sets the range back to 30-70 immediately.
 * No Apply step.
 * 
 * Success: Target range is set to 30-70 units (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, RangeSlider, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([10, 90]);

  useEffect(() => {
    if (value[0] === 30 && value[1] === 70) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleReset = () => {
    setValue([30, 70]);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Color correction</Text>
      <Group justify="space-between" mb="md">
        <Text fw={500} size="sm">Saturation window</Text>
        <Text c="dimmed" size="xs">Default: 30 - 70</Text>
      </Group>
      <RangeSlider
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={1}
        data-testid="saturation-range"
        mb="md"
      />
      <Text c="dimmed" size="sm" mb="md">
        Selected: {value[0]} - {value[1]}
      </Text>
      <Button variant="outline" onClick={handleReset}>
        Reset to default
      </Button>
    </Card>
  );
}
