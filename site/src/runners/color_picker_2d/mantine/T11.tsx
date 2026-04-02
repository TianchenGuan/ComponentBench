'use client';

/**
 * color_picker_2d-mantine-T11: Match reference swatch with small ColorPicker
 *
 * Layout: isolated_card centered.
 * The card shows an inline Mantine ColorPicker labeled "Icon highlight color" alongside a non-interactive "Sample" swatch.
 * Guidance: visual only — the sample swatch has no hex/RGB text, only a colored square.
 * Scale: the ColorPicker is rendered at a small size (size='xs'), making the spectrum square and slider thumbs smaller.
 * Preset swatches are not shown for the picker to encourage matching via the spectrum square and hue slider.
 * Initial state: the selected color is a neutral gray; it does not match the sample.
 *
 * Success: Selected color matches the on-page reference swatch 'sample-swatch' within tolerance.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, ColorPicker } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { isColorWithinTolerance, hexToRgba } from '../types';

// Reference color (hidden from user - only shown visually)
const REFERENCE_COLOR: RGBA = { r: 233, g: 100, b: 121, a: 1.0 }; // #E96479 - Coral Pink
const RGB_TOLERANCE = 6;
const ALPHA_TOLERANCE = 0.03;

export default function T11({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#868E96');
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current || !value) return;
    
    const rgba = hexToRgba(value);
    if (rgba && isColorWithinTolerance(rgba, REFERENCE_COLOR, RGB_TOLERANCE, ALPHA_TOLERANCE)) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Icon Settings</Text>
      
      <Text size="sm" c="dimmed" mb="md">Icon highlight color — match the sample</Text>
      
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div>
          <Text size="xs" c="dimmed" mb="xs">Icon highlight color</Text>
          <ColorPicker
            value={value}
            onChange={setValue}
            size="xs"
            data-testid="icon-highlight-color"
          />
        </div>
        
        <div>
          <Text size="xs" c="dimmed" mb="xs">Sample</Text>
          <div 
            data-testid="sample-swatch"
            style={{ 
              width: 48, 
              height: 48, 
              backgroundColor: `rgba(${REFERENCE_COLOR.r}, ${REFERENCE_COLOR.g}, ${REFERENCE_COLOR.b}, ${REFERENCE_COLOR.a})`,
              borderRadius: 4,
              border: '1px solid #dee2e6',
            }} 
          />
        </div>
      </div>
      
      <Text size="xs" c="dimmed" mt="md">
        Adjust the color picker to match the sample swatch.
      </Text>
    </Card>
  );
}
