'use client';

/**
 * color_swatch_picker-mantine-T03: Match Avatar ring color to Sample C
 *
 * Layout: isolated_card centered on the page.
 * A reference swatch labeled "Sample C" and a ColorInput below.
 *
 * Initial state: Avatar ring color is #4c6ef5.
 * Success: Selected color matches Sample C (#e64980).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, Group, Stack, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../types';

const TARGET_COLOR = '#e64980';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('#4c6ef5');
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
      <Text fw={600} size="lg" mb="md">Avatar Ring</Text>
      
      <Stack gap="md">
        <Group>
          <Box
            data-testid="sample-c"
            data-color={TARGET_COLOR}
            style={{
              width: 48,
              height: 48,
              backgroundColor: TARGET_COLOR,
              borderRadius: 8,
              border: '1px solid var(--mantine-color-gray-3)',
            }}
          />
          <Text c="dimmed">Sample C</Text>
        </Group>
        
        <div data-testid="avatar-ring-color">
          <ColorInput
            label="Avatar ring color"
            value={value}
            onChange={setValue}
            format="hex"
            swatches={MANTINE_SWATCHES}
            withPicker={false}
            data-testid="avatar-ring-color-input"
          />
        </div>
      </Stack>
      <div data-testid="avatar-ring-color-value" style={{ display: 'none' }}>
        {normalizeHex(value)}
      </div>
    </Card>
  );
}
