'use client';

/**
 * color_picker_2d-mantine-T07: Adjust alpha slider to 0.55
 *
 * Layout: isolated_card centered.
 * An inline Mantine ColorPicker is configured with format='rgba' and starts at rgba(28, 126, 214, 1.0) (blue, fully opaque).
 * The hue/spectrum controls are available, but the intended change is only to the alpha slider.
 * A small label next to the alpha slider reads "Opacity" and updates a numeric readout in the displayed rgba(...) string below.
 * Initial state: alpha = 1.0.
 * The user must reduce opacity to 0.55 while keeping the RGB channels unchanged.
 *
 * Success: Component value represents color RGBA(28, 126, 214, 0.55) within tolerance.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, ColorPicker } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { isColorWithinTolerance, parseRgba } from '../types';

const TARGET_COLOR: RGBA = { r: 28, g: 126, b: 214, a: 0.55 };
const RGB_TOLERANCE = 6;
const ALPHA_TOLERANCE = 0.02;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('rgba(28, 126, 214, 1)');

  useEffect(() => {
    if (!value) return;
    
    const rgba = parseRgba(value);
    if (rgba && isColorWithinTolerance(rgba, TARGET_COLOR, RGB_TOLERANCE, ALPHA_TOLERANCE)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Tooltip Settings</Text>
      
      <Text size="sm" c="dimmed" mb="md">Tooltip highlight: rgba(28, 126, 214, 0.55)</Text>
      
      <ColorPicker
        value={value}
        onChange={setValue}
        format="rgba"
        data-testid="tooltip-highlight"
      />
      
      <div style={{ marginTop: 12 }}>
        <Text size="xs" c="dimmed">Opacity</Text>
        <Text size="sm" style={{ fontFamily: 'monospace' }}>
          Current: {value}
        </Text>
      </div>
      
      <Text size="xs" c="dimmed" mt="md">
        Adjust only the alpha slider to ~0.55.
      </Text>
    </Card>
  );
}
