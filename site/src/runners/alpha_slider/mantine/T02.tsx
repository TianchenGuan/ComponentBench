'use client';

/**
 * alpha_slider-mantine-T02: Drag watermark opacity to 20% (large AlphaSlider)
 *
 * A centered card titled "Watermark Opacity" uses a large Mantine AlphaSlider for easy dragging:
 * - The AlphaSlider is rendered with a larger size (lg/xl styling) and a wide track.
 * - A preview rectangle labeled "Watermark sample" sits above it on a checkerboard background.
 * - A text readout shows "Opacity: XX%".
 * Initial state:
 * - Opacity starts at 100%.
 *
 * Success: The watermark alpha is set to 0.20 (20% opacity). Alpha must be within ±0.02 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, AlphaSlider } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const BASE_COLOR = '#868e96';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [alpha, setAlpha] = useState(1);

  useEffect(() => {
    if (isAlphaWithinTolerance(alpha, 0.2, 0.02)) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Watermark Opacity</Text>

      {/* Preview */}
      <Text size="sm" c="dimmed" mb="xs">Watermark sample</Text>
      <div
        style={{
          width: '100%',
          height: 100,
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: hexToRgba(BASE_COLOR, alpha),
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          WATERMARK
        </Text>
      </div>

      {/* Value display */}
      <Text size="sm" mb="md">
        Opacity: {Math.round(alpha * 100)}%
      </Text>

      {/* Large AlphaSlider */}
      <AlphaSlider
        color={BASE_COLOR}
        value={alpha}
        onChange={setAlpha}
        size="xl"
        data-testid="alpha-slider"
      />
    </Card>
  );
}
