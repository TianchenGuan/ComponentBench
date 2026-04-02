'use client';

/**
 * color_text_input-mantine-T09: Set HSLA string in dark theme Mantine ColorInput
 *
 * Layout: isolated_card anchored near the top-right of the viewport using Mantine dark theme.
 * Component: Mantine ColorInput labeled 'Selection color (hsla)' configured with format='hsla'.
 * The input shows a preview swatch; invalid formatting shows an error message.
 *
 * Initial state: hsla(215, 90%, 60%, 0.40).
 * Feedback: once valid, the preview swatch updates to the new color;
 * in dark theme, error and focus styles are subtler and lower-contrast.
 *
 * Success: Selection color parses to RGBA(0, 106, 255, 0.60) within alpha tolerance.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, parseHslString } from '../types';

const TARGET_RGBA = { r: 0, g: 106, b: 255, a: 0.6 };

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('hsla(215, 90%, 60%, 0.40)');
  const [hasCompleted, setHasCompleted] = useState(false);

  const parsedColor = parseHslString(value);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (parsedColor && isColorWithinTolerance(parsedColor, TARGET_RGBA, 0, 0.01)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [parsedColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        width: 400,
        backgroundColor: '#1a1b1e',
        borderColor: '#373a40',
      }}
    >
      <Text fw={600} size="lg" mb="md" c="white">Selection Settings</Text>
      
      <ColorInput
        label="Selection color (hsla)"
        description="Format: hsla(h, s%, l%, a)"
        value={value}
        onChange={setValue}
        format="hsla"
        styles={{
          label: { color: '#c1c2c5' },
          description: { color: '#909296' },
          input: {
            backgroundColor: '#25262b',
            borderColor: '#373a40',
            color: '#c1c2c5',
          },
        }}
        data-testid="selection-color-input"
      />
    </Card>
  );
}
