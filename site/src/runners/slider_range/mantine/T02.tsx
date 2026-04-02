'use client';

/**
 * slider_range-mantine-T02: Set percent range using labeled marks
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Conversion filter". It contains one Mantine RangeSlider labeled "Conversion range (%)".
 * - Slider configuration: min=0, max=100, step=1, marks displayed with labels at 20%, 50%, and 80%.
 * - Initial state: range is 0-100 and the readout shows "Selected: 0% - 100%".
 * No Apply step; changes are immediate.
 * 
 * Success: Target range is set to 20-80 % (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, RangeSlider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const marks = [
  { value: 20, label: '20%' },
  { value: 50, label: '50%' },
  { value: 80, label: '80%' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    if (value[0] === 20 && value[1] === 80) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Conversion filter</Text>
      <Text fw={500} size="sm" mb="lg">Conversion range (%)</Text>
      <RangeSlider
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={1}
        marks={marks}
        data-testid="conversion-range"
        mb="xl"
      />
      <Text c="dimmed" size="sm" mt="md">
        Selected: {value[0]}% - {value[1]}%
      </Text>
    </Card>
  );
}
