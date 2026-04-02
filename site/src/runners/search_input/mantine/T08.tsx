'use client';

/**
 * search_input-mantine-T08: Dense warehouse city Autocomplete with scrolling
 *
 * Dashboard layout titled "Logistics" with high clutter: multiple metric cards, a map placeholder, and a table.
 * The target is a Mantine Autocomplete labeled "Warehouse city" in the Filters card.
 * The suggestions dataset contains 60 US cities, including multiple Birmingham entries and other similar names (e.g., Birmingham, AL; Birmingham, UK; Bismarck, ND; etc.). The dropdown is scrollable.
 * Initial state: empty; dropdown opens while typing.
 * Feedback: selecting a city shows a filter chip "City: Birmingham, AL".
 * Other filter controls (date, status) are present but irrelevant to success.
 *
 * Success: The Autocomplete labeled "Warehouse city" has selected_option/value equal to "Birmingham, AL".
 */

import React, { useState, useRef } from 'react';
import { Card, Autocomplete, Text, Group, Paper, Badge, Table, SimpleGrid, Stack, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const cities = [
  'Birmingham, AL', 'Birmingham, UK', 'Bismarck, ND', 'Boston, MA', 'Boulder, CO',
  'Buffalo, NY', 'Burlington, VT', 'Cambridge, MA', 'Charleston, SC', 'Charlotte, NC',
  'Chicago, IL', 'Cincinnati, OH', 'Cleveland, OH', 'Columbus, OH', 'Dallas, TX',
  'Denver, CO', 'Detroit, MI', 'Durham, NC', 'El Paso, TX', 'Fort Worth, TX',
  'Fresno, CA', 'Grand Rapids, MI', 'Greensboro, NC', 'Hartford, CT', 'Houston, TX',
  'Indianapolis, IN', 'Jacksonville, FL', 'Kansas City, MO', 'Las Vegas, NV', 'Los Angeles, CA',
  'Louisville, KY', 'Madison, WI', 'Memphis, TN', 'Miami, FL', 'Milwaukee, WI',
  'Minneapolis, MN', 'Nashville, TN', 'New Orleans, LA', 'New York, NY', 'Newark, NJ',
  'Oakland, CA', 'Oklahoma City, OK', 'Omaha, NE', 'Orlando, FL', 'Philadelphia, PA',
  'Phoenix, AZ', 'Pittsburgh, PA', 'Portland, OR', 'Providence, RI', 'Raleigh, NC',
  'Richmond, VA', 'Sacramento, CA', 'Salt Lake City, UT', 'San Antonio, TX', 'San Diego, CA',
  'San Francisco, CA', 'San Jose, CA', 'Seattle, WA', 'St. Louis, MO', 'Tampa, FL',
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const hasSucceeded = useRef(false);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Birmingham, AL' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Stack gap="md" style={{ width: 800 }}>
      <Text fw={700} size="xl">Logistics</Text>

      {/* Metrics Row */}
      <SimpleGrid cols={3} spacing="md">
        <Paper withBorder p="md" radius="sm">
          <Text size="sm" c="dimmed">Total Shipments</Text>
          <Text size="xl" fw={700}>1,234</Text>
        </Paper>
        <Paper withBorder p="md" radius="sm">
          <Text size="sm" c="dimmed">In Transit</Text>
          <Text size="xl" fw={700}>456</Text>
        </Paper>
        <Paper withBorder p="md" radius="sm">
          <Text size="sm" c="dimmed">Delivered</Text>
          <Text size="xl" fw={700}>778</Text>
        </Paper>
      </SimpleGrid>

      {/* Map Placeholder */}
      <Paper withBorder p="lg" radius="sm" bg="gray.1" style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text c="dimmed">Map Placeholder</Text>
      </Paper>

      {/* Filters Card */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Text fw={600} mb="md">Filters</Text>
        <Group grow>
          <Autocomplete
            label="Warehouse city"
            placeholder="Type to search…"
            data={cities}
            value={value}
            onChange={handleChange}
            maxDropdownHeight={200}
            data-testid="search-warehouse"
          />
          <Select
            label="Status"
            placeholder="Select status"
            data={['Active', 'Pending', 'Closed']}
          />
          <Select
            label="Date range"
            placeholder="Select range"
            data={['Last 7 days', 'Last 30 days', 'Last 90 days']}
          />
        </Group>
        {value && (
          <Badge color="blue" mt="md">City: {value}</Badge>
        )}
      </Card>

      {/* Table */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Text fw={600} mb="md">Recent Shipments</Text>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Origin</Table.Th>
              <Table.Th>Destination</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr><Table.Td>SHP-001</Table.Td><Table.Td>Chicago</Table.Td><Table.Td>New York</Table.Td><Table.Td>In Transit</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>SHP-002</Table.Td><Table.Td>Los Angeles</Table.Td><Table.Td>Miami</Table.Td><Table.Td>Delivered</Table.Td></Table.Tr>
            <Table.Tr><Table.Td>SHP-003</Table.Td><Table.Td>Seattle</Table.Td><Table.Td>Dallas</Table.Td><Table.Td>Pending</Table.Td></Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}
