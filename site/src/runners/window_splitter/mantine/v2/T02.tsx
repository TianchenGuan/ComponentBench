'use client';

/**
 * window_splitter-mantine-v2-T02: Right drawer with offset — Canvas 58% + Save layout
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
import { HorizSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [layoutKey, setLayoutKey] = useState(0);
  const [canvasPct, setCanvasPct] = useState(50);
  const [committedPct, setCommittedPct] = useState<number | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (opened) setCanvasPct(50);
  }, [opened, layoutKey]);

  useEffect(() => {
    if (
      !successFired.current &&
      committedPct !== null &&
      committedPct >= 57 &&
      committedPct <= 59
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedPct, onSuccess]);

  const save = () => {
    setCommittedPct(canvasPct);
    setOpened(false);
  };

  const cancel = () => {
    setOpened(false);
    setLayoutKey((k) => k + 1);
    setCanvasPct(50);
  };

  return (
    <Box p="xs" style={{ maxWidth: 480 }}>
      <Group gap="xs" mb="sm" wrap="wrap">
        <Badge variant="light">Build 4821</Badge>
        <Badge variant="outline" color="gray">Latency OK</Badge>
      </Group>
      <Button size="sm" onClick={() => setOpened(true)}>
        Canvas layout
      </Button>
      {committedPct !== null && (
        <Text size="xs" c="green" mt="xs" data-committed-layout={`${committedPct},${100 - committedPct}`}>
          Saved: Canvas {committedPct.toFixed(1)}% • Settings {(100 - committedPct).toFixed(1)}%
        </Text>
      )}

      <Drawer
        opened={opened}
        onClose={cancel}
        position="right"
        title="Canvas layout"
        size="lg"
        offset={18}
      >
        <Box p="sm">
          <Box
            key={layoutKey}
            style={{ height: 280, border: '1px solid var(--mantine-color-gray-4)', borderRadius: 4 }}
            data-testid="splitter-primary"
          >
            <HorizSplit
              defaultLeftPct={50}
              leftMin={10}
              leftMax={90}
              onLeftPctChange={setCanvasPct}
              leftContent={
                <Box
                  h="100%"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--mantine-color-gray-1)',
                  }}
                >
                  <Text fw={600} size="sm">Canvas</Text>
                </Box>
              }
              rightContent={
                <Box
                  h="100%"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--mantine-color-gray-2)',
                  }}
                >
                  <Text fw={600} size="sm">Settings</Text>
                </Box>
              }
            />
          </Box>
          <Group justify="space-between" my="sm">
            <Text size="xs" c="dimmed">
              Canvas: {canvasPct.toFixed(1)}% • Settings: {(100 - canvasPct).toFixed(1)}%
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
