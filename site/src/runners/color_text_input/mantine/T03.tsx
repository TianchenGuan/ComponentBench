'use client';

/**
 * color_text_input-mantine-T03: Match a sample chip color in Mantine ColorInput (mixed guidance)
 *
 * Layout: isolated_card centered.
 * Guidance: mixed. A non-interactive 'Sample chip' is shown in the target orange color,
 * and a small caption under it shows the hex label '#fd7e14'.
 *
 * Component: a Mantine ColorInput labeled 'Button hover color' directly below the sample.
 * Initial state: Button hover color starts at #228be6.
 * Feedback: the ColorInput preview swatch updates as the value becomes valid;
 * the sample chip provides a visual side-by-side comparison.
 *
 * Success: Button hover color parses to RGBA(253, 126, 20, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, Badge, Stack, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, hexToRgba } from '../types';

const TARGET_RGBA = { r: 253, g: 126, b: 20, a: 1 };
const TARGET_HEX = '#fd7e14';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#228be6');
  const [hasCompleted, setHasCompleted] = useState(false);

  const parsedColor = hexToRgba(value);

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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Match the Sample</Text>
      
      {/* Sample chip */}
      <Stack gap="xs" mb="lg">
        <Text size="sm" c="dimmed">Sample chip</Text>
        <Box>
          <Badge
            color={TARGET_HEX}
            variant="filled"
            size="lg"
            data-testid="sample-chip"
            styles={{ root: { backgroundColor: TARGET_HEX } }}
          >
            Button
          </Badge>
        </Box>
        <Text size="xs" c="dimmed">{TARGET_HEX}</Text>
      </Stack>
      
      <ColorInput
        label="Button hover color"
        value={value}
        onChange={setValue}
        format="hex"
        data-testid="button-hover-color-input"
      />
    </Card>
  );
}
