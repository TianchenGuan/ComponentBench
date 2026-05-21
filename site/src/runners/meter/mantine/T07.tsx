'use client';

/**
 * meter-mantine-T07: Set vertical Temperature meter to 75% (Mantine, dark)
 *
 * Setup Description:
 * A dark-themed page shows a small card near the bottom-left containing a vertical meter labeled "Temperature".
 * - Theme: dark.
 * - Layout: isolated_card; placement bottom_left.
 * - Spacing/scale: comfortable spacing, default scale; the meter is vertical and about 200px tall.
 * - Component: Mantine Progress in vertical orientation (scalar percent).
 * - Instances: 1.
 * - Interaction: clicking on the vertical bar sets the value based on click height (bottom=0%, top=100%).
 * - Observability: a small numeric label under the bar shows the current value (e.g., "62%").
 * - Initial state: 30%.
 * - Distractors: none.
 * - Feedback: immediate fill change.
 *
 * Success: Temperature meter value is 75% (±2 percentage points).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Stack, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(30);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(value - 75) <= 2 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    // Invert: top = 100%, bottom = 0%
    const percent = Math.round((1 - y / rect.height) * 100);
    setValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 150 }}>
      <Stack gap="md" align="center">
        <Text fw={600} size="sm">Temperature</Text>
        
        <div
          onClick={handleClick}
          style={{ 
            width: 24, 
            height: 200, 
            background: '#e9ecef', 
            borderRadius: 4,
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          data-testid="mantine-meter-temperature"
          data-meter-value={value}
          data-orientation="vertical"
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Temperature"
        >
          <Box
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${value}%`,
              background: '#228be6',
              borderRadius: 4,
              transition: 'height 0.1s ease',
            }}
          />
        </div>

        <Text size="sm" c="dimmed">{value}%</Text>
      </Stack>
    </Card>
  );
}
