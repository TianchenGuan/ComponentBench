'use client';

/**
 * slider_single-mantine-T10: Match reference gauge for Recommendations similarity (0.83)
 * 
 * Layout: dashboard scene anchored to the bottom-right of the viewport with multiple KPI cards and charts (high clutter).
 * Two cards on the dashboard each contain a Mantine Slider:
 *   - "Search similarity threshold"
 *   - "Recommendations similarity threshold" (TARGET)
 * Both sliders share the same configuration: range 0.00–1.00, step=0.01, marks hidden. The floating label appears while dragging.
 * Visual guidance: within the target card, a small "Reference gauge" (mini progress arc) shows the desired threshold position without numeric text.
 * Initial state: Recommendations threshold starts at 0.70; the reference corresponds to a hidden target value of 0.83.
 * Feedback: the numeric label is visible only during drag; after release, the card shows a tiny text "Current: 0.xx" that updates.
 * No Apply/Cancel controls exist.
 * 
 * Success: The 'Recommendations similarity threshold' slider matches the reference value (reference target is 0.83). Acceptance tolerance: within ±0.01 of the reference value. The correct instance is required: only the Recommendations slider counts.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Slider, SimpleGrid, Paper, Group, Badge, RingProgress } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = 0.83;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [searchSimilarity, setSearchSimilarity] = useState(0.60);
  const [recoSimilarity, setRecoSimilarity] = useState(0.70);

  useEffect(() => {
    if (Math.abs(recoSimilarity - TARGET_VALUE) <= 0.01) {
      onSuccess();
    }
  }, [recoSimilarity, onSuccess]);

  return (
    <div style={{ width: 650 }}>
      <Text fw={700} size="xl" mb="lg">Relevance dashboard</Text>

      <SimpleGrid cols={2} spacing="md">
        {/* KPI Card 1 */}
        <Paper shadow="xs" p="md" withBorder>
          <Text c="dimmed" size="sm">Total Queries</Text>
          <Text fw={700} size="xl">45,231</Text>
          <Badge color="green" variant="light" mt="xs">+18%</Badge>
        </Paper>

        {/* KPI Card 2 */}
        <Paper shadow="xs" p="md" withBorder>
          <Text c="dimmed" size="sm">Avg Latency</Text>
          <Text fw={700} size="xl">142ms</Text>
          <Badge color="blue" variant="light" mt="xs">Normal</Badge>
        </Paper>

        {/* Search Similarity Card */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} mb="md">Search similarity threshold</Text>
          <Slider
            value={searchSimilarity}
            onChange={setSearchSimilarity}
            min={0}
            max={1}
            step={0.01}
            label={(v) => v.toFixed(2)}
            data-testid="slider-similarity-search"
            mb="xs"
          />
          <Text c="dimmed" size="xs">Current: {searchSimilarity.toFixed(2)}</Text>
        </Card>

        {/* Recommendations Similarity Card - TARGET */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} mb="md">Recommendations similarity threshold</Text>
          <Group align="flex-start" gap="md">
            <div style={{ flex: 1 }}>
              <Slider
                value={recoSimilarity}
                onChange={setRecoSimilarity}
                min={0}
                max={1}
                step={0.01}
                label={(v) => v.toFixed(2)}
                data-testid="slider-similarity-recommendations"
                mb="xs"
              />
              <Text c="dimmed" size="xs">Current: {recoSimilarity.toFixed(2)}</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text c="dimmed" size="xs" mb={4}>Reference gauge</Text>
              <RingProgress
                size={50}
                thickness={4}
                sections={[{ value: TARGET_VALUE * 100, color: 'blue' }]}
                data-testid="ref-reco-similarity"
                data-ref-value={TARGET_VALUE}
              />
            </div>
          </Group>
        </Card>

        {/* Chart placeholder */}
        <Paper shadow="xs" p="md" withBorder>
          <Text c="dimmed" size="sm" mb="sm">Query Distribution</Text>
          <Group gap={2} align="flex-end" h={60}>
            {[25, 40, 60, 75, 50, 35, 65, 80, 55, 45].map((h, i) => (
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

        {/* Another KPI */}
        <Paper shadow="xs" p="md" withBorder>
          <Text c="dimmed" size="sm">Cache Hit Rate</Text>
          <Text fw={700} size="xl">89.2%</Text>
          <Badge color="teal" variant="light" mt="xs">Excellent</Badge>
        </Paper>
      </SimpleGrid>
    </div>
  );
}
