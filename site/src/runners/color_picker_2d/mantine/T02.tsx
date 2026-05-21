'use client';

/**
 * color_picker_2d-mantine-T02: Pick Teal swatch in ColorInput
 *
 * Layout: isolated_card centered.
 * The card contains one Mantine ColorInput labeled "Accent color".
 * Configuration: swatches are enabled and shown in the dropdown; closeOnColorSwatchClick=true so the dropdown closes after a swatch click.
 * The swatches array includes common theme colors.
 * Initial state: Accent color is #868E96 (gray).
 * The user must open the dropdown and click the teal swatch (#12B886).
 *
 * Success: Component value represents color RGBA(18, 184, 134, 1.0).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { ColorInput } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { hexToRgba, COMMON_SWATCHES } from '../types';

const TARGET_COLOR: RGBA = { r: 18, g: 184, b: 134, a: 1.0 };

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#868E96');

  useEffect(() => {
    if (!value) return;
    
    const rgba = hexToRgba(value);
    if (rgba && 
        rgba.r === TARGET_COLOR.r && 
        rgba.g === TARGET_COLOR.g && 
        rgba.b === TARGET_COLOR.b) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Theme Settings</Text>
      
      <Text size="sm" c="dimmed" mb="md">Accent color (choose from swatches)</Text>
      
      <ColorInput
        label="Accent color"
        value={value}
        onChange={setValue}
        format="hex"
        swatches={COMMON_SWATCHES}
        closeOnColorSwatchClick
        data-testid="accent-color"
      />
      
      <Text size="xs" c="dimmed" mt="md">
        Select #12B886 (teal) from the swatches.
      </Text>
    </Card>
  );
}
