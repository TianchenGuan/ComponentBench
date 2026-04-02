'use client';

/**
 * segmented_control-mantine-T08: Secondary chart timezone → UTC+1 (3 instances)
 *
 * Layout: dashboard settings widget with multiple related controls.
 * Three Mantine SegmentedControls appear in a single "Timezones" widget:
 * - "Primary chart timezone" options: Local / UTC / UTC+1 (initial: Local)
 * - "Secondary chart timezone" options: Local / UTC / UTC+1 (initial: UTC)
 * - "Export timezone" options: Local / UTC / UTC+1 (initial: Local)
 *
 * The options are identical across instances and the labels are similar, increasing disambiguation load.
 *
 * Clutter (medium): the widget also includes a small "Info" icon and two non-required switches.
 * No Apply button; selection is immediate.
 *
 * Success: The SegmentedControl labeled "Secondary chart timezone" selected value = UTC+1.
 */

import React, { useState } from 'react';
import { Card, Text, Stack, Group, Switch, ActionIcon, SegmentedControl } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const timezoneOptions = ['Local', 'UTC', 'UTC+1'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryTz, setPrimaryTz] = useState<string>('Local');
  const [secondaryTz, setSecondaryTz] = useState<string>('UTC');
  const [exportTz, setExportTz] = useState<string>('Local');

  const handlePrimaryChange = (value: string) => {
    setPrimaryTz(value);
    // No success for primary
  };

  const handleSecondaryChange = (value: string) => {
    setSecondaryTz(value);
    if (value === 'UTC+1') {
      onSuccess();
    }
  };

  const handleExportChange = (value: string) => {
    setExportTz(value);
    // No success for export
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Timezones</Text>
        <ActionIcon variant="subtle" size="sm">
          <IconInfoCircle size={16} />
        </ActionIcon>
      </Group>

      <Stack gap="md">
        <div>
          <Text fw={500} mb="xs">Primary chart timezone</Text>
          <SegmentedControl
            data-testid="primary-chart-tz"
            data-canonical-type="segmented_control"
            data-selected-value={primaryTz}
            data={timezoneOptions}
            value={primaryTz}
            onChange={handlePrimaryChange}
          />
        </div>

        <div>
          <Text fw={500} mb="xs">Secondary chart timezone</Text>
          <SegmentedControl
            data-testid="secondary-chart-tz"
            data-canonical-type="segmented_control"
            data-selected-value={secondaryTz}
            data={timezoneOptions}
            value={secondaryTz}
            onChange={handleSecondaryChange}
          />
        </div>

        <div>
          <Text fw={500} mb="xs">Export timezone</Text>
          <SegmentedControl
            data-testid="export-tz"
            data-canonical-type="segmented_control"
            data-selected-value={exportTz}
            data={timezoneOptions}
            value={exportTz}
            onChange={handleExportChange}
          />
        </div>

        <Group gap="xl">
          <Switch label="Show offsets" size="xs" />
          <Switch label="Auto-detect" size="xs" defaultChecked />
        </Group>
      </Stack>
    </Card>
  );
}
