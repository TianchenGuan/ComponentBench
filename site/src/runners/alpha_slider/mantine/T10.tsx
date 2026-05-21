'use client';

/**
 * alpha_slider-mantine-T10: Set small corner tooltip tint to 58%
 *
 * A small card is anchored near the top-right corner of the viewport:
 * - Title: "Tooltip Tint"
 * - A compact Mantine AlphaSlider (xs styling) controls the tooltip tint alpha.
 * - A small text readout shows "Opacity: XX%" but the space is tight and the slider thumb is small.
 * Initial state:
 * - Opacity starts at 90%.
 * No other interactive controls are present.
 *
 * Success: The tooltip tint alpha is set to 0.58 (58% opacity). Alpha must be within ±0.01 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, AlphaSlider } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const BASE_COLOR = '#343a40';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [alpha, setAlpha] = useState(0.9);

  useEffect(() => {
    if (isAlphaWithinTolerance(alpha, 0.58, 0.01)) {
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
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 260 }}>
      <Text fw={600} size="md" mb="sm">Tooltip Tint</Text>

      {/* Tooltip preview */}
      <div
        style={{
          display: 'inline-block',
          padding: '6px 12px',
          backgroundColor: hexToRgba(BASE_COLOR, alpha),
          color: '#fff',
          borderRadius: 4,
          fontSize: 12,
          marginBottom: 12,
        }}
      >
        Tooltip preview
      </div>

      {/* Compact slider */}
      <AlphaSlider
        color={BASE_COLOR}
        value={alpha}
        onChange={setAlpha}
        size="xs"
        data-testid="tooltip-alpha-slider"
      />

      <Text size="xs" c="dimmed" mt="xs">
        Opacity: {Math.round(alpha * 100)}%
      </Text>
    </Card>
  );
}
