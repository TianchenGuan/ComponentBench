'use client';

/**
 * alpha_slider-mantine-T08: Match backdrop opacity to target (dark theme, no numeric readout)
 *
 * A dark theme page with a single centered card titled "Backdrop Transparency":
 * - Two large preview rectangles on a checkerboard: "Current" (live) and "Target" (fixed reference).
 * - A Mantine AlphaSlider (color fixed) sits below the previews.
 * - The UI is minimal: the numeric alpha/percent readout is not shown; only the previews provide feedback.
 * Initial state:
 * - Current alpha starts at 0.80, visibly darker than the Target.
 * Guidance:
 * - Visual-only matching against the Target preview.
 *
 * Success: The backdrop alpha matches the Target preview (alpha=0.42). Alpha must be within ±0.015 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, AlphaSlider, MantineProvider, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const BASE_COLOR = '#000000';
const TARGET_ALPHA = 0.42;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [alpha, setAlpha] = useState(0.8);

  useEffect(() => {
    if (isAlphaWithinTolerance(alpha, TARGET_ALPHA, 0.015)) {
      onSuccess();
    }
  }, [alpha, onSuccess]);

  const checkerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #555 25%, transparent 25%),
      linear-gradient(-45deg, #555 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #555 75%),
      linear-gradient(-45deg, transparent 75%, #555 75%)
    `,
    backgroundSize: '16px 16px',
    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
    backgroundColor: '#333',
  };

  return (
    <MantineProvider forceColorScheme="dark">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 420, background: '#1a1b1e' }}>
        <Text fw={600} size="lg" mb="md" c="white">Backdrop Transparency</Text>

        {/* Preview rectangles */}
        <Group mb="lg">
          {/* Current */}
          <div style={{ flex: 1 }}>
            <Text size="xs" c="dimmed" mb="xs">Current</Text>
            <div
              style={{
                width: '100%',
                height: 100,
                borderRadius: 8,
                position: 'relative',
                ...checkerboardStyle,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: `rgba(0, 0, 0, ${alpha})`,
                  borderRadius: 8,
                }}
              />
            </div>
          </div>

          {/* Target */}
          <div style={{ flex: 1 }}>
            <Text size="xs" c="dimmed" mb="xs">Target</Text>
            <div
              style={{
                width: '100%',
                height: 100,
                borderRadius: 8,
                position: 'relative',
                ...checkerboardStyle,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: `rgba(0, 0, 0, ${TARGET_ALPHA})`,
                  borderRadius: 8,
                }}
              />
            </div>
          </div>
        </Group>

        {/* AlphaSlider - no numeric readout */}
        <AlphaSlider
          color={BASE_COLOR}
          value={alpha}
          onChange={setAlpha}
          data-testid="backdrop-alpha-slider"
        />
      </Card>
    </MantineProvider>
  );
}
