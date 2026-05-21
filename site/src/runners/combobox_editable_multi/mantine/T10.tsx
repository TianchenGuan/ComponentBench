'use client';

/**
 * combobox_editable_multi-mantine-T10: Match 5 destinations in a dark dashboard
 *
 * Dark theme dashboard layout with multiple panels (charts, side navigation, and a table).
 * - Target panel: "Travel profile" card located near the center of the dashboard.
 * - Component: Mantine TagsInput labeled "Preferred destinations", with a large grouped suggestions dataset (~120 city names grouped by first letter).
 * - Initial state: empty.
 * - When the dropdown opens, only the first ~10 options are visible; the list is scrollable.
 * The five target cities are in the "T" section and are not all visible at once; you will likely need to scroll within the suggestions list and select the correct cities.
 *
 * Success: Selected values equal {Tokyo, Toronto, Tunis, Tallinn, Tbilisi} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TagsInput, Grid, Paper, Table } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

// Large grouped city list
const cities = [
  // A cities
  'Amsterdam', 'Athens', 'Auckland', 'Atlanta',
  // B cities
  'Bangkok', 'Barcelona', 'Beijing', 'Berlin', 'Boston', 'Brussels', 'Budapest',
  // C cities
  'Cairo', 'Cape Town', 'Chicago', 'Copenhagen',
  // D cities
  'Dallas', 'Delhi', 'Dubai', 'Dublin',
  // E cities
  'Edinburgh',
  // F cities
  'Frankfurt',
  // G cities
  'Geneva',
  // H cities
  'Helsinki', 'Hong Kong', 'Houston',
  // I cities
  'Istanbul',
  // J cities
  'Jakarta', 'Johannesburg',
  // K cities
  'Kiev', 'Kuala Lumpur',
  // L cities
  'Lagos', 'Lima', 'Lisbon', 'London', 'Los Angeles',
  // M cities
  'Madrid', 'Manila', 'Melbourne', 'Mexico City', 'Miami', 'Milan', 'Moscow', 'Mumbai', 'Munich',
  // N cities
  'Nairobi', 'New York',
  // O cities
  'Osaka', 'Oslo',
  // P cities
  'Paris', 'Perth', 'Prague',
  // R cities
  'Reykjavik', 'Rio de Janeiro', 'Rome',
  // S cities
  'San Francisco', 'Santiago', 'Sao Paulo', 'Seattle', 'Seoul', 'Shanghai', 'Singapore', 'Stockholm', 'Sydney',
  // T cities - target cities are here
  'Taipei', 'Tallinn', 'Tbilisi', 'Tehran', 'Tel Aviv', 'Tokyo', 'Toronto', 'Tunis',
  // V cities
  'Vancouver', 'Vienna',
  // W cities
  'Warsaw', 'Washington DC',
  // Z cities
  'Zurich',
];

const TARGET_SET = ['Tokyo', 'Toronto', 'Tunis', 'Tallinn', 'Tbilisi'];

const travelStats = [
  { metric: 'Total trips', value: '24' },
  { metric: 'Countries visited', value: '18' },
  { metric: 'Miles flown', value: '156,000' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Grid>
      {/* Side panel */}
      <Grid.Col span={3}>
        <Paper p="md" withBorder>
          <Text fw={600} size="sm" mb="md">Navigation</Text>
          <Text size="xs" c="dimmed">Dashboard</Text>
          <Text size="xs" c="dimmed">Trips</Text>
          <Text size="xs" c="dimmed">Reports</Text>
          <Text size="xs" c="dimmed">Settings</Text>
        </Paper>
      </Grid.Col>
      
      {/* Main content */}
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={600} size="lg" mb="md">Travel profile</Text>
          <Text fw={500} size="sm" mb={8}>Preferred destinations</Text>
          <TagsInput
            data-testid="preferred-destinations"
            placeholder="Select destinations"
            data={cities}
            value={value}
            onChange={setValue}
            maxDropdownHeight={200}
          />
        </Card>
      </Grid.Col>
      
      {/* Stats panel */}
      <Grid.Col span={3}>
        <Paper p="md" withBorder>
          <Text fw={600} size="sm" mb="md">Statistics</Text>
          <Table>
            <Table.Tbody>
              {travelStats.map((stat) => (
                <Table.Tr key={stat.metric}>
                  <Table.Td><Text size="xs">{stat.metric}</Text></Table.Td>
                  <Table.Td><Text size="xs" fw={600}>{stat.value}</Text></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
