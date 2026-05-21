'use client';

/**
 * toolbar-mantine-T03: Select Week in period toolbar
 *
 * A centered isolated card contains a toolbar labeled "Period". Inside the toolbar 
 * is a Mantine SegmentedControl with three options: Day, Week, Month.
 * Only one option can be active at a time. A status line below reads "Current period: …".
 * Initial state: Day is selected.
 */

import React, { useState } from 'react';
import { Paper, SegmentedControl, Text, Title } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [period, setPeriod] = useState<string>('day');

  const handleChange = (value: string) => {
    setPeriod(value);
    if (value === 'week') {
      onSuccess();
    }
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 350 }}>
      <Title order={5} mb="md">
        Period
      </Title>

      <SegmentedControl
        value={period}
        onChange={handleChange}
        data={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
        mb="md"
        data-testid="mantine-toolbar-period"
      />

      <Text size="sm" c="dimmed">
        Current period: {period.charAt(0).toUpperCase() + period.slice(1)}
      </Text>
    </Paper>
  );
}
