'use client';

/**
 * slider_range-mantine-T08: Restrict to marks in a dashboard card (dense choices)
 * 
 * Layout: dashboard with multiple cards (KPIs, charts, and controls) creating realistic clutter.
 * One card titled "Release controls" contains a Mantine RangeSlider labeled "Release window".
 * - Slider configuration: restrictToMarks=true (values can only be set to marks), marks at [5, 15, 25, 35, 70, 80, 90], step ignored.
 * - Initial state: Selected is 5-90 with readout "Selected: 5 - 90".
 * The marks are relatively dense and not evenly spaced, and several other dashboard widgets are visible but unrelated.
 * No Apply/Reset; changes are immediate.
 * 
 * Success: Target range is set to 35-80 units (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, RangeSlider, SimpleGrid, Paper, Group, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const marks = [
  { value: 5, label: '5' },
  { value: 15, label: '15' },
  { value: 25, label: '25' },
  { value: 35, label: '35' },
  { value: 70, label: '70' },
  { value: 80, label: '80' },
  { value: 90, label: '90' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [releaseWindow, setReleaseWindow] = useState<[number, number]>([5, 90]);
  const [otherSlider1, setOtherSlider1] = useState<[number, number]>([20, 80]);
  const [otherSlider2, setOtherSlider2] = useState<[number, number]>([10, 50]);

  useEffect(() => {
    if (releaseWindow[0] === 35 && releaseWindow[1] === 80) {
      onSuccess();
    }
  }, [releaseWindow, onSuccess]);

  return (
    <div style={{ width: 700 }}>
      <Text fw={700} size="xl" mb="lg">Dashboard</Text>

      <SimpleGrid cols={2} spacing="md">
        {/* KPI Card 1 */}
        <Paper shadow="xs" p="md" withBorder>
          <Text c="dimmed" size="sm">Total Users</Text>
          <Text fw={700} size="xl">12,543</Text>
          <Badge color="green" variant="light" mt="xs">+12%</Badge>
        </Paper>

        {/* KPI Card 2 */}
        <Paper shadow="xs" p="md" withBorder>
          <Text c="dimmed" size="sm">Revenue</Text>
          <Text fw={700} size="xl">$84,230</Text>
          <Badge color="blue" variant="light" mt="xs">+8%</Badge>
        </Paper>

        {/* Other Slider Card 1 */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} mb="md">Quality metrics</Text>
          <Text size="sm" mb="sm">Error threshold</Text>
          <RangeSlider
            value={otherSlider1}
            onChange={setOtherSlider1}
            min={0}
            max={100}
            step={10}
            data-testid="error-threshold-range"
            mb="xs"
          />
          <Text c="dimmed" size="xs">Selected: {otherSlider1[0]} - {otherSlider1[1]}</Text>
        </Card>

        {/* Target Card - Release controls */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} mb="md">Release controls</Text>
          <Text size="sm" mb="sm">Release window</Text>
          <RangeSlider
            value={releaseWindow}
            onChange={setReleaseWindow}
            min={0}
            max={100}
            marks={marks}
            restrictToMarks
            data-testid="release-window-range"
            mb="lg"
          />
          <Text c="dimmed" size="xs">Selected: {releaseWindow[0]} - {releaseWindow[1]}</Text>
        </Card>

        {/* Other Slider Card 2 */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} mb="md">Performance</Text>
          <Text size="sm" mb="sm">Load threshold</Text>
          <RangeSlider
            value={otherSlider2}
            onChange={setOtherSlider2}
            min={0}
            max={100}
            step={5}
            data-testid="load-threshold-range"
            mb="xs"
          />
          <Text c="dimmed" size="xs">Selected: {otherSlider2[0]} - {otherSlider2[1]}</Text>
        </Card>

        {/* Chart placeholder */}
        <Paper shadow="xs" p="md" withBorder>
          <Text c="dimmed" size="sm" mb="sm">Weekly Trend</Text>
          <Group gap={2} align="flex-end" h={60}>
            {[30, 45, 65, 80, 55, 40, 70].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: '#228be6',
                  borderRadius: 2,
                }}
              />
            ))}
          </Group>
        </Paper>
      </SimpleGrid>
    </div>
  );
}
