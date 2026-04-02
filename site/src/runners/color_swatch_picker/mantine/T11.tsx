'use client';

/**
 * color_swatch_picker-mantine-T11: Set Secondary accent among three pickers
 *
 * Layout: isolated_card anchored to top_right.
 * Three ColorInput fields - must change Secondary accent only.
 *
 * Initial state: Primary = #228be6, Secondary = #fab005, Tertiary = #fa5252.
 * Success: Secondary accent equals #15aabf.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../types';

const TARGET_COLOR = '#15aabf';

export default function T11({ task, onSuccess }: TaskComponentProps) {
  const [primaryAccent, setPrimaryAccent] = useState<string>('#228be6');
  const [secondaryAccent, setSecondaryAccent] = useState<string>('#fab005');
  const [tertiaryAccent, setTertiaryAccent] = useState<string>('#fa5252');
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(secondaryAccent, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [secondaryAccent, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Accents</Text>
      
      <Stack gap="md">
        <div data-testid="primary-accent">
          <ColorInput
            label="Primary accent"
            value={primaryAccent}
            onChange={setPrimaryAccent}
            format="hex"
            swatches={MANTINE_SWATCHES}
            withPicker={false}
          />
        </div>
        
        <div data-testid="secondary-accent">
          <ColorInput
            label="Secondary accent"
            value={secondaryAccent}
            onChange={setSecondaryAccent}
            format="hex"
            swatches={MANTINE_SWATCHES}
            withPicker={false}
          />
        </div>
        
        <div data-testid="tertiary-accent">
          <ColorInput
            label="Tertiary accent"
            value={tertiaryAccent}
            onChange={setTertiaryAccent}
            format="hex"
            swatches={MANTINE_SWATCHES}
            withPicker={false}
          />
        </div>
      </Stack>
      <div data-testid="secondary-accent-value" style={{ display: 'none' }}>
        {normalizeHex(secondaryAccent)}
      </div>
    </Card>
  );
}
