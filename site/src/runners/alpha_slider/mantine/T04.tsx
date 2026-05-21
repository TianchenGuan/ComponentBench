'use client';

/**
 * alpha_slider-mantine-T04: Enter alpha as a decimal (0.75)
 *
 * A centered card titled "RGBA Alpha" provides two linked sub-controls for the same alpha value:
 * - Mantine AlphaSlider (value in range 0.00–1.00).
 * - Mantine NumberInput labeled "Alpha (0–1)" with step 0.01 and 2-decimal formatting.
 * Behavior:
 * - Changing either control updates the other immediately after commit (Enter or blur for the NumberInput).
 * - The current value is shown as "Alpha: 0.xx".
 * Initial state:
 * - Alpha starts at 0.40.
 *
 * Success: The alpha value is set to 0.75. Alpha must be within ±0.01 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, AlphaSlider, NumberInput, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const BASE_COLOR = '#228be6';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [alpha, setAlpha] = useState(0.4);

  useEffect(() => {
    if (isAlphaWithinTolerance(alpha, 0.75, 0.01)) {
      onSuccess();
    }
  }, [alpha, onSuccess]);

  const handleInputChange = (value: string | number) => {
    const numVal = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numVal)) {
      setAlpha(Math.max(0, Math.min(1, numVal)));
    }
  };

  const hexToRgba = (hex: string, a: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 420 }}>
      <Text fw={600} size="lg" mb="md">RGBA Alpha</Text>

      {/* Preview */}
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
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
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
        Alpha: {alpha.toFixed(2)}
      </Text>

      {/* Slider + NumberInput row */}
      <Group align="flex-end">
        <div style={{ flex: 1 }}>
          <AlphaSlider
            color={BASE_COLOR}
            value={alpha}
            onChange={setAlpha}
            data-testid="alpha-slider"
          />
        </div>
        <NumberInput
          label="Alpha (0–1)"
          value={alpha}
          onChange={handleInputChange}
          min={0}
          max={1}
          step={0.01}
          decimalScale={2}
          fixedDecimalScale
          w={100}
          size="sm"
          data-testid="alpha-input"
        />
      </Group>
    </Card>
  );
}
