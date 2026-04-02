'use client';

/**
 * color_text_input-mantine-T10: Open swatches and select a specific color (Mantine ColorInput)
 *
 * Layout: dashboard card titled 'Label tokens' with two Mantine ColorInputs laid out side-by-side.
 * Instances: 2 ColorInputs labeled 'Tag color' and 'Badge color'. Both are configured with a
 * dense swatches palette in their dropdown/picker popover.
 *
 * Interaction detail: clicking into a ColorInput opens its popover showing many small swatches
 * (7 per row). Each swatch has an accessible label containing its hex value.
 *
 * Initial state: Tag color=#4c6ef5, Badge color=#40c057.
 * Goal: choose the swatch '#fa5252' (a red swatch) specifically for Tag color.
 *
 * Feedback: after selecting a swatch, the popover closes and the Tag color text value updates
 * to the selected hex; the preview swatch updates accordingly.
 *
 * Success: The Tag color field's parsed color equals RGBA(250, 82, 82, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, hexToRgba } from '../types';

const TARGET_RGBA = { r: 250, g: 82, b: 82, a: 1 };

const SWATCHES = [
  '#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5',
  '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14',
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [tagColor, setTagColor] = useState('#4c6ef5');
  const [badgeColor, setBadgeColor] = useState('#40c057');
  const [hasCompleted, setHasCompleted] = useState(false);

  const tagParsed = hexToRgba(tagColor);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (tagParsed && isColorWithinTolerance(tagParsed, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [tagParsed, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Label tokens</Text>
      
      <Group grow>
        <ColorInput
          label="Tag color"
          value={tagColor}
          onChange={setTagColor}
          format="hex"
          swatches={SWATCHES}
          swatchesPerRow={7}
          data-testid="tag-color-input"
        />
        
        <ColorInput
          label="Badge color"
          value={badgeColor}
          onChange={setBadgeColor}
          format="hex"
          swatches={SWATCHES}
          swatchesPerRow={7}
          data-testid="badge-color-input"
        />
      </Group>
    </Card>
  );
}
