'use client';

/**
 * slider_single-mantine-v2-T35: Recommendations similarity — match reference gauge ±0.01
 */

import React, { useEffect, useState } from 'react';
import { Badge, Box, Card, Group, Slider, Stack, Text } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T35({ onSuccess }: TaskComponentProps) {
  const [search, setSearch] = useState(0.55);
  const [reco, setReco] = useState(0.7);
  const [recoLine, setRecoLine] = useState(0.7);

  useEffect(() => {
    if (Math.abs(recoLine - 0.83) <= 0.01 && Math.abs(search - 0.55) < 0.001) {
      onSuccess();
    }
  }, [recoLine, search, onSuccess]);

  return (
    <Stack gap="sm" style={{ width: 420 }}>
      <Group justify="space-between">
        <Text fw={600} size="sm">
          Similarity dashboard
        </Text>
        <Badge size="xs" variant="light" color="gray">
          Live
        </Badge>
      </Group>
      <Text size="xs" c="dimmed">
        Tune retrieval thresholds per product area. Values use a 0.00–1.00 ratio scale.
      </Text>

      <Card padding="sm" radius="md" withBorder>
        <Text fw={500} size="sm" mb="xs">
          Search similarity threshold
        </Text>
        <Slider
          value={search}
          onChange={setSearch}
          min={0}
          max={1}
          step={0.01}
          label={null}
          data-testid="slider-search-similarity"
        />
        <Group justify="space-between" mt={6}>
          <Text size="xs" c="dimmed">
            Index: default
          </Text>
          <Text size="xs" c="dimmed">
            {search.toFixed(2)}
          </Text>
        </Group>
      </Card>

      <Card padding="sm" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
          <Text fw={500} size="sm">
            Recommendations similarity threshold
          </Text>
          <Badge size="xs" variant="outline" data-reference-id="ref-reco-similarity">
            Target: match gauge
          </Badge>
        </Group>
        <Box
          mb="sm"
          style={{
            height: 10,
            borderRadius: 4,
            background: 'var(--mantine-color-gray-2)',
            overflow: 'hidden',
          }}
          aria-label="Reference gauge 0.83"
        >
          <Box
            style={{
              width: '83%',
              height: '100%',
              background: 'var(--mantine-color-teal-6)',
            }}
          />
        </Box>
        <Slider
          value={reco}
          onChange={setReco}
          onChangeEnd={(v) => setRecoLine(v)}
          min={0}
          max={1}
          step={0.01}
          label={null}
          data-testid="slider-reco-similarity"
        />
        <Text size="xs" c="dimmed" mt={6}>
          Current: {recoLine.toFixed(2)}
        </Text>
      </Card>

      <Group gap="xs">
        <Badge size="xs">cohort A</Badge>
        <Badge size="xs" variant="dot">
          experiments
        </Badge>
        <Text size="xs" c="dimmed">
          Last sync 2m ago
        </Text>
      </Group>
    </Stack>
  );
}
