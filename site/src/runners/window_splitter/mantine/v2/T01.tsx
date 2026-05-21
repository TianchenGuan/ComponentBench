'use client';

/**
 * window_splitter-mantine-v2-T01: Top drawer vertical split — Timeline 62% + Save layout
 *
 * "Timeline layout" opens a top Drawer with vertical stack (Timeline top, Errors bottom).
 * Live readout; Cancel / Save layout; only Save commits.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Drawer,
  Group,
  Text,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { VertSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [layoutKey, setLayoutKey] = useState(0);
  const [timelinePct, setTimelinePct] = useState(50);
  const [committedPct, setCommittedPct] = useState<number | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (opened) setTimelinePct(50);
  }, [opened, layoutKey]);

  useEffect(() => {
    if (
      !successFired.current &&
      committedPct !== null &&
      committedPct >= 61 &&
      committedPct <= 63
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedPct, onSuccess]);

  const save = () => {
    setCommittedPct(timelinePct);
    setOpened(false);
  };

  const cancel = () => {
    setOpened(false);
    setLayoutKey((k) => k + 1);
    setTimelinePct(50);
  };

  return (
    <Box p="xs" style={{ maxWidth: 520 }}>
      <Button size="sm" onClick={() => setOpened(true)} mb="sm">
        Timeline layout
      </Button>
      {committedPct !== null && (
        <Text size="xs" c="green" mb="xs" data-committed-layout={`${committedPct},${100 - committedPct}`}>
          Saved: Timeline {committedPct.toFixed(1)}% • Errors {(100 - committedPct).toFixed(1)}%
        </Text>
      )}

      <Drawer
        opened={opened}
        onClose={cancel}
        position="top"
        title="Timeline layout"
        size="md"
        offset={12}
      >
        <Box p="sm">
          <Box
            key={layoutKey}
            style={{ height: 260, border: '1px solid var(--mantine-color-gray-4)', borderRadius: 4 }}
            data-testid="splitter-primary"
          >
            <VertSplit
              defaultTopPct={50}
              topMin={10}
              topMax={90}
              onTopPctChange={setTimelinePct}
              topContent={
                <Box
                  h="100%"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--mantine-color-gray-1)',
                  }}
                >
                  <Text fw={600} size="sm">Timeline</Text>
                </Box>
              }
              bottomContent={
                <Box
                  h="100%"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--mantine-color-gray-2)',
                  }}
                >
                  <Text fw={600} size="sm">Errors</Text>
                </Box>
              }
            />
          </Box>
          <Group justify="space-between" my="sm">
            <Text size="xs" c="dimmed">
              Timeline: {timelinePct.toFixed(1)}% • Errors: {(100 - timelinePct).toFixed(1)}%
            </Text>
            <Badge color="yellow" size="xs" variant="light">
              Unsaved until Save layout
            </Badge>
          </Group>
          <Group justify="flex-end" gap="xs">
            <Button variant="default" size="xs" onClick={cancel}>Cancel</Button>
            <Button size="xs" onClick={save}>Save layout</Button>
          </Group>
        </Box>
      </Drawer>
    </Box>
  );
}
