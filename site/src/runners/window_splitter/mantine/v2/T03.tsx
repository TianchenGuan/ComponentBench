'use client';

/**
 * window_splitter-mantine-v2-T03: ScrollArea dashboard — Release notes, Preview right 31%
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Badge,
  Box,
  Card,
  Group,
  ScrollArea,
  Text,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { HorizSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [draftPct, setDraftPct] = useState(50);
  const successFired = useRef(false);
  const previewPct = 100 - draftPct;

  useEffect(() => {
    if (!successFired.current && previewPct >= 30 && previewPct <= 32) {
      successFired.current = true;
      setTimeout(() => onSuccess(), 0);
    }
  }, [previewPct, onSuccess]);

  return (
    <Box p="xs" style={{ maxWidth: 640 }}>
      <Group justify="space-between" mb="xs">
        <Text fw={700} size="sm">Operations dashboard</Text>
        <Badge size="xs">v2</Badge>
      </Group>
      <ScrollArea h={380} type="scroll" offsetScrollbars>
        <StackSection />

        {/* Distractor splitter */}
        <Card withBorder padding="sm" radius="md" mb="md" shadow="xs">
          <Text fw={600} size="sm" mb="xs">Build status</Text>
          <Text size="xs" c="dimmed" mb="sm">Distractor splitter — do not use for the task goal.</Text>
          <Box style={{ height: 120, border: '1px solid var(--mantine-color-gray-3)', borderRadius: 4 }}>
            <HorizSplit
              defaultLeftPct={50}
              leftContent={
                <Box h="100%" bg="gray.1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text size="xs">Draft</Text>
                </Box>
              }
              rightContent={
                <Box h="100%" bg="gray.2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text size="xs">Preview</Text>
                </Box>
              }
              sepWidth={4}
            />
          </Box>
        </Card>

        {/* Target splitter */}
        <Card withBorder padding="sm" radius="md" shadow="xs" data-task-instance-label="Release notes">
          <Text fw={600} size="sm" mb={4}>Release notes</Text>
          <Text size="xs" c="dimmed" mb="sm">
            Draft (left) and Preview (right). Adjust the divider until Preview is about 31% wide.
          </Text>
          <Box
            style={{ height: 160, border: '1px solid var(--mantine-color-gray-4)', borderRadius: 4 }}
            data-testid="splitter-primary"
          >
            <HorizSplit
              defaultLeftPct={50}
              leftMin={12}
              leftMax={88}
              onLeftPctChange={setDraftPct}
              leftContent={
                <Box h="100%" bg="gray.1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text size="sm" fw={500}>Draft</Text>
                </Box>
              }
              rightContent={
                <Box h="100%" bg="gray.2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text size="sm" fw={500}>Preview</Text>
                </Box>
              }
            />
          </Box>
          <Text size="xs" c="dimmed" mt="xs" ta="center">
            Draft: {draftPct.toFixed(1)}% • Preview: {previewPct.toFixed(1)}%
          </Text>
        </Card>

        <Box h={320} />
      </ScrollArea>
    </Box>
  );
}

function StackSection() {
  return (
    <Box mb="md">
      <Text size="xs" c="dimmed" mb="xs">Summary</Text>
      <Group gap={6} wrap="wrap">
        {['Queues', 'SLO', 'Incidents', 'Deploys'].map((x) => (
          <Badge key={x} variant="dot" size="sm">{x}</Badge>
        ))}
      </Group>
    </Box>
  );
}
