'use client';

/**
 * alpha_slider-mantine-T06: Expand advanced section and set watermark opacity to 55%
 *
 * A form section titled "Image watermark" includes an accordion for advanced options:
 * - Above the accordion are basic fields (TextInput "Watermark text", Select "Position") as distractors.
 * - An accordion item labeled "Advanced transparency" is collapsed by default.
 * - Inside the accordion content is the target Mantine AlphaSlider labeled "Watermark opacity" and a checkerboard preview.
 * Initial state:
 * - Watermark alpha starts at 1.00.
 * Interaction requirement:
 * - The AlphaSlider is not visible until the accordion is expanded.
 *
 * Success: The watermark opacity alpha is set to 0.55 (55%). Alpha must be within ±0.02 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, AlphaSlider, TextInput, Select, Accordion } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const BASE_COLOR = '#495057';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [alpha, setAlpha] = useState(1);
  const [watermarkText, setWatermarkText] = useState('© Company');
  const [position, setPosition] = useState<string | null>('bottom-right');

  useEffect(() => {
    if (isAlphaWithinTolerance(alpha, 0.55, 0.02)) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 420 }}>
      <Text fw={600} size="lg" mb="md">Image watermark</Text>

      {/* Basic fields (distractors) */}
      <TextInput
        label="Watermark text"
        value={watermarkText}
        onChange={(e) => setWatermarkText(e.target.value)}
        mb="md"
      />

      <Select
        label="Position"
        value={position}
        onChange={setPosition}
        data={[
          { value: 'top-left', label: 'Top Left' },
          { value: 'top-right', label: 'Top Right' },
          { value: 'bottom-left', label: 'Bottom Left' },
          { value: 'bottom-right', label: 'Bottom Right' },
          { value: 'center', label: 'Center' },
        ]}
        mb="md"
      />

      {/* Accordion with target control */}
      <Accordion defaultValue="">
        <Accordion.Item value="advanced">
          <Accordion.Control>Advanced transparency</Accordion.Control>
          <Accordion.Panel>
            {/* Preview */}
            <div
              style={{
                width: '100%',
                height: 60,
                marginBottom: 12,
                backgroundImage: `
                  linear-gradient(45deg, #ccc 25%, transparent 25%),
                  linear-gradient(-45deg, #ccc 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #ccc 75%),
                  linear-gradient(-45deg, transparent 75%, #ccc 75%)
                `,
                backgroundSize: '12px 12px',
                backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: hexToRgba(BASE_COLOR, alpha),
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {watermarkText}
              </Text>
            </div>

            <Text size="sm" mb="xs">Watermark opacity</Text>
            <AlphaSlider
              color={BASE_COLOR}
              value={alpha}
              onChange={setAlpha}
              data-testid="watermark-alpha-slider"
            />
            <Text size="xs" c="dimmed" mt="xs">
              {Math.round(alpha * 100)}%
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
