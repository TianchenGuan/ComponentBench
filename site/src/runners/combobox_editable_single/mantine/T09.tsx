'use client';

/**
 * combobox_editable_single-mantine-T09: Match Segment filter to reference chip (3 filters on dashboard)
 *
 * An analytics dashboard is shown with a row of filter controls at the top.
 * The filters are implemented as Mantine Autocomplete inputs.
 * - Scene: dashboard layout, center placement, light theme, comfortable spacing, default scale.
 * - Instances: 3 Autocomplete combobox filters in a horizontal row:
 *   - "Region" (distractor)
 *   - "Segment" (TARGET)
 *   - "Metric" (distractor)
 * - Guidance: A "Reference" chip shows the desired Segment value.
 * - Initial state: all three filters are empty.
 * - Distractors: charts, left nav, toolbar buttons.
 *
 * Success: The Autocomplete instance labeled "Segment" matches the value shown in the Reference chip.
 */

import React, { useState } from 'react';
import { Card, Text, Autocomplete, Badge, Group, Box, Button, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const regions = ['North America', 'South America', 'Europe', 'Asia Pacific'];
const segments = ['SMB', 'Mid-market', 'Enterprise', 'Consumer'];
const metrics = ['Revenue', 'Active users', 'Churn', 'NPS'];

// Deterministic reference value
const referenceSegment = 'Enterprise';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [region, setRegion] = useState('');
  const [segment, setSegment] = useState('');
  const [metric, setMetric] = useState('');

  const handleSegmentChange = (newValue: string) => {
    setSegment(newValue);
    if (newValue === referenceSegment) {
      onSuccess();
    }
  };

  return (
    <Box style={{ display: 'flex', background: '#f8f9fa', minWidth: 900, borderRadius: 8 }}>
      {/* Sidebar */}
      <Box style={{ width: 180, background: '#fff', padding: 16, borderRight: '1px solid #e9ecef' }}>
        <Text size="sm" c="dimmed" mb="md">Navigation</Text>
        <Stack gap="xs">
          {['Overview', 'Analytics', 'Reports', 'Settings'].map((item) => (
            <Text 
              key={item} 
              size="sm" 
              style={{ 
                padding: '8px 0', 
                color: item === 'Analytics' ? '#228be6' : '#495057',
                cursor: 'default'
              }}
            >
              {item}
            </Text>
          ))}
        </Stack>
      </Box>

      {/* Main content */}
      <Box style={{ flex: 1, padding: 24 }}>
        <Group justify="space-between" mb="lg">
          <Text fw={600} size="xl">Analytics dashboard</Text>
          <Group>
            <Button variant="outline" size="xs">Export</Button>
            <Button variant="outline" size="xs">Refresh</Button>
          </Group>
        </Group>

        {/* Reference chip */}
        <Group mb="md">
          <Text size="sm" c="dimmed">Reference:</Text>
          <Badge id="segment-reference" color="blue" variant="filled">
            {referenceSegment}
          </Badge>
        </Group>

        {/* Filters row */}
        <Group mb="lg">
          <Box style={{ width: 180 }}>
            <Text size="sm" fw={500} mb={4}>Region</Text>
            <Autocomplete
              data-testid="region-filter"
              placeholder="Select region"
              data={regions}
              value={region}
              onChange={setRegion}
              size="sm"
            />
          </Box>
          <Box style={{ width: 180 }}>
            <Text size="sm" fw={500} mb={4}>Segment</Text>
            <Autocomplete
              data-testid="segment-filter"
              placeholder="Select segment"
              data={segments}
              value={segment}
              onChange={handleSegmentChange}
              size="sm"
            />
          </Box>
          <Box style={{ width: 180 }}>
            <Text size="sm" fw={500} mb={4}>Metric</Text>
            <Autocomplete
              data-testid="metric-filter"
              placeholder="Select metric"
              data={metrics}
              value={metric}
              onChange={setMetric}
              size="sm"
            />
          </Box>
        </Group>

        {/* Chart placeholders */}
        <Group>
          <Card style={{ width: 250, height: 150, background: '#e9ecef' }}>
            <Text size="sm" c="dimmed">Revenue Chart</Text>
          </Card>
          <Card style={{ width: 250, height: 150, background: '#e9ecef' }}>
            <Text size="sm" c="dimmed">Users Chart</Text>
          </Card>
        </Group>
      </Box>
    </Box>
  );
}
