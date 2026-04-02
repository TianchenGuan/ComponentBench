'use client';

/**
 * color_picker_2d-mantine-T05: ColorPicker swatches-only: set Tag color to orange
 *
 * Layout: isolated_card centered.
 * The card renders a Mantine ColorPicker inline (not a dropdown). It is configured in a "swatches-only" mode: withPicker=false so the 2D spectrum is hidden and only swatches are shown.
 * Swatches are displayed in a small grid (default 7 per row) including #FD7E14.
 * Initial state: Tag color is #868E96.
 * The user completes the task by clicking the #FD7E14 swatch in the grid.
 * No other color controls exist.
 *
 * Success: Component value represents color RGBA(253, 126, 20, 1.0).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, ColorPicker } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { hexToRgba, COMMON_SWATCHES } from '../types';

const TARGET_COLOR: RGBA = { r: 253, g: 126, b: 20, a: 1.0 };

export default function T05({ onSuccess }: TaskComponentProps) {
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
      <Text fw={600} size="lg" mb="md">Tag Settings</Text>
      
      <Text size="sm" c="dimmed" mb="md">Tag color (swatches only): #FD7E14</Text>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <Text size="sm">Current color:</Text>
        <div 
          style={{ 
            width: 32, 
            height: 32, 
            backgroundColor: value, 
            borderRadius: 4, 
            border: '1px solid #dee2e6' 
          }} 
        />
      </div>
      
      <ColorPicker
        value={value}
        onChange={setValue}
        withPicker={false}
        swatches={COMMON_SWATCHES}
        swatchesPerRow={7}
        data-testid="tag-color"
      />
      
      <Text size="xs" c="dimmed" mt="md">
        Click the orange swatch (#FD7E14) to complete.
      </Text>
    </Card>
  );
}
