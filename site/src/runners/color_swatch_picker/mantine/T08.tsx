'use client';

/**
 * color_swatch_picker-mantine-T08: Pick Orange swatch in compact small input
 *
 * Layout: isolated_card centered with compact spacing and small scale.
 * A ColorInput at xs size with compact layout.
 *
 * Initial state: Chip color is #fab005.
 * Success: Selected color equals #fd7e14.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../types';

const TARGET_COLOR = '#fd7e14';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('#fab005');
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
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={600} size="md" mb="sm">Chips</Text>
      
      <div data-testid="chip-color">
        <ColorInput
          label="Chip color"
          value={value}
          onChange={setValue}
          format="hex"
          swatches={MANTINE_SWATCHES}
          withPicker={false}
          size="xs"
        />
      </div>
      <div data-testid="chip-color-value" style={{ display: 'none' }}>
        {normalizeHex(value)}
      </div>
    </Card>
  );
}
