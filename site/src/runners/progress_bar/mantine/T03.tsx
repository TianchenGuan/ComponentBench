'use client';

/**
 * progress_bar-mantine-T03: Reset progress to 0%
 *
 * Layout: isolated_card centered, titled "Task progress".
 *
 * Target component: one Mantine Progress bar labeled "Task progress", starting at 65% (static).
 *
 * Controls:
 * - "Reset" button: sets Progress value to 0%.
 * - "Start" button: starts incrementing from current value (distractor).
 *
 * Success: Mantine Progress value equals 0%.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Button, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(65);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (value === 0 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

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
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setValue(0);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">Task progress</Text>
        <div>
          <Text fw={500} size="sm" mb={8}>Task progress</Text>
          <Group gap="sm" align="center">
            <Progress
              value={value}
              aria-label="Task progress"
              data-testid="task-progress"
              style={{ flex: 1 }}
            />
            <Text size="sm" c="dimmed">{value}%</Text>
          </Group>
        </div>
        <Group>
          <Button variant="outline" onClick={handleStart} disabled={isRunning}>
            Start
          </Button>
          <Button onClick={handleReset}>
            Reset
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
