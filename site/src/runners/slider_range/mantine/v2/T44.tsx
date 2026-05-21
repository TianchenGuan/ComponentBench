'use client';

/**
 * slider_range-mantine-v2-T44: Release window restrictToMarks in crowded dashboard (no Apply)
 */

import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Card,
  Group,
  Paper,
  RangeSlider,
  SimpleGrid,
  Text,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const releaseMarks = [
  { value: 5, label: '5' },
  { value: 15, label: '15' },
  { value: 25, label: '25' },
  { value: 35, label: '35' },
  { value: 70, label: '70' },
  { value: 80, label: '80' },
  { value: 90, label: '90' },
];

const initialRelease: [number, number] = [5, 90];
const initialA: [number, number] = [20, 80];
const initialB: [number, number] = [10, 50];
const initialC: [number, number] = [30, 70];
const initialD: [number, number] = [5, 95];

export default function T44({ onSuccess }: TaskComponentProps) {
  const [release, setRelease] = useState<[number, number]>(initialRelease);
  const [sA, setSA] = useState<[number, number]>(initialA);
  const [sB, setSB] = useState<[number, number]>(initialB);
  const [sC, setSC] = useState<[number, number]>(initialC);
  const [sD, setSD] = useState<[number, number]>(initialD);

  useEffect(() => {
    const target =
      release[0] === 35 &&
      release[1] === 80 &&
      sA[0] === initialA[0] &&
      sA[1] === initialA[1] &&
      sB[0] === initialB[0] &&
      sB[1] === initialB[1] &&
      sC[0] === initialC[0] &&
      sC[1] === initialC[1] &&
      sD[0] === initialD[0] &&
      sD[1] === initialD[1];
    if (target) {
      onSuccess();
    }
  }, [release, sA, sB, sC, sD, onSuccess]);

  return (
    <Box maw={760}>
      <Group justify="space-between" mb="md">
        <Text fw={700} size="md">
          Release controls
        </Text>
        <Badge variant="light" size="sm">
          Staging
        </Badge>
      </Group>

      <SimpleGrid cols={2} spacing="sm">
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">
            Deploy cadence
          </Text>
          <Text fw={700}>Daily</Text>
        </Paper>
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">
            Rollback SLA
          </Text>
          <Text fw={700}>15m</Text>
        </Paper>

        <Card withBorder padding="sm" radius="md">
          <Text fw={600} size="sm" mb="xs">
            Release controls
          </Text>
          <Text size="sm" mb="xs">
            Release window
          </Text>
          <RangeSlider
            value={release}
            onChange={setRelease}
            min={0}
            max={100}
            marks={releaseMarks}
            restrictToMarks
            data-testid="release-window-range"
            mb="xs"
          />
          <Text size="xs" c="dimmed">
            Selected: {release[0]} - {release[1]}
          </Text>
        </Card>

        <Card withBorder padding="sm" radius="md">
          <Text fw={600} size="sm" mb="xs">
            Quality metrics
          </Text>
          <Text size="sm" mb="xs">
            Error threshold
          </Text>
          <RangeSlider
            value={sA}
            onChange={setSA}
            min={0}
            max={100}
            step={10}
            data-testid="error-threshold-range"
            mb="xs"
          />
          <Text size="xs" c="dimmed">
            Selected: {sA[0]} - {sA[1]}
          </Text>
        </Card>

        <Card withBorder padding="sm" radius="md">
          <Text fw={600} size="sm" mb="xs">
            Performance
          </Text>
          <Text size="sm" mb="xs">
            Load threshold
          </Text>
          <RangeSlider
            value={sB}
            onChange={setSB}
            min={0}
            max={100}
            step={5}
            data-testid="load-threshold-range"
            mb="xs"
          />
          <Text size="xs" c="dimmed">
            Selected: {sB[0]} - {sB[1]}
          </Text>
        </Card>

        <Card withBorder padding="sm" radius="md">
          <Text fw={600} size="sm" mb="xs">
            Latency budget
          </Text>
          <Text size="sm" mb="xs">
            P99 window
          </Text>
          <RangeSlider
            value={sC}
            onChange={setSC}
            min={0}
            max={100}
            step={5}
            data-testid="p99-window-range"
            mb="xs"
          />
          <Text size="xs" c="dimmed">
            Selected: {sC[0]} - {sC[1]}
          </Text>
        </Card>

        <Card withBorder padding="sm" radius="md">
          <Text fw={600} size="sm" mb="xs">
            Capacity
          </Text>
          <Text size="sm" mb="xs">
            Saturation band
          </Text>
          <RangeSlider
            value={sD}
            onChange={setSD}
            min={0}
            max={100}
            step={5}
            data-testid="saturation-band-range"
            mb="xs"
          />
          <Text size="xs" c="dimmed">
            Selected: {sD[0]} - {sD[1]}
          </Text>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
