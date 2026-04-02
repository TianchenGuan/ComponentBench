'use client';

/**
 * color_picker_2d-mantine-T01: Type Brand color in ColorInput
 *
 * Layout: isolated_card centered (card titled "Brand settings").
 * The target component is a Mantine ColorInput labeled "Brand color".
 * ColorInput details: left section shows the current color swatch; right section includes an optional eye dropper icon (present but not required).
 * Format: hex. Free typing is allowed (disallowInput=false) and the dropdown picker is enabled (withPicker=true), but typing is the simplest path.
 * Initial state: the input is empty and shows a placeholder like "Enter hex color".
 * No other ColorInput/ColorPicker components exist on the page.
 *
 * Success: Component value represents color RGBA(34, 139, 230, 1.0).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { ColorInput } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { hexToRgba } from '../types';

const TARGET_COLOR: RGBA = { r: 34, g: 139, b: 230, a: 1.0 };

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

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
      <Text fw={600} size="lg" mb="md">Brand settings</Text>
      
      <Text size="sm" c="dimmed" mb="md">Brand color (hex)</Text>
      
      <ColorInput
        label="Brand color"
        placeholder="Enter hex color"
        value={value}
        onChange={setValue}
        format="hex"
        withPicker
        withEyeDropper
        data-testid="brand-color"
      />
      
      <Text size="xs" c="dimmed" mt="md">
        Enter #228BE6 to complete.
      </Text>
    </Card>
  );
}
