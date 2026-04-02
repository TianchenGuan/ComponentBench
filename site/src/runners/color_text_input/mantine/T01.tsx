'use client';

/**
 * color_text_input-mantine-T01: Set Accent color in Mantine ColorInput (HEX)
 *
 * Layout: isolated_card centered with one Mantine ColorInput labeled 'Accent color'.
 * Component: Mantine ColorInput with default hex format. The input shows a color preview
 * swatch in the left section and an eye-dropper icon button in the right section (not required).
 *
 * Initial state: Accent color is #ffffff.
 * Feedback: when the entered value is a valid color, the left preview swatch updates immediately;
 * invalid values show an error state under the input.
 *
 * Success: Accent color parses to RGBA(34, 139, 230, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, hexToRgba } from '../types';

const TARGET_RGBA = { r: 34, g: 139, b: 230, a: 1 };

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#ffffff');
  const [hasCompleted, setHasCompleted] = useState(false);

  const parsedColor = hexToRgba(value);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (parsedColor && isColorWithinTolerance(parsedColor, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [parsedColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Theme Settings</Text>
      
      <ColorInput
        label="Accent color"
        value={value}
        onChange={setValue}
        format="hex"
        data-testid="accent-color-input"
      />
    </Card>
  );
}
