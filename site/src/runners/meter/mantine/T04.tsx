'use client';

/**
 * meter-mantine-T04: Set CPU Budget meter in form (Mantine)
 *
 * Setup Description:
 * A form_section titled "System Limits" contains standard fields and two meters.
 * - Layout: form_section, placement center.
 * - Clutter: low (text inputs and toggles are present but not required).
 * - Component: Mantine Progress meters (scalar percent).
 * - Spacing/scale: comfortable, default.
 * - Instances: 2 meters labeled "CPU Budget" and "Memory Budget".
 * - Initial state: CPU Budget=45%, Memory Budget=60%.
 * - Interaction: click on a meter bar to set its value.
 * - Feedback: each meter shows a small numeric percent label; updates immediately.
 *
 * Success: CPU Budget meter value is 70% (±2 percentage points).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Group, Stack, TextInput, Switch } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [cpuBudget, setCpuBudget] = useState(45);
  const [memoryBudget, setMemoryBudget] = useState(60);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(cpuBudget - 70) <= 2 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [cpuBudget, onSuccess]);

  const handleCpuClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setCpuBudget(Math.max(0, Math.min(100, percent)));
  };

  const handleMemoryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setMemoryBudget(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">System Limits</Text>

        {/* Distractor form fields */}
        <TextInput
          label="Server name"
          placeholder="production-01"
        />
        
        <Switch
          label="Enable monitoring"
          defaultChecked
        />

        {/* CPU Budget meter */}
        <div>
          <Text fw={500} size="sm" mb={8}>CPU Budget</Text>
          <Group gap="sm" align="center">
            <div
              onClick={handleCpuClick}
              style={{ flex: 1, cursor: 'pointer' }}
              data-testid="mantine-meter-cpu"
              data-instance-label="CPU Budget"
              data-meter-value={cpuBudget}
              role="meter"
              aria-valuenow={cpuBudget}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="CPU Budget"
            >
              <Progress value={cpuBudget} />
            </div>
            <Text size="sm" c="dimmed" style={{ minWidth: 40 }}>{cpuBudget}%</Text>
          </Group>
        </div>

        {/* Memory Budget meter */}
        <div>
          <Text fw={500} size="sm" mb={8}>Memory Budget</Text>
          <Group gap="sm" align="center">
            <div
              onClick={handleMemoryClick}
              style={{ flex: 1, cursor: 'pointer' }}
              data-testid="mantine-meter-mem"
              data-instance-label="Memory Budget"
              data-meter-value={memoryBudget}
              role="meter"
              aria-valuenow={memoryBudget}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Memory Budget"
            >
              <Progress value={memoryBudget} />
            </div>
            <Text size="sm" c="dimmed" style={{ minWidth: 40 }}>{memoryBudget}%</Text>
          </Group>
        </div>
      </Stack>
    </Card>
  );
}
