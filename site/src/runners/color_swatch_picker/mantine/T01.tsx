'use client';

/**
 * color_swatch_picker-mantine-T01: Pick Tag color Blue 600
 *
 * Layout: isolated_card centered on the page.
 * A Mantine ColorInput configured for swatches-only selection.
 *
 * Initial state: Tag color is empty (placeholder "Pick color").
 * Success: Selected color equals #228be6.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../types';

const TARGET_COLOR = '#228be6';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('');
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(value, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [value, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Tag</Text>
      
      <div data-testid="tag-color">
        <ColorInput
          label="Tag color"
          placeholder="Pick color"
          value={value}
          onChange={setValue}
          format="hex"
          swatches={MANTINE_SWATCHES}
          withPicker={false}
          data-testid="tag-color-input"
        />
      </div>
      <div data-testid="tag-color-value" style={{ display: 'none' }}>
        {normalizeHex(value)}
      </div>
    </Card>
  );
}
