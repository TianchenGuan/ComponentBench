'use client';

/**
 * color_text_input-mantine-T05: Clear Mantine ColorInput using an in-field ClearButton
 *
 * Layout: isolated_card centered with one ColorInput labeled 'Custom color'.
 * Component: Mantine ColorInput (format='hex') with a custom rightSection that shows
 * an Input.ClearButton when the field is non-empty.
 *
 * Initial state: Custom color is set to #7950f2.
 * Feedback: when cleared, the text value becomes empty, the preview swatch shows a neutral
 * placeholder, and the input description changes to 'No color selected'.
 *
 * Success: Custom color is cleared/unset (no parsed color; empty string).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, CloseButton } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#7950f2');
  const [hasCompleted, setHasCompleted] = useState(false);

  const isCleared = value === '';

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (isCleared) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [isCleared, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Custom Color</Text>
      
      <ColorInput
        label="Custom color"
        description={isCleared ? 'No color selected' : 'Click × to clear'}
        value={value}
        onChange={setValue}
        format="hex"
        rightSection={
          value && (
            <CloseButton
              size="sm"
              onClick={handleClear}
              data-testid="custom-color-clear"
              aria-label="Clear color"
            />
          )
        }
        data-testid="custom-color-input"
      />
    </Card>
  );
}
