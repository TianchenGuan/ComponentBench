'use client';

/**
 * color_swatch_picker-mantine-T09: Scroll to find Slate swatch
 *
 * Layout: isolated_card centered.
 * A ColorInput with a large swatch list (60 colors) requiring scrolling.
 *
 * Initial state: Sidebar tint is #e9ecef.
 * Success: Selected color equals #495057.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, EXTENDED_MANTINE_SWATCHES } from '../types';

const TARGET_COLOR = '#495057';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('#e9ecef');
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
      <Text fw={600} size="lg" mb="md">Sidebar</Text>
      
      <div data-testid="sidebar-tint-color">
        <ColorInput
          label="Sidebar tint"
          value={value}
          onChange={setValue}
          format="hex"
          swatches={EXTENDED_MANTINE_SWATCHES}
          withPicker={false}
          swatchesPerRow={10}
          popoverProps={{
            styles: {
              dropdown: {
                maxHeight: 200,
                overflowY: 'auto',
              },
            },
          }}
        />
      </div>
      <div data-testid="sidebar-tint-value" style={{ display: 'none' }}>
        {normalizeHex(value)}
      </div>
    </Card>
  );
}
