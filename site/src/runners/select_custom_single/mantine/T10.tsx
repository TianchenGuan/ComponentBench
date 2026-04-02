'use client';

/**
 * select_custom_single-mantine-T10: Pick Quarter to date range from an already-open dashboard filter
 *
 * Layout: dashboard (light theme) with multiple widgets and filter controls.
 * At the top of the dashboard there is a filter strip with two Mantine Select components:
 * 1) "Report range"  ← TARGET
 * 2) "Region" (distractor)
 *
 * Configuration: the "Report range" select has dropdownOpened=true, so its dropdown list is already expanded on page load.
 * Options visible in the open list: Last 7 days, Last 30 days, Quarter to date, Year to date.
 *
 * Mixed guidance: next to the filter strip there is a small "Reference" chip that reads "Quarter to date" and includes a calendar icon.
 * The goal is to select the report range that matches this chip.
 *
 * Initial state: Report range currently shows "Last 7 days" as selected.
 * Clutter: the rest of the page contains several clickable KPI cards, charts, and an "Export" button (high clutter),
 * but they do not affect success.
 *
 * Feedback: selecting a range updates the filter value immediately; no Apply button is required.
 *
 * Success: The Select labeled "Report range" has selected value exactly "Quarter to date".
 */

import React, { useState } from 'react';
import { Card, Text, Select, Badge, Button, Group, Grid, Stack, Box } from '@mantine/core';
import { IconCalendar, IconDownload } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const reportRanges = [
  { value: 'Last 7 days', label: 'Last 7 days' },
  { value: 'Last 30 days', label: 'Last 30 days' },
  { value: 'Quarter to date', label: 'Quarter to date' },
  { value: 'Year to date', label: 'Year to date' },
];

const regions = [
  { value: 'North America', label: 'North America' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Asia Pacific', label: 'Asia Pacific' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [reportRange, setReportRange] = useState<string | null>('Last 7 days');
  const [region, setRegion] = useState<string | null>('North America');

  const handleRangeChange = (newValue: string | null) => {
    setReportRange(newValue);
    if (newValue === 'Quarter to date') {
      onSuccess();
    }
  };

  return (
    <Box style={{ width: '100%', maxWidth: 900 }}>
      {/* Filter Bar */}
      <Card shadow="sm" padding="sm" radius="md" withBorder mb="md">
        <Group>
          <Text size="sm" fw={500}>Filters:</Text>
          <Select
            data-testid="report-range-select"
            label="Report range"
            data={reportRanges}
            value={reportRange}
            onChange={handleRangeChange}
            size="xs"
            style={{ width: 150 }}
            defaultDropdownOpened
          />
          <Select
            data-testid="region-select"
            label="Region"
            data={regions}
            value={region}
            onChange={setRegion}
            size="xs"
            style={{ width: 150 }}
          />
          <Badge 
            leftSection={<IconCalendar size={12} />}
            variant="light"
            style={{ marginLeft: 8 }}
          >
            Reference: Quarter to date
          </Badge>
          <Button 
            size="xs" 
            variant="outline" 
            leftSection={<IconDownload size={14} />}
            style={{ marginLeft: 'auto' }}
          >
            Export
          </Button>
        </Group>
      </Card>

      {/* Dashboard Content */}
      <Grid>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text size="xs" c="dimmed">Revenue</Text>
            <Text size="xl" fw={700}>$1.2M</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text size="xs" c="dimmed">Orders</Text>
            <Text size="xl" fw={700}>8,432</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text size="xs" c="dimmed">Customers</Text>
            <Text size="xl" fw={700}>2,891</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={8}>
          <Card shadow="sm" padding="md" radius="md" withBorder style={{ height: 180 }}>
            <Text size="sm" fw={500} mb="xs">Revenue Trend</Text>
            <Stack align="center" justify="center" style={{ height: 130 }}>
              <Text c="dimmed">[Chart placeholder]</Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder style={{ height: 180 }}>
            <Text size="sm" fw={500} mb="xs">By Region</Text>
            <Stack align="center" justify="center" style={{ height: 130 }}>
              <Text c="dimmed">[Pie chart]</Text>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
