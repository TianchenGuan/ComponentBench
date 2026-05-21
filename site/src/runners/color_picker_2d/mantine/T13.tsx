'use client';

/**
 * color_picker_2d-mantine-T13: Enter 8-digit HEXA value
 *
 * Layout: isolated_card centered.
 * The card contains one Mantine ColorInput labeled "Tooltip background".
 * Configuration: format='hexa' (8-digit hex including alpha). The input placeholder shows an example like "#RRGGBBAA".
 * fixOnBlur=true so if the user leaves an invalid hexa string, it reverts to the last valid value.
 * Initial state: #1C7ED6FF (fully opaque).
 * Goal: change the value to #1C7ED659 (same RGB as #1C7ED6 but with alpha encoded by the last two hex digits).
 * The dropdown picker is available but not required; typing the formatted value is the intended path.
 *
 * Success: Component value represents color RGBA(28, 126, 214, 0.34901960784313724) within tolerance.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { ColorInput } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { isColorWithinTolerance, hexToRgba } from '../types';

// 0x59 = 89 -> 89/255 ≈ 0.349
const TARGET_COLOR: RGBA = { r: 28, g: 126, b: 214, a: 89 / 255 };
const RGB_TOLERANCE = 0;
const ALPHA_TOLERANCE = 0.005;

export default function T13({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#1C7ED6FF');

  useEffect(() => {
    if (!value || value.length < 9) return; // Need 8-digit hexa + #
    
    const rgba = hexToRgba(value);
    if (rgba && isColorWithinTolerance(rgba, TARGET_COLOR, RGB_TOLERANCE, ALPHA_TOLERANCE)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Tooltip Settings</Text>
      
      <Text size="sm" c="dimmed" mb="md">Tooltip background (hexa): #1C7ED659</Text>
      
      <ColorInput
        label="Tooltip background"
        placeholder="#RRGGBBAA"
        value={value}
        onChange={setValue}
        format="hexa"
        fixOnBlur
        withPicker
        data-testid="tooltip-background"
      />
      
      <Text size="xs" c="dimmed" mt="md">
        Enter the 8-digit hex value #1C7ED659 (includes alpha).
      </Text>
    </Card>
  );
}
