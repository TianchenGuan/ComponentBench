'use client';

/**
 * listbox_multi-mantine-T06: Match reference: pick packages to install
 *
 * Layout: form_section centered with two columns.
 * Left column: a "Recommended" area showing 3 small cards (read-only) with package names.
 * Right column: the target component is a Mantine Checkbox.Group rendered as a vertical Stack of Checkbox.Card items.
 * Options (10 cards).
 * Initial state: none selected.
 * Guidance is mixed: user reads package names from the Recommended cards and matches them in the selectable card list.
 *
 * Success: The target listbox has exactly: @mantine/core, @mantine/hooks, @mantine/notifications.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Stack, Grid, Paper, Group, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const referencePackages = ['@mantine/core', '@mantine/hooks', '@mantine/notifications'];

const options = [
  '@mantine/core',
  '@mantine/hooks',
  '@mantine/notifications',
  '@mantine/dates',
  '@tabler/icons-react',
  'react-router',
  'zod',
  'tanstack-query',
  'axios',
  'dayjs',
];

const targetSet = referencePackages;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      <Text fw={600} size="lg" mb="xs">
        Project setup
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Project setup: pick packages (match Recommended).
      </Text>
      <Grid>
        <Grid.Col span={4}>
          <Paper withBorder p="md">
            <Text fw={500} mb="sm">
              Recommended
            </Text>
            <Stack gap="xs">
              {referencePackages.map((pkg) => (
                <Badge key={pkg} variant="light" color="blue" size="lg" radius="sm">
                  {pkg}
                </Badge>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={8}>
          <Text fw={500} mb="sm">
            Packages
          </Text>
          <Checkbox.Group
            data-testid="listbox-packages"
            value={selected}
            onChange={setSelected}
          >
            <Stack gap="xs">
              {options.map((opt) => (
                <Checkbox.Card
                  key={opt}
                  value={opt}
                  radius="md"
                  checked={selected.includes(opt)}
                  p="sm"
                  style={{ border: selected.includes(opt) ? '2px solid #228be6' : '1px solid #e9ecef' }}
                >
                  <Group wrap="nowrap" align="center">
                    <Checkbox.Indicator />
                    <Text size="sm">{opt}</Text>
                  </Group>
                </Checkbox.Card>
              ))}
            </Stack>
          </Checkbox.Group>
          <Text size="sm" c="dimmed" mt="md">
            Current value: {selected.join(', ') || '–'}
          </Text>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
