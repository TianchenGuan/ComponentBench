'use client';

/**
 * window_splitter-mantine-v2-T04: Secondary card only — Queue/Detail, Detail (right) 42%
 */

import React, { useEffect, useRef, useState } from 'react';
import { Badge, Box, Card, Group, Text } from '@mantine/core';
import '@mantine/core/styles.css';
import { HorizSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [queuePct, setQueuePct] = useState(50);
  const successFired = useRef(false);
  const detailPct = 100 - queuePct;

  useEffect(() => {
    if (!successFired.current && detailPct >= 41 && detailPct <= 43) {
      successFired.current = true;
      setTimeout(() => onSuccess(), 0);
    }
  }, [detailPct, onSuccess]);

  return (
    <Box p="xs" style={{ maxWidth: 520 }}>
      <Group gap="xs" mb="md" wrap="wrap">
        <Badge variant="light">Workspace</Badge>
        <Text size="xs" c="dimmed">Two similar splitters — adjust only the secondary card.</Text>
      </Group>

      {/* Distractor */}
      <Card withBorder padding="sm" radius="md" mb="md" shadow="xs">
        <Text fw={600} size="sm" mb="xs">Primary — Editor/Preview</Text>
        <Box style={{ height: 140, border: '1px solid var(--mantine-color-gray-3)', borderRadius: 4 }}>
          <HorizSplit
            defaultLeftPct={50}
            leftContent={
              <Box h="100%" bg="gray.0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="xs">Editor</Text>
              </Box>
            }
            rightContent={
              <Box h="100%" bg="gray.1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="xs">Preview</Text>
              </Box>
            }
            sepWidth={4}
          />
        </Box>
        <Text size="xs" c="dimmed" mt="xs" ta="center">Local readout: 50% / 50%</Text>
      </Card>

      {/* Target */}
      <Card withBorder padding="sm" radius="md" shadow="xs" data-task-instance-label="Secondary — Queue/Detail">
        <Text fw={600} size="sm" mb="xs">Secondary — Queue/Detail</Text>
        <Box
          style={{ height: 160, border: '1px solid var(--mantine-color-gray-4)', borderRadius: 4 }}
          data-testid="splitter-primary"
        >
          <HorizSplit
            defaultLeftPct={50}
            leftMin={12}
            leftMax={88}
            onLeftPctChange={setQueuePct}
            leftContent={
              <Box h="100%" bg="gray.0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="sm" fw={500}>Queue</Text>
              </Box>
            }
            rightContent={
              <Box h="100%" bg="gray.2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="sm" fw={500}>Detail</Text>
              </Box>
            }
          />
        </Box>
        <Text size="xs" c="dimmed" mt="xs" ta="center">
          Queue: {queuePct.toFixed(1)}% • Detail: {detailPct.toFixed(1)}%
        </Text>
      </Card>
    </Box>
  );
}
