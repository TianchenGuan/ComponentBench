'use client';

/**
 * progress_bar-mantine-T01: Complete media upload to 100%
 *
 * Layout: isolated_card centered (Mantine Card titled "Media upload").
 *
 * Target component: one Mantine Progress bar labeled "Upload progress" (aria-label set). 
 * It starts at 0% and is horizontal with default size.
 *
 * Controls:
 * - "Start upload" button: increases Progress value from 0% to 100% over ~10 seconds.
 * - "Pause" button (disabled initially): pauses the progress (not needed).
 * - "Reset" button: sets value back to 0% (distractor).
 *
 * Success: Progress value equals 100%.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Button, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (value >= 100 && !successFiredRef.current) {
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

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setValue(0);
    successFiredRef.current = false;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">Media upload</Text>
        <div>
          <Text fw={500} size="sm" mb={8}>Upload progress</Text>
          <Group gap="sm" align="center">
            <Progress
              value={value}
              aria-label="Upload progress"
              data-testid="upload-progress"
              style={{ flex: 1 }}
            />
            <Text size="sm" c="dimmed">{value}%</Text>
          </Group>
        </div>
        <Group>
          <Button onClick={handleStart} disabled={isRunning || value >= 100}>
            Start upload
          </Button>
          <Button variant="outline" onClick={handlePause} disabled={!isRunning}>
            Pause
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
