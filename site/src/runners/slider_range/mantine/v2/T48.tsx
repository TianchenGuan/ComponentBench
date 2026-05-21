'use client';

/**
 * slider_range-mantine-v2-T48: Streaming section below fold — Buffer range, Retry window, Apply section
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Group,
  RangeSlider,
  ScrollArea,
  Text,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T48({ onSuccess }: TaskComponentProps) {
  const [draftBuf, setDraftBuf] = useState<[number, number]>([1, 4]);
  const [draftRetry, setDraftRetry] = useState<[number, number]>([3, 7]);
  const [committedBuf, setCommittedBuf] = useState<[number, number]>([1, 4]);
  const [committedRetry, setCommittedRetry] = useState<[number, number]>([3, 7]);

  const apply = () => {
    setCommittedBuf(draftBuf);
    setCommittedRetry(draftRetry);
  };

  useEffect(() => {
    if (
      committedBuf[0] === 2 &&
      committedBuf[1] === 6 &&
      committedRetry[0] === 3 &&
      committedRetry[1] === 7
    ) {
      onSuccess();
    }
  }, [committedBuf, committedRetry, onSuccess]);

  return (
    <Card withBorder padding="sm" radius="md" maw={420}>
      <Text fw={700} size="sm" mb="xs">
        Ingest settings
      </Text>
      <ScrollArea h={280} type="scroll" offsetScrollbars>
        <Box pb="md">
          <Text fw={600} size="sm" mb="xs">
            General
          </Text>
          {Array.from({ length: 14 }, (_, i) => (
            <Text key={i} size="xs" c="dimmed" mb={6}>
              Option {i + 1}: keep defaults for baseline throughput, shard routing, and retention unless ops overrides apply.
            </Text>
          ))}
        </Box>

        <Box>
          <Text fw={600} size="sm" mb="xs">
            Streaming
          </Text>
          <Text fw={500} size="sm" mb={4}>
            Buffer range
          </Text>
          <Box style={{ touchAction: 'none' }}>
            <RangeSlider
              value={draftBuf}
              onChange={setDraftBuf}
              min={0}
              max={10}
              step={1}
              minRange={1}
              data-testid="buffer-range"
              mb="xs"
            />
          </Box>
          <Text size="xs" c="dimmed" mb="md">
            Selected: {draftBuf[0]} - {draftBuf[1]} s
          </Text>

          <Text fw={500} size="sm" mb={4}>
            Retry window
          </Text>
          <Box style={{ touchAction: 'none' }}>
            <RangeSlider
              value={draftRetry}
              onChange={setDraftRetry}
              min={0}
              max={10}
              step={1}
              minRange={1}
              data-testid="streaming-retry-window-range"
              mb="xs"
            />
          </Box>
          <Text size="xs" c="dimmed" mb="md">
            Selected: {draftRetry[0]} - {draftRetry[1]} s
          </Text>

          <Group justify="flex-end">
            <Button size="xs" onClick={apply}>
              Apply section
            </Button>
          </Group>
        </Box>
      </ScrollArea>
    </Card>
  );
}
