'use client';

/**
 * color_swatch_picker-mantine-T02: Select Lime swatch from inline grid
 *
 * Layout: isolated_card centered on the page.
 * A Mantine ColorPicker rendered inline as swatches-only.
 *
 * Initial state: Selected color is #fab005.
 * Success: Selected color equals #82c91e.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorPicker } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../types';

const TARGET_COLOR = '#82c91e';

export default function T02({ task, onSuccess }: TaskComponentProps) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Status Color</Text>
      
      <ColorPicker
        value={value}
        onChange={setValue}
        format="hex"
        swatches={MANTINE_SWATCHES}
        withPicker={false}
        data-testid="status-color-picker"
      />
      <div data-testid="status-color-value" style={{ display: 'none' }}>
        {normalizeHex(value)}
      </div>
    </Card>
  );
}
