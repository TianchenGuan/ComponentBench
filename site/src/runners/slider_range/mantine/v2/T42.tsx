'use client';

/**
 * slider_range-mantine-v2-T42: Quality gate from a visual acceptable band (dashboard, Apply gates)
 */

import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Paper,
  RangeSlider,
  SimpleGrid,
  Text,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T42({ onSuccess }: TaskComponentProps) {
  const [draftQ, setDraftQ] = useState<[number, number]>([0, 100]);
  const [draftS, setDraftS] = useState<[number, number]>([20, 80]);
  const [committedQ, setCommittedQ] = useState<[number, number]>([0, 100]);
  const [committedS, setCommittedS] = useState<[number, number]>([20, 80]);

  const apply = () => {
    setCommittedQ(draftQ);
    setCommittedS(draftS);
  };

  useEffect(() => {
    const qOk =
      committedQ[0] >= 13 &&
      committedQ[0] <= 17 &&
      committedQ[1] >= 43 &&
      committedQ[1] <= 47;
    const sOk = committedS[0] === 20 && committedS[1] === 80;
    if (qOk && sOk) {
      onSuccess();
    }
  }, [committedQ, committedS, onSuccess]);

  return (
    <Box maw={720}>
      <Group justify="space-between" mb="md">
        <Text fw={700} size="md">
          Dashboard
        </Text>
        <Group gap={6}>
          <Badge size="xs" variant="dot">
            Live
          </Badge>
          <Badge size="xs" color="orange">
            3 alerts
          </Badge>
        </Group>
      </Group>

      <SimpleGrid cols={2} spacing="sm">
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">
            Throughput
          </Text>
          <Text fw={700} size="lg">
            482 req/s
          </Text>
        </Paper>
        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed">
            Error budget
          </Text>
          <Text fw={700} size="lg">
            12%
          </Text>
        </Paper>

        <Card withBorder padding="sm" radius="md">
          <Text fw={600} size="sm" mb="xs">
            Quality gate
          </Text>
          <Box mb="sm">
            <Box
              style={{
                position: 'relative',
                height: 22,
                background: 'var(--mantine-color-gray-2)',
                borderRadius: 4,
              }}
            >
              <Box
                style={{
                  position: 'absolute',
                  left: '15%',
                  width: '30%',
                  height: '100%',
                  background: 'var(--mantine-color-blue-filled)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text size="xs" c="white" fw={500}>
                  Acceptable
                </Text>
              </Box>
            </Box>
          </Box>
          <RangeSlider
            value={draftQ}
            onChange={setDraftQ}
            min={0}
            max={100}
            step={1}
            data-testid="quality-gate-range"
            mb="xs"
          />
          <Text size="xs" c="dimmed">
            Selected: {draftQ[0]} - {draftQ[1]} pts
          </Text>
        </Card>

        <Card withBorder padding="sm" radius="md">
          <Text fw={600} size="sm" mb="xs">
            Stability gate
          </Text>
          <RangeSlider
            value={draftS}
            onChange={setDraftS}
            min={0}
            max={100}
            step={1}
            data-testid="stability-gate-range"
            mb="xs"
          />
          <Text size="xs" c="dimmed">
            Selected: {draftS[0]} - {draftS[1]} pts
          </Text>
        </Card>

        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed" mb={6}>
            Shard health
          </Text>
          <Group gap={4} align="flex-end" h={48}>
            {[40, 62, 55, 70, 48, 58, 66].map((h, i) => (
              <Box
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: 'var(--mantine-color-teal-filled)',
                  borderRadius: 2,
                }}
              />
            ))}
          </Group>
        </Paper>

        <Paper p="sm" withBorder>
          <Text size="xs" c="dimmed" mb={6}>
            Queue depth
          </Text>
          <Group gap={4} wrap="wrap">
            {['A', 'B', 'C', 'D'].map((x) => (
              <Badge key={x} variant="outline" size="xs">
                Node {x}
              </Badge>
            ))}
          </Group>
        </Paper>
      </SimpleGrid>

      <Group justify="flex-end" mt="md">
        <Button size="xs" onClick={apply}>
          Apply gates
        </Button>
      </Group>
    </Box>
  );
}
