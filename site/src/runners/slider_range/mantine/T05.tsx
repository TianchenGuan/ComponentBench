'use client';

/**
 * slider_range-mantine-T05: Match the highlighted acceptable range (visual)
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Quality gate". It contains:
 * - A thin reference bar at the top with a highlighted segment labeled "Acceptable" (no numeric endpoints printed).
 * - One Mantine RangeSlider underneath, min=0, max=100, step=1.
 * Initial state: slider is at 0-100 and the readout shows "Selected: 0 - 100".
 * The readout updates live as the slider changes, providing a way to verify after visually aligning to the highlighted band.
 * 
 * Success: Target range is set to 15-45 pts (both thumbs), tolerance +/-2.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, RangeSlider, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    // Target: 15-45 with tolerance +/-2
    if (value[0] >= 13 && value[0] <= 17 && value[1] >= 43 && value[1] <= 47) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Quality gate</Text>

      {/* Visual reference bar */}
      <Box mb="lg">
        <Box
          style={{
            position: 'relative',
            height: 24,
            background: '#e9ecef',
            borderRadius: 4,
          }}
        >
          {/* Highlighted acceptable segment at 15%-45% */}
          <Box
            style={{
              position: 'absolute',
              left: '15%',
              width: '30%',
              height: '100%',
              background: '#228be6',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text size="xs" c="white" fw={500}>Acceptable</Text>
          </Box>
        </Box>
      </Box>

      <RangeSlider
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={1}
        data-testid="quality-gate-range"
        mb="md"
      />
      <Text c="dimmed" size="sm">
        Selected: {value[0]} - {value[1]}
      </Text>
    </Card>
  );
}
