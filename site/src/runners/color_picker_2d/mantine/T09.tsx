'use client';

/**
 * color_picker_2d-mantine-T09: Fix invalid ColorInput value in a form
 *
 * Layout: form_section centered inside a larger "Badges" configuration form.
 * The target component is a Mantine ColorInput labeled "Badge background color".
 * The input is intentionally in an error state on load: it contains an invalid string (e.g., "not-a-color") and shows an inline error message like "Invalid color".
 * To make the error observable, fixOnBlur is set to false so the invalid value is preserved when the input loses focus.
 * Initial state: invalid value is present; there is no valid parsed color.
 * Distractors: other non-target form inputs include "Badge text" (TextInput) and "Badge radius" (Select).
 * Goal: enter a valid hex color #C5D899 into this same ColorInput.
 *
 * Success: Component value represents color RGBA(197, 216, 153, 1.0).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TextInput, Select, Stack } from '@mantine/core';
import { ColorInput } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { hexToRgba } from '../types';

const TARGET_COLOR: RGBA = { r: 197, g: 216, b: 153, a: 1.0 };

export default function T09({ onSuccess }: TaskComponentProps) {
  const [badgeText, setBadgeText] = useState('New');
  const [badgeRadius, setBadgeRadius] = useState<string | null>('sm');
  const [badgeBackground, setBadgeBackground] = useState('not-a-color');
  
  // Determine if current value is valid
  const isValidColor = /^#[0-9A-Fa-f]{6}$/.test(badgeBackground) || 
                       /^#[0-9A-Fa-f]{3}$/.test(badgeBackground) ||
                       /^rgb/.test(badgeBackground);

  useEffect(() => {
    if (!badgeBackground) return;
    
    const rgba = hexToRgba(badgeBackground);
    if (rgba && 
        rgba.r === TARGET_COLOR.r && 
        rgba.g === TARGET_COLOR.g && 
        rgba.b === TARGET_COLOR.b) {
      onSuccess();
    }
  }, [badgeBackground, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Badges</Text>
      
      <Stack gap="sm">
        <TextInput
          label="Badge text"
          value={badgeText}
          onChange={(e) => setBadgeText(e.currentTarget.value)}
        />
        
        <Select
          label="Badge radius"
          value={badgeRadius}
          onChange={setBadgeRadius}
          data={[
            { value: 'xs', label: 'Extra small' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]}
        />
        
        <ColorInput
          label="Badge background color"
          value={badgeBackground}
          onChange={setBadgeBackground}
          format="hex"
          fixOnBlur={false}
          error={!isValidColor ? 'Invalid color' : undefined}
          data-testid="badge-background-color"
        />
      </Stack>
      
      <Text size="xs" c="dimmed" mt="md">
        Fix the invalid value by entering #C5D899.
      </Text>
    </Card>
  );
}
