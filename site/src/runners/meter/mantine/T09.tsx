'use client';

/**
 * meter-mantine-T09: Enable striped animated style on Download Speed meter (Mantine)
 *
 * Setup Description:
 * An isolated card is positioned near the top-right of the viewport and contains one meter labeled "Download Speed".
 * - Layout: isolated_card; placement top_right.
 * - Component: Mantine Progress used as a meter.
 * - Spacing/scale: comfortable, default.
 * - Instances: 1.
 * - Sub-controls: a small style selector inside the meter header offers two options:
 *   * "Solid" (default)
 *   * "Striped (animated)" (target)
 *   Selecting the target option enables stripes and animation on the progress fill.
 * - Initial state: Solid style, value 60%.
 * - Feedback: visual pattern/animation appears immediately on selection; value does not need to change.
 * - Distractors: none.
 *
 * Success: Download Speed meter style mode is set to "Striped (animated)".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Group, Stack, SegmentedControl } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [styleMode, setStyleMode] = useState<string>('solid');
  const [value] = useState(60);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (styleMode === 'striped_animated' && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [styleMode, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Text fw={600} size="lg">Download Speed</Text>
          <SegmentedControl
            size="xs"
            value={styleMode}
            onChange={setStyleMode}
            data={[
              { label: 'Solid', value: 'solid' },
              { label: 'Striped (animated)', value: 'striped_animated' },
            ]}
            data-testid="meter-style-selector"
          />
        </Group>
        
        <div
          data-testid="mantine-meter-download"
          data-meter-value={value}
          data-meter-style={styleMode}
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Download Speed"
        >
          <Progress 
            value={value}
            striped={styleMode === 'striped_animated'}
            animated={styleMode === 'striped_animated'}
          />
        </div>

        <Text size="sm" c="dimmed">{value}%</Text>
      </Stack>
    </Card>
  );
}
