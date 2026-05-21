'use client';

/**
 * meter-mantine-T05: Show tooltip for Latency meter (Mantine)
 *
 * Setup Description:
 * An isolated card is placed near the top-left of the viewport.
 * - Layout: isolated_card; placement top_left.
 * - Component: Mantine Progress (scalar percent) wrapped with a tooltip on hover/focus.
 * - Spacing/scale: comfortable, default.
 * - Instances: 1 labeled "Latency".
 * - Interaction: hovering over the meter bar (or focusing it) opens a tooltip that shows exact value 
 *   (e.g., "Latency: 42%").
 * - Initial state: tooltip closed; meter value is 42%.
 * - Distractors: a static help paragraph below the bar.
 * - Feedback: tooltip remains visible while pointer is over the bar.
 *
 * Success: Latency meter tooltip is visible.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Tooltip, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [value] = useState(42);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (isTooltipOpen && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [isTooltipOpen, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">Latency</Text>
        
        <Tooltip
          label={`Latency: ${value}%`}
          opened={isTooltipOpen}
          data-testid="meter-latency-tooltip"
        >
          <div
            onMouseEnter={() => setIsTooltipOpen(true)}
            onMouseLeave={() => setIsTooltipOpen(false)}
            onFocus={() => setIsTooltipOpen(true)}
            onBlur={() => setIsTooltipOpen(false)}
            tabIndex={0}
            style={{ cursor: 'pointer', outline: 'none' }}
            data-testid="meter-latency"
            data-meter-value={value}
            data-tooltip-open={isTooltipOpen}
            role="meter"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Latency"
          >
            <Progress value={value} />
          </div>
        </Tooltip>

        <Text size="xs" c="dimmed">
          This meter displays current latency metrics for the system.
        </Text>
      </Stack>
    </Card>
  );
}
