'use client';

/**
 * color_swatch_picker-mantine-T13: Match subtle gray in dense small grid
 *
 * Layout: isolated_card centered with small scale.
 * A ColorPicker with 28 grayscale swatches in dense grid, must match Sample D.
 *
 * Initial state: Divider color is #ffffff.
 * Success: Selected color matches Sample D (#ced4da).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorPicker, Stack, Group, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, GRAYSCALE_SWATCHES } from '../types';

const TARGET_COLOR = '#ced4da';

export default function T13({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('#ffffff');
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
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="md" mb="md">Dividers</Text>
      
      <Stack gap="md">
        <Group>
          <Box
            data-testid="sample-d"
            data-color={TARGET_COLOR}
            style={{
              width: 32,
              height: 32,
              backgroundColor: TARGET_COLOR,
              borderRadius: 6,
              border: '1px solid var(--mantine-color-gray-4)',
            }}
          />
          <Text size="sm" c="dimmed">Sample D</Text>
        </Group>
        
        <div data-testid="divider-color">
          <Text size="sm" mb="xs">Divider color</Text>
          <ColorPicker
            value={value}
            onChange={setValue}
            format="hex"
            swatches={GRAYSCALE_SWATCHES}
            withPicker={false}
            swatchesPerRow={14}
            size="xs"
          />
        </div>
      </Stack>
      <div data-testid="divider-color-value" style={{ display: 'none' }}>
        {normalizeHex(value)}
      </div>
    </Card>
  );
}
