'use client';

/**
 * alpha_slider-mantine-T05: Match overlay opacity using Mantine ColorPicker
 *
 * A centered card titled "Card Overlay (ColorPicker)" uses Mantine ColorPicker in RGBA mode:
 * - The ColorPicker is rendered inline (not in a popover) so the saturation area, hue slider, and alpha slider are all visible.
 * - Because format is RGBA, the component shows a color preview (checkerboard) and includes an alpha slider.
 * - A separate fixed "Target overlay" preview swatch is shown to the right for visual matching.
 * Initial state:
 * - The base color is fixed (blue) and the starting alpha is 1.00 (fully opaque).
 * Distractors:
 * - The saturation area and hue slider are interactive and visually prominent, but success is based ONLY on alpha.
 *
 * Success: The card overlay alpha matches the Target overlay swatch (alpha=0.40). Alpha must be within ±0.02 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, ColorPicker, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const TARGET_ALPHA = 0.4;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [color, setColor] = useState('rgba(34, 139, 230, 1)');

  useEffect(() => {
    // Extract alpha from rgba string
    const match = color.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
    const alpha = match ? parseFloat(match[1]) : 1;

    if (isAlphaWithinTolerance(alpha, TARGET_ALPHA, 0.02)) {
      onSuccess();
    }
  }, [color, onSuccess]);

  const getTargetColor = () => {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${TARGET_ALPHA})`;
    }
    return `rgba(34, 139, 230, ${TARGET_ALPHA})`;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 480 }}>
      <Text fw={600} size="lg" mb="md">Card Overlay (ColorPicker)</Text>

      <Group align="flex-start" gap="xl">
        {/* ColorPicker */}
        <div>
          <ColorPicker
            format="rgba"
            value={color}
            onChange={setColor}
            data-testid="color-picker"
          />
        </div>

        {/* Target overlay preview */}
        <div>
          <Text size="sm" c="dimmed" mb="xs">Target overlay</Text>
          <div
            style={{
              width: 80,
              height: 80,
              backgroundImage: `
                linear-gradient(45deg, #ccc 25%, transparent 25%),
                linear-gradient(-45deg, #ccc 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #ccc 75%),
                linear-gradient(-45deg, transparent 75%, #ccc 75%)
              `,
              backgroundSize: '12px 12px',
              backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
              borderRadius: 8,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: getTargetColor(),
                borderRadius: 8,
              }}
            />
          </div>
        </div>
      </Group>
    </Card>
  );
}
