'use client';

/**
 * slider_range-mantine-T04: Set Budget range when two sliders are present
 * 
 * Layout: form_section centered on the page, titled "Purchase settings".
 * The section includes two Mantine RangeSliders (instances=2) stacked vertically:
 * 1) "Budget ($)" with min=0, max=1000, step=50, initial Selected: $100 - $900.
 * 2) "Warranty length (years)" with min=0, max=10, step=1, initial Selected: 1 - 5.
 * The section also contains short explanatory text and a non-interactive summary line, but no other inputs.
 * Both sliders update immediately; only the Budget slider should be modified.
 * 
 * Success: Target range is set to 200-500 USD on the Budget slider (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, RangeSlider, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [budgetRange, setBudgetRange] = useState<[number, number]>([100, 900]);
  const [warrantyRange, setWarrantyRange] = useState<[number, number]>([1, 5]);

  useEffect(() => {
    if (budgetRange[0] === 200 && budgetRange[1] === 500) {
      onSuccess();
    }
  }, [budgetRange, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="xs">Purchase settings</Text>
      <Text c="dimmed" size="sm" mb="lg">
        Configure your purchase preferences below.
      </Text>

      <Stack gap="xl">
        <div>
          <Text fw={500} size="sm" mb="md">Budget ($)</Text>
          <RangeSlider
            value={budgetRange}
            onChange={setBudgetRange}
            min={0}
            max={1000}
            step={50}
            data-testid="budget-range"
            mb="xs"
          />
          <Text c="dimmed" size="sm">
            Selected: ${budgetRange[0]} - ${budgetRange[1]}
          </Text>
        </div>

        <div>
          <Text fw={500} size="sm" mb="md">Warranty length (years)</Text>
          <RangeSlider
            value={warrantyRange}
            onChange={setWarrantyRange}
            min={0}
            max={10}
            step={1}
            data-testid="warranty-range"
            mb="xs"
          />
          <Text c="dimmed" size="sm">
            Selected: {warrantyRange[0]} - {warrantyRange[1]}
          </Text>
        </div>
      </Stack>

      <Text c="dimmed" size="xs" mt="lg">
        Summary: Budget ${budgetRange[0]}-${budgetRange[1]}, Warranty {warrantyRange[0]}-{warrantyRange[1]} years
      </Text>
    </Card>
  );
}
