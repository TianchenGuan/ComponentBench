'use client';

/**
 * select_custom_single-mantine-v2-T18: Clear only Office in the workspace strip and apply
 *
 * Compact dark workspace filter strip in a crowded office dashboard. Three Mantine Select controls:
 * "Office" (New York, clearable), "Region" (North America, must stay), "Desk type" (Standing, must stay).
 * Office shows clear button because it has a value. "Apply workspace filters" commits;
 * "Reset all" is distractor.
 *
 * Success: Office = null/empty, Region still "North America", Desk type still "Standing",
 * "Apply workspace filters" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, Text, Select, Button, Group, Badge, Stack, MantineProvider,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const officeOptions = [
  { value: 'New York', label: 'New York' },
  { value: 'San Francisco', label: 'San Francisco' },
  { value: 'London', label: 'London' },
  { value: 'Berlin', label: 'Berlin' },
  { value: 'Tokyo', label: 'Tokyo' },
  { value: 'Sydney', label: 'Sydney' },
];

const regionOptions = [
  { value: 'North America', label: 'North America' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Asia Pacific', label: 'Asia Pacific' },
];

const deskOptions = [
  { value: 'Standing', label: 'Standing' },
  { value: 'Sitting', label: 'Sitting' },
  { value: 'Hot desk', label: 'Hot desk' },
  { value: 'Private office', label: 'Private office' },
];

export default function T18({ onSuccess }: TaskComponentProps) {
  const [office, setOffice] = useState<string | null>('New York');
  const [region, setRegion] = useState<string | null>('North America');
  const [deskType, setDeskType] = useState<string | null>('Standing');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && office === null && region === 'North America' && deskType === 'Standing') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, office, region, deskType, onSuccess]);

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ padding: 16, minHeight: '100vh' }}>
        <Text fw={700} size="xl" mb="md">Office Dashboard</Text>

        <Group gap="sm" mb="md">
          <Badge variant="light" color="blue">Desks: 142</Badge>
          <Badge variant="outline">Occupancy: 78%</Badge>
          <Badge variant="outline" color="gray">Floor: 3</Badge>
        </Group>

        <Card shadow="sm" padding="sm" radius="md" withBorder style={{ marginBottom: 16 }}>
          <Group gap="sm" align="flex-end" wrap="wrap">
            <Select
              label="Office"
              size="xs"
              data={officeOptions}
              value={office}
              onChange={(val) => { setOffice(val); setApplied(false); }}
              clearable
              placeholder="All offices"
              style={{ width: 140 }}
            />

            <Select
              label="Region"
              size="xs"
              data={regionOptions}
              value={region}
              onChange={(val) => { setRegion(val); setApplied(false); }}
              style={{ width: 150 }}
            />

            <Select
              label="Desk type"
              size="xs"
              data={deskOptions}
              value={deskType}
              onChange={(val) => { setDeskType(val); setApplied(false); }}
              style={{ width: 130 }}
            />

            <Button size="xs" onClick={() => setApplied(true)}>Apply workspace filters</Button>
            <Button size="xs" variant="subtle" color="red" onClick={() => {
              setOffice(null);
              setRegion('North America');
              setDeskType('Standing');
              setApplied(false);
            }}>
              Reset all
            </Button>
          </Group>
        </Card>

        <Card shadow="sm" padding="md" radius="md" withBorder style={{ height: 140 }}>
          <Text c="dimmed" size="sm">Workspace map placeholder</Text>
        </Card>

        <Group gap="xs" mt="md">
          <Badge size="xs" variant="outline">Last refreshed: 2m ago</Badge>
          <Text size="xs" c="dimmed">Bookings: 24 active</Text>
        </Group>
      </div>
    </MantineProvider>
  );
}
