'use client';

/**
 * color_picker_2d-mantine-T06: Drag ColorPicker to set a specific RGBA
 *
 * Layout: isolated_card centered.
 * The card contains an inline Mantine ColorPicker configured with format='rgba' so the opacity slider is visible.
 * The UI shows the 2D color spectrum square (saturation/value), a hue slider, and an alpha slider. No preset swatches are rendered for this instance to encourage direct manipulation.
 * A live readout text below the picker shows the current value as an rgba(...) string.
 * Initial state: rgba(255, 255, 255, 1.0) (white, fully opaque).
 * The user must drag within the spectrum square and adjust hue/alpha to reach the target rgba(47, 119, 150, 0.70).
 *
 * Success: Component value represents color RGBA(47, 119, 150, 0.7) within tolerance.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, ColorPicker } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { isColorWithinTolerance, parseRgba } from '../types';

const TARGET_COLOR: RGBA = { r: 47, g: 119, b: 150, a: 0.7 };
const RGB_TOLERANCE = 10;
const ALPHA_TOLERANCE = 0.03;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('rgba(255, 255, 255, 1)');

  useEffect(() => {
    if (!value) return;
    
    const rgba = parseRgba(value);
    if (rgba && isColorWithinTolerance(rgba, TARGET_COLOR, RGB_TOLERANCE, ALPHA_TOLERANCE)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Panel Overlay</Text>
      
      <Text size="sm" c="dimmed" mb="md">Panel overlay: rgba(47, 119, 150, 0.70)</Text>
      
      <ColorPicker
        value={value}
        onChange={setValue}
        format="rgba"
        data-testid="panel-overlay"
      />
      
      <Text size="sm" mt="md" style={{ fontFamily: 'monospace' }}>
        Current: {value}
      </Text>
      
      <Text size="xs" c="dimmed" mt="md">
        Drag to adjust hue, saturation, brightness, and alpha.
      </Text>
    </Card>
  );
}
