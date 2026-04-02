'use client';

/**
 * select_custom_single-mantine-v2-T13: Drawer airport pair — set Backup airport to São Paulo and save
 *
 * Travel dashboard with "Flight preferences" button. Drawer opens with two searchable
 * Mantine Select controls: "Primary airport" (New York (JFK), must stay) and
 * "Backup airport" (empty). ~30 airports in City (CODE) format.
 * Footer: "Save flight preferences" / "Cancel".
 *
 * Success: Backup airport = "São Paulo (GRU)", Primary airport still "New York (JFK)",
 * "Save flight preferences" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Select, Button, Group, Badge, Drawer, Stack, Divider, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const airports = [
  'Amsterdam (AMS)', 'Bangkok (BKK)', 'Beijing (PEK)', 'Berlin (BER)',
  'Buenos Aires (EZE)', 'Cairo (CAI)', 'Chicago (ORD)', 'Dallas (DFW)',
  'Delhi (DEL)', 'Dubai (DXB)', 'Frankfurt (FRA)', 'Hong Kong (HKG)',
  'Istanbul (IST)', 'Johannesburg (JNB)', 'Lima (LIM)', 'London (LHR)',
  'Los Angeles (LAX)', 'Madrid (MAD)', 'Mexico City (MEX)', 'Miami (MIA)',
  'Moscow (SVO)', 'Mumbai (BOM)', 'New York (JFK)', 'Paris (CDG)',
  'Rome (FCO)', 'San Francisco (SFO)', 'San Jose (SJC)', 'Santiago (SCL)',
  'São Paulo (GRU)', 'Seoul (ICN)', 'Shanghai (PVG)', 'Singapore (SIN)',
  'Sydney (SYD)', 'Tokyo (NRT)', 'Toronto (YYZ)',
];

const airportOptions = airports.map((a) => ({ value: a, label: a }));

export default function T13({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [primaryAirport, setPrimaryAirport] = useState<string | null>('New York (JFK)');
  const [backupAirport, setBackupAirport] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && backupAirport === 'São Paulo (GRU)' && primaryAirport === 'New York (JFK)') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, backupAirport, primaryAirport, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setDrawerOpen(false);
  };

  return (
    <MantineProvider>
      <div style={{ padding: 16 }}>
        <Text fw={700} size="xl" mb="md">Travel Dashboard</Text>

        <Group gap="sm" mb="md">
          <Badge variant="light" color="blue">Flights: 24</Badge>
          <Badge variant="outline">Miles: 48,200</Badge>
          <Badge variant="outline" color="gray">Status: Gold</Badge>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 400, marginBottom: 16 }}>
          <Text fw={500} mb="xs">Quick Stats</Text>
          <Text size="sm" c="dimmed" mb="md">Upcoming trips: 3 · Saved routes: 12 · Alerts: 2</Text>
          <Button onClick={() => setDrawerOpen(true)}>Flight preferences</Button>
        </Card>

        <Drawer
          opened={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Flight Preferences"
          position="right"
          size="sm"
        >
          <Stack gap="md">
            <Select
              label="Primary airport"
              searchable
              data={airportOptions}
              value={primaryAirport}
              onChange={(val) => { setPrimaryAirport(val); setSaved(false); }}
              placeholder="Search airports..."
            />

            <Select
              label="Backup airport"
              searchable
              data={airportOptions}
              value={backupAirport}
              onChange={(val) => { setBackupAirport(val); setSaved(false); }}
              placeholder="Search airports..."
            />

            <Divider />

            <Group gap="xs">
              <Badge size="sm" variant="outline">Class: Economy</Badge>
              <Badge size="sm" variant="light">Alerts: On</Badge>
            </Group>

            <Group justify="flex-end" gap="sm" mt="md">
              <Button variant="default" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save flight preferences</Button>
            </Group>
          </Stack>
        </Drawer>
      </div>
    </MantineProvider>
  );
}
