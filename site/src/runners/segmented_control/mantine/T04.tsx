'use client';

/**
 * segmented_control-mantine-T04: Reset chart type to default (Line)
 *
 * Layout: isolated card titled "Chart settings".
 * The card contains:
 * - A Mantine SegmentedControl labeled "Chart type" with options: "Line", "Bar", "Area".
 * - Initial state: "Bar" is selected.
 * - A small secondary button labeled "Reset to default" under the control.
 * - Helper text: "Default: Line".
 *
 * Clicking "Reset to default" changes the segmented control back to "Line".
 * No Apply button; selection updates immediately.
 *
 * Success: The "Chart type" SegmentedControl selected value = Line.
 */

import React, { useState } from 'react';
import { Card, Text, Button, SegmentedControl } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const chartOptions = ['Line', 'Bar', 'Area'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('Bar');

  const handleChange = (value: string) => {
    setSelected(value);
    if (value === 'Line') {
      onSuccess();
    }
  };

  const handleReset = () => {
    setSelected('Line');
    onSuccess();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Chart settings</Text>
      
      <Text fw={500} mb="xs">Chart type</Text>
      <SegmentedControl
        data-testid="chart-type"
        data-canonical-type="segmented_control"
        data-selected-value={selected}
        data={chartOptions}
        value={selected}
        onChange={handleChange}
      />
      <Text size="xs" c="dimmed" mt="xs">Default: Line</Text>
      <Button variant="subtle" size="xs" mt="xs" onClick={handleReset}>
        Reset to default
      </Button>
    </Card>
  );
}
