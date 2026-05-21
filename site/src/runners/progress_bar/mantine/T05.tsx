'use client';

/**
 * progress_bar-mantine-T05: Expand Advanced section and reach 65%
 *
 * Layout: settings_panel. The page resembles an app settings screen with a vertical list of sections.
 *
 * Target component: one Mantine Progress bar labeled "Optimization progress" located inside an 
 * Accordion item titled "Advanced". The progress bar is not visible until the "Advanced" 
 * accordion item is expanded.
 *
 * Initial state:
 * - The "General" accordion item is expanded by default.
 * - The "Advanced" item is collapsed.
 * - Inside "Advanced", the progress starts at 0% and is idle.
 *
 * Controls inside the "Advanced" panel:
 * - "Start optimization" button: begins increasing progress and auto-pauses at exactly 65%.
 * - "Reset" link: sets progress back to 0% (distractor).
 *
 * Success: "Optimization progress" value is within ±1% of 65% and stable for 0.8 seconds.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Button, Group, Stack, Accordion, Anchor } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [accordionValue, setAccordionValue] = useState<string | null>('general');
  const [value, setValue] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Check for success: within ±1% of 65% and stable for 0.8 seconds
  useEffect(() => {
    if (stabilityRef.current) {
      clearTimeout(stabilityRef.current);
      stabilityRef.current = null;
    }

    if (!isRunning && value >= 64 && value <= 66 && !successFiredRef.current) {
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
        if (prev >= 65) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 65;
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">App Settings</Text>
        
        <Accordion value={accordionValue} onChange={setAccordionValue}>
          <Accordion.Item value="general">
            <Accordion.Control>General</Accordion.Control>
            <Accordion.Panel>
              <Text size="sm" c="dimmed">
                General settings and preferences. Nothing to configure here for this task.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="advanced">
            <Accordion.Control>Advanced</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <div>
                  <Text fw={500} size="sm" mb={8}>Optimization progress</Text>
                  <Group gap="sm" align="center">
                    <Progress
                      value={value}
                      aria-label="Optimization progress"
                      data-testid="optimization-progress"
                      style={{ flex: 1 }}
                    />
                    <Text size="sm" c="dimmed">{value}%</Text>
                  </Group>
                </div>
                <Group>
                  <Button onClick={handleStart} disabled={isRunning || value >= 65}>
                    Start optimization
                  </Button>
                  <Anchor size="sm" onClick={handleReset}>Reset</Anchor>
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="about">
            <Accordion.Control>About</Accordion.Control>
            <Accordion.Panel>
              <Text size="sm" c="dimmed">
                Version 1.0.0
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Card>
  );
}
