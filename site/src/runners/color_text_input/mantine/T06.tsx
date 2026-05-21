'use client';

/**
 * color_text_input-mantine-T06: Set a HEX value with swatches present (compact Mantine form)
 *
 * Layout: form_section titled 'Badge settings' with compact spacing (reduced padding between controls).
 * Component: Mantine ColorInput labeled 'Badge color' with a predefined swatches list
 * shown in its dropdown/picker popover.
 *
 * Initial state: Badge color is #868e96.
 * Distractors: opening the ColorInput popover reveals many clickable swatches (7 per row),
 * but the task can be completed by typing the HEX value into the text input.
 *
 * Feedback: preview swatch updates when the typed value is valid; invalid values show an error message.
 *
 * Success: Badge color parses to RGBA(76, 110, 245, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, TextInput, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, hexToRgba } from '../types';

const TARGET_RGBA = { r: 76, g: 110, b: 245, a: 1 };

const SWATCHES = [
  '#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5',
  '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14',
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [badgeName, setBadgeName] = useState('Priority');
  const [badgeColor, setBadgeColor] = useState('#868e96');
  const [hasCompleted, setHasCompleted] = useState(false);

  const parsedColor = hexToRgba(badgeColor);

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
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="lg" mb="sm">Badge settings</Text>
      
      <Stack gap="xs">
        <TextInput
          label="Badge name"
          value={badgeName}
          onChange={(e) => setBadgeName(e.target.value)}
          size="sm"
        />
        
        <ColorInput
          label="Badge color"
          value={badgeColor}
          onChange={setBadgeColor}
          format="hex"
          swatches={SWATCHES}
          swatchesPerRow={7}
          size="sm"
          data-testid="badge-color-input"
        />
      </Stack>
    </Card>
  );
}
