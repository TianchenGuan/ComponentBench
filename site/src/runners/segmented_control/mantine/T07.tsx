'use client';

/**
 * segmented_control-mantine-T07: Weekday → Thu (dense small segments)
 *
 * Layout: compact, small-scale card near the top-right on a dark-themed page.
 * A Mantine SegmentedControl labeled "Weekday" is displayed with 7 short options:
 * "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun".
 *
 * The control uses small sizing and compact spacing, making each segment narrow.
 * Initial state: "Mon" is selected.
 *
 * Clutter (low): a small caption says "Choose the day to schedule a weekly summary."
 * No Apply button; selection is immediate.
 *
 * Success: The "Weekday" SegmentedControl selected value = Thu.
 */

import React, { useState } from 'react';
import { Card, Text, SegmentedControl } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('Mon');

  const handleChange = (value: string) => {
    setSelected(value);
    if (value === 'Thu') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={600} size="sm" mb="xs">Schedule</Text>
      
      <Text fw={500} size="xs" mb={4}>Weekday</Text>
      <SegmentedControl
        data-testid="weekday"
        data-canonical-type="segmented_control"
        data-selected-value={selected}
        data={weekdays}
        value={selected}
        onChange={handleChange}
        size="xs"
        fullWidth
      />
      <Text size="xs" c="dimmed" mt="xs">
        Choose the day to schedule a weekly summary.
      </Text>
    </Card>
  );
}
