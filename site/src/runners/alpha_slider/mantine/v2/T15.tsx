'use client';

/**
 * alpha_slider-mantine-v2-T15: Nested scroll: map halo opacity below fold
 *
 * Map halo AlphaSlider 0.40 ±0.03; Blur unchanged; Save map effects.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Text, Stack, AlphaSlider, Button, Slider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

const HALO_COLOR = '#15aabf';
const INITIAL_BLUR = 42;

function hexToRgba(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function T15({ onSuccess }: TaskComponentProps) {
  const [dHalo, setDHalo] = useState(1);
  const [dBlur, setDBlur] = useState(INITIAL_BLUR);
  const [cHalo, setCHalo] = useState(1);
  const [cBlur, setCBlur] = useState(INITIAL_BLUR);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (isAlphaWithinTolerance(cHalo, 0.4, 0.03) && cBlur === INITIAL_BLUR) {
      successFired.current = true;
      onSuccess();
    }
  }, [cHalo, cBlur, onSuccess]);

  const save = () => {
    setCHalo(dHalo);
    setCBlur(dBlur);
  };

  return (
    <div
      style={{
        padding: 8,
        width: 320,
        maxHeight: 300,
        overflow: 'auto',
        border: '1px solid var(--mantine-color-gray-4)',
        borderRadius: 8,
      }}
    >
      <Text fw={600}>Map settings</Text>
      <Text size="sm" c="dimmed" mt={4}>
        Scroll for map effects
      </Text>
      <div style={{ height: 320 }} />
      <Text fw={500} mt="md">
        Map effects
      </Text>
      <Stack gap="md" mt="sm">
        <div>
          <Text size="sm" c="dimmed">
            Blur
          </Text>
          <Slider value={dBlur} onChange={setDBlur} min={10} max={80} mb={4} />
        </div>
        <div>
          <Text size="sm" mb={6}>
            Map halo opacity
          </Text>
          <div
            style={{
              height: 48,
              borderRadius: 8,
              marginBottom: 8,
              position: 'relative',
              backgroundImage: `
                linear-gradient(45deg, #ccc 25%, transparent 25%),
                linear-gradient(-45deg, #ccc 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #ccc 75%),
                linear-gradient(-45deg, transparent 75%, #ccc 75%)
              `,
              backgroundSize: '10px 10px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 8,
                backgroundColor: hexToRgba(HALO_COLOR, dHalo),
              }}
            />
          </div>
          <AlphaSlider color={HALO_COLOR} value={dHalo} onChange={setDHalo} />
        </div>
        <Button onClick={save}>Save map effects</Button>
      </Stack>
    </div>
  );
}
