'use client';

/**
 * color_swatch_picker-mantine-T06: Set Primary label color with two fields
 *
 * Layout: form_section centered on the page.
 * A form with two ColorInput fields - must change Primary label color.
 *
 * Initial state: Primary = #4c6ef5, Secondary = #fa5252.
 * Success: Primary label color equals #12b886.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, TextInput, Checkbox, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../types';

const TARGET_COLOR = '#12b886';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [primaryColor, setPrimaryColor] = useState<string>('#4c6ef5');
  const [secondaryColor, setSecondaryColor] = useState<string>('#fa5252');
  const [primaryText, setPrimaryText] = useState('Main Label');
  const [secondaryText, setSecondaryText] = useState('Sub Label');
  const [uppercase, setUppercase] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(primaryColor, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [primaryColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Labels</Text>
      
      <Stack gap="md">
        <TextInput
          label="Primary label text"
          value={primaryText}
          onChange={(e) => setPrimaryText(e.target.value)}
        />
        
        <TextInput
          label="Secondary label text"
          value={secondaryText}
          onChange={(e) => setSecondaryText(e.target.value)}
        />
        
        <div data-testid="primary-label-color">
          <ColorInput
            label="Primary label color"
            value={primaryColor}
            onChange={setPrimaryColor}
            format="hex"
            swatches={MANTINE_SWATCHES}
            withPicker={false}
          />
        </div>
        
        <div data-testid="secondary-label-color">
          <ColorInput
            label="Secondary label color"
            value={secondaryColor}
            onChange={setSecondaryColor}
            format="hex"
            swatches={MANTINE_SWATCHES}
            withPicker={false}
          />
        </div>
        
        <Checkbox
          label="Uppercase labels"
          checked={uppercase}
          onChange={(e) => setUppercase(e.currentTarget.checked)}
        />
      </Stack>
      <div data-testid="primary-label-color-value" style={{ display: 'none' }}>
        {normalizeHex(primaryColor)}
      </div>
    </Card>
  );
}
