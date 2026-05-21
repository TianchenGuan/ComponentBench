'use client';

/**
 * progress_bar-mantine-T06: Match Target progress to Reference (33%)
 *
 * Layout: isolated_card centered, titled "Progress match".
 *
 * Target components (instances=2):
 * - "Reference" Mantine Progress: fixed at 33% and shows a small caption "Reference".
 * - "Target" Mantine Progress: starts at 5% with caption "Target".
 *
 * Controls (affect Target only):
 * - Small "+1" and "-1" buttons to the right of the Target bar for fine adjustments.
 * - "Reset Target" link returns Target to 5% (distractor).
 *
 * Guidance: No numeric percent text is shown for either bar; the task must be done by visual 
 * alignment using the bar fill lengths.
 *
 * Success: Target progress value is within ±1% of 33%.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Button, Group, Stack, Anchor } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const refValue = 33;
  const [targetValue, setTargetValue] = useState(5);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(targetValue - refValue) <= 1 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [targetValue, onSuccess]);

  const adjustTarget = (delta: number) => {
    setTargetValue((prev) => Math.max(0, Math.min(100, prev + delta)));
    successFiredRef.current = false;
  };

  const handleReset = () => {
    setTargetValue(5);
    successFiredRef.current = false;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Stack gap="lg">
        <Text fw={600} size="lg">Progress match</Text>
        
        {/* Reference bar - no numeric label */}
        <div>
          <Text size="sm" c="dimmed" mb={8}>Reference</Text>
          <Progress
            value={refValue}
            aria-label="Reference progress"
            data-testid="reference-progress"
          />
        </div>

        {/* Target bar - no numeric label */}
        <div>
          <Text size="sm" c="dimmed" mb={8}>Target</Text>
          <Group gap="sm" align="center">
            <Progress
              value={targetValue}
              aria-label="Target progress"
              data-testid="target-progress"
              style={{ flex: 1 }}
            />
            <Button size="xs" variant="outline" onClick={() => adjustTarget(-1)}>
              -1
            </Button>
            <Button size="xs" variant="outline" onClick={() => adjustTarget(1)}>
              +1
            </Button>
          </Group>
        </div>

        <Anchor size="sm" onClick={handleReset}>Reset Target</Anchor>
      </Stack>
    </Card>
  );
}
