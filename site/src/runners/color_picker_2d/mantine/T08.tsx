'use client';

/**
 * color_picker_2d-mantine-T08: Form section: set Secondary border color
 *
 * Layout: form_section centered with a "Borders" heading.
 * Two Mantine ColorInput fields are shown one after another:
 *   1) "Primary border color" (already set; not the target)
 *   2) "Secondary border color" (target)
 * Both inputs allow free typing and show a small color swatch on the left.
 * Initial state: Primary border color = #2E2E2E; Secondary border color = #868E96.
 * Distractors: nearby form fields include "Border width" (NumberInput) and "Use dashed border" (Switch).
 * The task requires editing ONLY the Secondary border ColorInput to #FA5252.
 *
 * Success: Secondary border color value represents color RGBA(250, 82, 82, 1.0). Primary must remain unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, NumberInput, Switch, Stack } from '@mantine/core';
import { ColorInput } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { hexToRgba } from '../types';

const TARGET_COLOR: RGBA = { r: 250, g: 82, b: 82, a: 1.0 };
const INITIAL_PRIMARY = '#2E2E2E';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryBorder, setPrimaryBorder] = useState(INITIAL_PRIMARY);
  const [secondaryBorder, setSecondaryBorder] = useState('#868E96');
  const [borderWidth, setBorderWidth] = useState<number | string>(1);
  const [useDashed, setUseDashed] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;

    // Check primary hasn't changed
    const primaryRgba = hexToRgba(primaryBorder);
    if (!primaryRgba || 
        primaryRgba.r !== 46 || 
        primaryRgba.g !== 46 || 
        primaryRgba.b !== 46) {
      return; // Primary changed - don't succeed
    }

    // Check secondary matches target
    const secondaryRgba = hexToRgba(secondaryBorder);
    if (secondaryRgba && 
        secondaryRgba.r === TARGET_COLOR.r && 
        secondaryRgba.g === TARGET_COLOR.g && 
        secondaryRgba.b === TARGET_COLOR.b) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [primaryBorder, secondaryBorder, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Borders</Text>
      
      <Stack gap="sm">
        <NumberInput
          label="Border width"
          value={borderWidth}
          onChange={setBorderWidth}
          min={0}
          max={10}
          suffix="px"
        />
        
        <Switch
          label="Use dashed border"
          checked={useDashed}
          onChange={(e) => setUseDashed(e.currentTarget.checked)}
        />
        
        <ColorInput
          label="Primary border color"
          value={primaryBorder}
          onChange={setPrimaryBorder}
          format="hex"
          data-testid="primary-border-color"
        />
        
        <ColorInput
          label="Secondary border color"
          value={secondaryBorder}
          onChange={setSecondaryBorder}
          format="hex"
          data-testid="secondary-border-color"
        />
      </Stack>
      
      <Text size="xs" c="dimmed" mt="md">
        Set Secondary border color to #FA5252. Leave Primary unchanged.
      </Text>
    </Card>
  );
}
