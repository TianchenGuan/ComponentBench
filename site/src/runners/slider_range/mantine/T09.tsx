'use client';

/**
 * slider_range-mantine-T09: Set precise decimal range (scientific mode)
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Signal threshold". It contains one Mantine RangeSlider configured for decimal precision:
 * - Slider configuration: min=0, max=1000, step=1 (displayed as 0.000–1.000).
 * - Initial state: Selected starts at 200-800 (displayed as 0.200-0.800).
 * Above the slider, a "Reference" line shows the target endpoints as text: "Reference: 0.125 - 0.555".
 * Labels on thumbs appear during drag; a stable readout always shows the current Selected values with three decimals.
 * No Apply/Reset; changes are immediate.
 * 
 * Success: Target range is set to 0.125-0.555 (both thumbs), tolerance +/-0.010.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, RangeSlider, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([200, 800]);

  useEffect(() => {
    if (
      value[0] >= 115 && value[0] <= 135 &&
      value[1] >= 545 && value[1] <= 565
    ) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Signal threshold</Text>

      <Box
        mb="md"
        p="sm"
        style={{ background: '#f8f9fa', borderRadius: 4 }}
      >
        <Text size="sm" c="dimmed">
          Reference: <Text span fw={600}>0.125 - 0.555</Text>
        </Text>
      </Box>

      <RangeSlider
        value={value}
        onChange={setValue}
        min={0}
        max={1000}
        step={1}
        minRange={100}
        label={(val) => (val / 1000).toFixed(3)}
        data-testid="signal-threshold-range"
        mb="md"
      />
      <Text c="dimmed" size="sm">
        Selected: {(value[0] / 1000).toFixed(3)} - {(value[1] / 1000).toFixed(3)}
      </Text>
    </Card>
  );
}
