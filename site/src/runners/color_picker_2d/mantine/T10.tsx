'use client';

/**
 * color_picker_2d-mantine-T10: Dark compact: choose swatch with input disabled
 *
 * Layout: isolated_card centered, but rendered in dark theme with compact spacing.
 * The card contains one Mantine ColorInput labeled "Success badge color".
 * Configuration: disallowInput=true so the text field is read-only; the user must use the dropdown picker/swatches to change the value.
 * The dropdown shows a grid of swatches (including #82C91E) and also includes the 2D picker controls (withPicker=true), but swatches are the intended path.
 * Initial state: the color is #228BE6 (blue).
 * Distractors: the card also has a non-interactive preview of the badge and a "Show icon" checkbox.
 *
 * Success: Component value represents color RGBA(130, 201, 30, 1.0).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Badge, Checkbox, Stack } from '@mantine/core';
import { ColorInput } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { hexToRgba, COMMON_SWATCHES } from '../types';

const TARGET_COLOR: RGBA = { r: 130, g: 201, b: 30, a: 1.0 };

export default function T10({ onSuccess }: TaskComponentProps) {
  const [successColor, setSuccessColor] = useState('#228BE6');
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    if (!successColor) return;
    
    const rgba = hexToRgba(successColor);
    if (rgba && 
        rgba.r === TARGET_COLOR.r && 
        rgba.g === TARGET_COLOR.g && 
        rgba.b === TARGET_COLOR.b) {
      onSuccess();
    }
  }, [successColor, onSuccess]);

  return (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder 
      style={{ width: 360, background: '#1A1B1E' }}
    >
      <Text fw={600} size="md" mb="sm" c="white">Badge Settings</Text>
      
      <Text size="xs" c="dimmed" mb="sm">Success badge color: #82C91E (choose, typing disabled)</Text>
      
      <Stack gap="xs">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text size="sm" c="white">Preview:</Text>
          <Badge color={successColor}>Success</Badge>
        </div>
        
        <Checkbox
          label="Show icon"
          checked={showIcon}
          onChange={(e) => setShowIcon(e.currentTarget.checked)}
          styles={{ label: { color: 'white' } }}
          size="sm"
        />
        
        <ColorInput
          label="Success badge color"
          value={successColor}
          onChange={setSuccessColor}
          format="hex"
          swatches={COMMON_SWATCHES}
          disallowInput
          withPicker
          size="sm"
          styles={{
            label: { color: 'white' },
          }}
          data-testid="success-badge-color"
        />
      </Stack>
      
      <Text size="xs" c="dimmed" mt="sm">
        Select #82C91E from the dropdown swatches.
      </Text>
    </Card>
  );
}
