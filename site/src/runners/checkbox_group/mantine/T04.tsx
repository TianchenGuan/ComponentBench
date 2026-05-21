'use client';

/**
 * checkbox_group-mantine-T04: Match Target pack preview (Install packages)
 *
 * Scene: light theme; comfortable spacing; a single isolated card anchored toward the top-left.
 * Mantine page (light theme) anchored toward top-left. Single card titled "Starter pack".
 * Inside the card:
 * - Left column: Checkbox.Group labeled "Install packages" with six options, each with a small package icon:
 *   @mantine/core, @mantine/hooks, @mantine/notifications, @mantine/form, @mantine/dates, @mantine/spotlight.
 * - Right column: "Target pack" preview showing three icon tiles.
 * Initial state: only @mantine/core is checked by default.
 * Success: The 'Install packages' checkbox group matches the visual Target pack preview:
 *   @mantine/core, @mantine/hooks, @mantine/notifications.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Checkbox, Stack, Group, Badge, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const packageOptions = [
  '@mantine/core',
  '@mantine/hooks',
  '@mantine/notifications',
  '@mantine/form',
  '@mantine/dates',
  '@mantine/spotlight',
];

const targetPackages = ['@mantine/core', '@mantine/hooks', '@mantine/notifications'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['@mantine/core']);

  useEffect(() => {
    const targetSet = new Set(targetPackages);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={600} size="lg" mb="md">Starter pack</Text>
      <Group align="flex-start" gap="xl">
        {/* Left: Checkbox group */}
        <Box style={{ flex: 1 }}>
          <Text fw={500} size="sm" mb="xs">Install packages</Text>
          <Checkbox.Group
            data-testid="cg-install-packages"
            value={selected}
            onChange={setSelected}
          >
            <Stack gap="xs">
              {packageOptions.map(pkg => (
                <Checkbox key={pkg} value={pkg} label={`📦 ${pkg}`} />
              ))}
            </Stack>
          </Checkbox.Group>
        </Box>

        {/* Right: Target pack preview */}
        <Box style={{ flex: 1 }}>
          <Text fw={500} size="sm" mb="xs">Target pack</Text>
          <Box 
            p="md" 
            style={{ 
              background: '#f8f9fa', 
              borderRadius: 8, 
              border: '1px dashed #dee2e6' 
            }}
          >
            <Group gap="xs" wrap="wrap">
              {targetPackages.map(pkg => (
                <Badge key={pkg} variant="light" color="blue" size="lg">
                  📦 {pkg.replace('@mantine/', '')}
                </Badge>
              ))}
            </Group>
            <Text size="xs" c="dimmed" mt="xs">
              Select these {targetPackages.length} packages
            </Text>
          </Box>
        </Box>
      </Group>
    </Card>
  );
}
