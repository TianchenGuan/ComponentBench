'use client';

/**
 * color_swatch_picker-mantine-T10: Match success banner color in dashboard widget
 *
 * Layout: dashboard with several widgets, one containing a ColorPicker.
 * Must match the "Target: Success green" sample.
 *
 * Initial state: Success banner color is #fab005.
 * Success: Selected color matches target (#40c057).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorPicker, SimpleGrid, Stack, Box, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../types';

const TARGET_COLOR = '#40c057';

export default function T10({ task, onSuccess }: TaskComponentProps) {
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
    <SimpleGrid cols={2} spacing="md" style={{ width: 700 }}>
      {/* KPI Cards */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Text c="dimmed" size="sm">Total Users</Text>
        <Text fw={700} size="xl">12,543</Text>
      </Card>
      
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Text c="dimmed" size="sm">Revenue</Text>
        <Text fw={700} size="xl">$45,231</Text>
      </Card>
      
      {/* Table Preview */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Text fw={600} mb="sm">Recent Activity</Text>
        <Stack gap="xs">
          <Text size="sm">• User signup - 2m ago</Text>
          <Text size="sm">• Order placed - 5m ago</Text>
          <Text size="sm">• Payment received - 10m ago</Text>
        </Stack>
      </Card>
      
      {/* Banner Colors Widget - Target */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Text fw={600} mb="md">Banner colors</Text>
        
        <Stack gap="md">
          <Group>
            <Box
              data-testid="target-success-green"
              data-color={TARGET_COLOR}
              style={{
                width: 32,
                height: 32,
                backgroundColor: TARGET_COLOR,
                borderRadius: 6,
                border: '1px solid var(--mantine-color-gray-3)',
              }}
            />
            <Text size="sm" c="dimmed">Target: Success green</Text>
          </Group>
          
          <div data-testid="success-banner-color">
            <Text size="sm" mb="xs">Success banner color</Text>
            <ColorPicker
              value={value}
              onChange={setValue}
              format="hex"
              swatches={MANTINE_SWATCHES}
              withPicker={false}
            />
          </div>
        </Stack>
      </Card>
      
      <div data-testid="success-banner-color-value" style={{ display: 'none' }}>
        {normalizeHex(value)}
      </div>
    </SimpleGrid>
  );
}
