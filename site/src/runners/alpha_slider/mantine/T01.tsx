'use client';

/**
 * alpha_slider-mantine-T01: Set button opacity to 50% (AlphaSlider)
 *
 * A centered card titled "Primary Button Opacity" uses Mantine's standalone AlphaSlider:
 * - A checkerboard preview swatch labeled "Button background" shows the current transparency.
 * - Under the preview is a Mantine AlphaSlider (color is fixed to a blue base, e.g., #1c7ed6).
 * - A text line above the slider displays the current value as both: "Alpha: 1.00" and "Opacity: 100%".
 * Initial state:
 * - Alpha starts at 1.00 (fully opaque).
 * Feedback:
 * - Moving the slider updates the preview swatch and the text value immediately.
 *
 * Success: The button background alpha is set to 0.50 (50% opacity). Alpha must be within ±0.02 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, AlphaSlider } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const BASE_COLOR = '#1c7ed6';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [alpha, setAlpha] = useState(1);

  useEffect(() => {
    if (isAlphaWithinTolerance(alpha, 0.5, 0.02)) {
      onSuccess();
    }
  }, [alpha, onSuccess]);

  const hexToRgba = (hex: string, a: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Primary Button Opacity</Text>

      {/* Preview swatch */}
      <Text size="sm" c="dimmed" mb="xs">Button background</Text>
      <div
        style={{
          width: '100%',
          height: 80,
          marginBottom: 16,
          backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          borderRadius: 8,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: hexToRgba(BASE_COLOR, alpha),
            borderRadius: 8,
          }}
        />
      </div>

      {/* Value display */}
      <Text size="sm" mb="md">
        Alpha: {alpha.toFixed(2)} | Opacity: {Math.round(alpha * 100)}%
      </Text>

      {/* AlphaSlider */}
      <AlphaSlider
        color={BASE_COLOR}
        value={alpha}
        onChange={setAlpha}
        data-testid="alpha-slider"
      />
    </Card>
  );
}
