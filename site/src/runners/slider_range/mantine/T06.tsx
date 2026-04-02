'use client';

/**
 * slider_range-mantine-T06: Adjust small slider anchored top-left
 * 
 * Layout: isolated_card anchored near the top-left of the viewport.
 * The RangeSlider is rendered in a small size (xs), making the track thinner and the thumbs smaller than default.
 * The slider is labeled "Opacity window" and uses decimal values:
 * - min=0, max=1, step=0.01.
 * - Initial state: 0.10-0.90 with readout "Selected: 0.10 - 0.90".
 * Labels appear during drag; no Apply/Reset.
 * The task is intended to be completed by dragging the small thumbs to the specified decimals.
 * 
 * Success: Target range is set to 0.3-0.6 ratio (both thumbs), tolerance +/-0.01.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, RangeSlider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([10, 90]);

  useEffect(() => {
    if (
      value[0] >= 29 && value[0] <= 31 &&
      value[1] >= 59 && value[1] <= 61
    ) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 360 }}>
      <Text fw={600} size="md" mb="md">Opacity window</Text>
      <RangeSlider
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={1}
        size="sm"
        thumbSize={16}
        label={(val) => (val / 100).toFixed(2)}
        data-testid="opacity-range"
        mb="sm"
        styles={{ root: { padding: '0 8px' } }}
      />
      <Text c="dimmed" size="sm">
        Selected: {(value[0] / 100).toFixed(2)} - {(value[1] / 100).toFixed(2)}
      </Text>
    </Card>
  );
}
