'use client';

/**
 * progress_bar-mantine-T08: Vertical small progress: pause near 73%
 *
 * Layout: isolated_card anchored near the top-left of the viewport. Spacing is compact and 
 * the component scale is small.
 *
 * Target component: one Mantine Progress configured with a fixed height (vertical style). 
 * It is labeled "Vertical progress". Initial value is 0%.
 *
 * Controls:
 * - "Start" button: begins increasing the value steadily.
 * - "Pause" button: freezes the value; toggles to "Resume" after pausing.
 * - "Reset" link: returns to 0% (distractor).
 *
 * Success: Vertical progress value within ±2% of 73% and stable for 1 second.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Button, Group, Stack, Anchor, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Check for success: within ±2% of 73% and stable for 1 second
  useEffect(() => {
    if (stabilityRef.current) {
      clearTimeout(stabilityRef.current);
      stabilityRef.current = null;
    }

    if (!isRunning && value >= 71 && value <= 75 && !successFiredRef.current) {
      stabilityRef.current = setTimeout(() => {
        if (!successFiredRef.current) {
          successFiredRef.current = true;
          onSuccess();
        }
      }, 1000);
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

  const handleResume = () => {
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
    successFiredRef.current = false;
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 200 }}>
      <Stack gap="sm">
        <Text fw={600} size="sm">Vertical progress</Text>
        
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: 24,
              height: 180,
              background: '#e9ecef',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: `${value}%`,
                background: '#228be6',
                borderRadius: 4,
                transition: 'height 0.1s ease',
              }}
              role="progressbar"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Vertical progress"
              data-testid="vertical-progress"
            />
          </div>
        </Box>

        <Text size="xs" ta="center" c="dimmed">{value}%</Text>

        <Stack gap="xs">
          <Button size="xs" onClick={handleStart} disabled={isRunning || value > 0}>
            Start
          </Button>
          {isRunning ? (
            <Button size="xs" variant="outline" onClick={handlePause}>
              Pause
            </Button>
          ) : (
            <Button
              size="xs"
              variant="outline"
              onClick={handleResume}
              disabled={value === 0 || value >= 100}
            >
              Resume
            </Button>
          )}
          <Anchor size="xs" ta="center" onClick={handleReset}>Reset</Anchor>
        </Stack>
      </Stack>
    </Card>
  );
}
