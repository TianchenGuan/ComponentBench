'use client';

/**
 * listbox_multi-mantine-v2-T14: Statuses filter card matched to reference chips
 *
 * Dashboard with 3 Mantine Checkbox.Group lists (Statuses, Regions, Channels) in a filter card.
 * Reference chip row: Waiting on vendor, Needs review, Resolved. Statuses is TARGET.
 * Regions and Channels start empty and must remain unchanged.
 * Target: Waiting on vendor, Needs review, Resolved. Confirm via "Apply statuses". High-contrast.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, Text, Checkbox, Stack, Button, Divider, Group, Badge, MantineProvider,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const statusOptions = [
  'Waiting on vendor', 'Waiting on customer', 'Needs review',
  'Escalated', 'Resolved', 'Closed',
];

const regionOptions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'];
const channelOptions = ['Email', 'Chat', 'Phone', 'Social', 'API'];

const referenceChips = ['Waiting on vendor', 'Needs review', 'Resolved'];
const targetSet = ['Waiting on vendor', 'Needs review', 'Resolved'];

export default function T14({ onSuccess }: TaskComponentProps) {
  const [statuses, setStatuses] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      setsEqual(statuses, targetSet) &&
      setsEqual(regions, []) &&
      setsEqual(channels, [])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, statuses, regions, channels, onSuccess]);

  const resetSaved = () => setSaved(false);

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ display: 'flex', gap: 16, padding: 24, background: '#000', minHeight: '100vh' }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300, flexShrink: 0 }}>
          <Text fw={600} size="lg" mb="sm">Filters</Text>

          <Text size="xs" c="dimmed" mb={4}>Reference statuses</Text>
          <Group gap={4} mb="md">
            {referenceChips.map(c => <Badge key={c} size="sm" color="blue">{c}</Badge>)}
          </Group>

          <Text fw={500} mb={6}>Statuses</Text>
          <Checkbox.Group value={statuses} onChange={(vals) => { setStatuses(vals); resetSaved(); }}>
            <Stack gap="xs">
              {statusOptions.map(opt => <Checkbox key={opt} value={opt} label={opt} />)}
            </Stack>
          </Checkbox.Group>

          <Divider my="md" />

          <Text fw={500} mb={6}>Regions</Text>
          <Checkbox.Group value={regions} onChange={(vals) => { setRegions(vals); resetSaved(); }}>
            <Stack gap="xs">
              {regionOptions.map(opt => <Checkbox key={opt} value={opt} label={opt} />)}
            </Stack>
          </Checkbox.Group>

          <Divider my="md" />

          <Text fw={500} mb={6}>Channels</Text>
          <Checkbox.Group value={channels} onChange={(vals) => { setChannels(vals); resetSaved(); }}>
            <Stack gap="xs">
              {channelOptions.map(opt => <Checkbox key={opt} value={opt} label={opt} />)}
            </Stack>
          </Checkbox.Group>

          <Divider my="md" />

          <Button fullWidth onClick={() => setSaved(true)}>Apply statuses</Button>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
          <Text fw={600} size="xl">Ticket Overview</Text>
          <Text size="sm" c="dimmed" mt={4}>Status trends and resolution metrics</Text>
          <div style={{ marginTop: 24, padding: 48, textAlign: 'center', border: '1px dashed #373a40', borderRadius: 6 }}>
            <Text c="dimmed">Chart area</Text>
          </div>
        </Card>
      </div>
    </MantineProvider>
  );
}
