'use client';

/**
 * meter-mantine-T02: Match Water Tank target meter to reference (Mantine)
 *
 * Setup Description:
 * A centered card shows two Mantine Progress meters stacked vertically.
 * - Layout: isolated_card, placement center.
 * - Spacing/scale: comfortable, default.
 * - Instances: 2 meters labeled "Water Tank (Target)" and "Water Tank (Reference)".
 * - Guidance: visual. The reference bar has no number; it is purely a visual fill target.
 * - Interaction: Target is clickable to set value; Reference is read-only.
 * - Initial state: Target=10%; Reference≈65%.
 * - Feedback: Target fill updates immediately.
 * - Distractors: none.
 *
 * Success: Water Tank (Target) matches Water Tank (Reference) (±3 percentage points).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const REFERENCE_VALUE = 65;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [targetValue, setTargetValue] = useState(10);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(targetValue - REFERENCE_VALUE) <= 3 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [targetValue, onSuccess]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setTargetValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Stack gap="lg">
        <Text fw={600} size="lg">Water Tank</Text>
        
        {/* Reference meter */}
        <div>
          <Text fw={500} size="sm" mb={8}>Water Tank (Reference)</Text>
          <div
            data-testid="mantine-meter-water-ref"
            data-meter-value={REFERENCE_VALUE}
            role="meter"
            aria-valuenow={REFERENCE_VALUE}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Water Tank Reference"
            style={{ pointerEvents: 'none' }}
          >
            <Progress value={REFERENCE_VALUE} />
          </div>
        </div>

        {/* Target meter */}
        <div>
          <Text fw={500} size="sm" mb={8}>Water Tank (Target)</Text>
          <div
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
            data-testid="mantine-meter-water-target"
            data-instance-label="Water Tank (Target)"
            data-meter-value={targetValue}
            role="meter"
            aria-valuenow={targetValue}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Water Tank Target"
          >
            <Progress value={targetValue} />
          </div>
        </div>
      </Stack>
    </Card>
  );
}
