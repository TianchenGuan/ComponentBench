'use client';

/**
 * progress_bar-mantine-T04: Drawer: start upload until 40%
 *
 * Layout: drawer_flow. The page shows a card "Uploads" with a button "Open upload queue".
 *
 * Target component: one Mantine Progress bar labeled "File upload", located inside a left-side 
 * Drawer titled "Upload queue".
 *
 * Overlay behavior:
 * - Clicking "Open upload queue" opens the Drawer.
 * - Inside the Drawer, a single upload item is shown with its Progress bar and a "Start" button.
 *
 * Initial state:
 * - Progress value is 0% and idle.
 * - After clicking "Start", the progress increases and auto-pauses at exactly 40%.
 *
 * Success: Progress value is within ±1% of 40% and stable for 0.8 seconds.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Button, Group, Stack, Drawer, Anchor } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [value, setValue] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Check for success: within ±1% of 40% and stable for 0.8 seconds
  useEffect(() => {
    if (stabilityRef.current) {
      clearTimeout(stabilityRef.current);
      stabilityRef.current = null;
    }

    if (!isRunning && value >= 39 && value <= 41 && !successFiredRef.current) {
      stabilityRef.current = setTimeout(() => {
        if (!successFiredRef.current) {
          successFiredRef.current = true;
          onSuccess();
        }
      }, 800);
    }

    return () => {
      if (stabilityRef.current) {
        clearTimeout(stabilityRef.current);
      }
    };
  }, [value, isRunning, onSuccess]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setValue((prev) => {
        if (prev >= 40) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 40;
        }
        return prev + 1;
      });
    }, 100);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
        <Stack gap="md">
          <Text fw={600} size="lg">Uploads</Text>
          <Text size="sm" c="dimmed">
            View and manage your upload queue.
          </Text>
          <Button onClick={() => setDrawerOpened(true)}>
            Open upload queue
          </Button>
        </Stack>
      </Card>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Upload queue"
        position="left"
        size="sm"
      >
        <Stack gap="lg">
          <div>
            <Text fw={500} size="sm" mb={8}>File upload</Text>
            <Group gap="sm" align="center">
              <Progress
                value={value}
                aria-label="File upload"
                data-testid="file-upload-progress"
                style={{ flex: 1 }}
              />
              <Text size="sm" c="dimmed">{value}%</Text>
            </Group>
          </div>
          <Group>
            <Button onClick={handleStart} disabled={isRunning || value >= 40}>
              Start
            </Button>
          </Group>
          <Anchor size="sm" c="dimmed">Clear queue</Anchor>
        </Stack>
      </Drawer>
    </>
  );
}
