'use client';

/**
 * color_text_input-mantine-T08: Recover from invalid value with fixOnBlur=false (Mantine)
 *
 * Layout: isolated_card centered.
 * Component: Mantine ColorInput labeled 'Status indicator color' configured with fixOnBlur={false},
 * meaning invalid input is preserved on blur instead of reverting.
 *
 * Initial state: the input currently contains an invalid partial value '#12' and the component
 * shows an error message under the field.
 *
 * Feedback: the error remains until the value becomes a valid color string;
 * once valid, the preview swatch updates and the error disappears.
 *
 * Success: Status indicator color parses to RGBA(18, 184, 134, 1.0) and the component is no longer in error.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, hexToRgba, isValidHex6 } from '../types';

const TARGET_RGBA = { r: 18, g: 184, b: 134, a: 1 };

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#12'); // Invalid initial value
  const [hasCompleted, setHasCompleted] = useState(false);

  const isValid = isValidHex6(value);
  const parsedColor = hexToRgba(value);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (isValid && parsedColor && isColorWithinTolerance(parsedColor, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [isValid, parsedColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Status Indicator</Text>
      
      <ColorInput
        label="Status indicator color"
        description={!isValid ? 'Please enter a valid 6-digit hex color' : undefined}
        value={value}
        onChange={setValue}
        format="hex"
        fixOnBlur={false}
        error={!isValid && value.length > 0 ? 'Invalid hex color' : undefined}
        data-testid="status-indicator-color-input"
      />
    </Card>
  );
}
