'use client';

/**
 * slider_range-mantine-T07: Set range with a required minimum width (minRange)
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Bandwidth allocation". It contains one Mantine RangeSlider with constraints:
 * - Slider configuration: min=0, max=100, step=1, minRange=20 (thumbs must stay at least 20 units apart), pushOnOverlap=false.
 * - Initial state: 10-40 (width 30) with readout "Selected: 10 - 40".
 * A helper line reads "Minimum width: 20" to explain the constraint.
 * No Apply/Reset; changes are immediate.
 * Because pushOnOverlap is disabled, the thumbs will not push each other when they meet the minRange boundary.
 * 
 * Success: Target range is set to 30-50 units (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, RangeSlider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([10, 40]);

  useEffect(() => {
    if (value[0] === 30 && value[1] === 50) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Bandwidth allocation</Text>
      <Text fw={500} size="sm" mb="xs">Bandwidth allocation</Text>
      <Text c="dimmed" size="xs" mb="md">Minimum width: 20</Text>
      <RangeSlider
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={1}
        minRange={20}
        data-testid="bandwidth-range"
        mb="md"
      />
      <Text c="dimmed" size="sm">
        Selected: {value[0]} - {value[1]}
      </Text>
    </Card>
  );
}
