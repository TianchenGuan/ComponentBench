'use client';

/**
 * alpha_slider-mantine-v2-T12: Drawer AlphaSlider: Watermark only
 *
 * Watermark tint alpha 0.37 ±0.03; Tooltip tint unchanged; Save overlay drawer.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Text, Stack, AlphaSlider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

const WATERMARK_HEX = '#7c3aed';
const TOOLTIP_HEX = '#0ca678';

function hexToRgba(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function T12({ onSuccess }: TaskComponentProps) {
  const initialTooltip = 0.85;
  const [open, setOpen] = useState(false);
  const [dW, setDW] = useState(1);
  const [dT, setDT] = useState(initialTooltip);
  const [cW, setCW] = useState(1);
  const [cT, setCT] = useState(initialTooltip);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      isAlphaWithinTolerance(cW, 0.37, 0.03) &&
      Math.abs(cT - initialTooltip) < 0.001
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [cW, cT, initialTooltip, onSuccess]);

  const save = () => {
    setCW(dW);
    setCT(dT);
  };

  const preview = (hex: string, a: number, label: string) => (
    <div>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <div
        style={{
          marginTop: 6,
          height: 64,
          borderRadius: 8,
          position: 'relative',
          backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
          backgroundSize: '12px 12px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 8,
            backgroundColor: hexToRgba(hex, a),
          }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ padding: 8 }}>
      <Button onClick={() => setOpen(true)}>Open overlay drawer</Button>
      <Drawer opened={open} onClose={() => setOpen(false)} title="Overlay drawer" position="right" size="md">
        <Stack gap="lg">
          <div>
            {preview(WATERMARK_HEX, dW, 'Watermark tint')}
            <Text size="sm" fw={500} mt="md">
              Watermark tint
            </Text>
            <AlphaSlider mt="sm" color={WATERMARK_HEX} value={dW} onChange={setDW} />
          </div>
          <div>
            {preview(TOOLTIP_HEX, dT, 'Tooltip tint')}
            <Text size="sm" fw={500} mt="md">
              Tooltip tint
            </Text>
            <AlphaSlider mt="sm" color={TOOLTIP_HEX} value={dT} onChange={setDT} />
          </div>
          <Button onClick={save}>Save overlay drawer</Button>
        </Stack>
      </Drawer>
    </div>
  );
}
