'use client';

/**
 * alpha_slider-mantine-T03: Reset badge opacity to 100%
 *
 * A centered card titled "Badge Transparency" contains:
 * - A checkerboard preview chip showing the current badge background.
 * - A Mantine AlphaSlider controlling the badge alpha.
 * - A small button labeled "Reset" aligned to the right of the slider row.
 * Initial state:
 * - Badge alpha starts at 0.65 (65% opacity), so the badge looks slightly transparent.
 * Behavior:
 * - Clicking "Reset" sets alpha back to 1.00 immediately and updates the preview and value text.
 *
 * Success: The badge alpha is set to 1.00 (100% opacity). Alpha must be within ±0.005 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, AlphaSlider, Button, Group, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const BASE_COLOR = '#fa5252';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [alpha, setAlpha] = useState(0.65);

  useEffect(() => {
    if (isAlphaWithinTolerance(alpha, 1.0, 0.005)) {
      onSuccess();
    }
  }, [alpha, onSuccess]);

  const handleReset = () => {
    setAlpha(1);
  };

  const hexToRgba = (hex: string, a: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Badge Transparency</Text>

      {/* Preview chip on checkerboard */}
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Badge
          size="lg"
          style={{ backgroundColor: hexToRgba(BASE_COLOR, alpha) }}
        >
          Badge
        </Badge>
      </div>

      {/* Value display */}
      <Text size="sm" mb="md">
        Alpha: {alpha.toFixed(2)} ({Math.round(alpha * 100)}%)
      </Text>

      {/* Slider row with reset button */}
      <Group align="flex-end">
        <div style={{ flex: 1 }}>
          <AlphaSlider
            color={BASE_COLOR}
            value={alpha}
            onChange={setAlpha}
            data-testid="alpha-slider"
          />
        </div>
        <Button 
          variant="subtle" 
          size="sm" 
          onClick={handleReset}
          data-testid="mantine-reset-alpha"
        >
          Reset
        </Button>
      </Group>
    </Card>
  );
}
