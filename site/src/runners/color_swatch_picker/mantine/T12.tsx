'use client';

/**
 * color_swatch_picker-mantine-T12: Pick almost-black swatch in dark theme
 *
 * Layout: isolated_card centered with dark theme.
 * A ColorInput with dark neutral swatches in dark mode.
 *
 * Initial state: Surface color is #343a40.
 * Success: Selected color equals #25262b.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../types';

const TARGET_COLOR = '#25262b';

export default function T12({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('#343a40');
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
      <Text fw={600} size="lg" mb="md">Dark Mode</Text>
      
      <div data-testid="surface-color">
        <ColorInput
          label="Surface color"
          value={value}
          onChange={setValue}
          format="hex"
          swatches={MANTINE_SWATCHES}
          withPicker={false}
        />
      </div>
      <div data-testid="surface-color-value" style={{ display: 'none' }}>
        {normalizeHex(value)}
      </div>
    </Card>
  );
}
