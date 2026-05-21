'use client';

/**
 * select_custom_multi-mantine-T08: Visual + 3 instances: match Primary labels
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=3, guidance=visual, clutter=none.
 * Layout: isolated card centered titled "Label sets".
 * At the top of the card there is a non-interactive "Target set" preview row showing four pills (visual reference).
 * Below are three Mantine MultiSelect components with identical styling (instances=3):
 *   - "Primary labels" (TARGET)
 *   - "Secondary labels" (distractor)
 *   - "Archived labels" (distractor)
 * No other interactive components are present on the card (clutter: none).
 * All three MultiSelects share the same option list (18) with intentionally similar names:
 *   North, North-East, North-West, South, South-East, South-West, East, West, Central,
 *   Remote, Remote (temp), Temp, Temporary, Internal, External, Partner, Vendor, Other.
 * Initial state:
 *   - Primary labels has "North" selected (distractor; may or may not be part of the target).
 *   - Secondary labels has "Internal" selected.
 *   - Archived labels is empty.
 * No Save button; pills update immediately.
 *
 * Success: Only 'Primary labels' is evaluated. The selected values are exactly: North-West, West, Central, Remote (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, MultiSelect, Stack, Badge, Group, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const labelOptions = [
  'North', 'North-East', 'North-West', 'South', 'South-East', 'South-West',
  'East', 'West', 'Central', 'Remote', 'Remote (temp)', 'Temp', 'Temporary',
  'Internal', 'External', 'Partner', 'Vendor', 'Other'
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryLabels, setPrimaryLabels] = useState<string[]>(['North']);
  const [secondaryLabels, setSecondaryLabels] = useState<string[]>(['Internal']);
  const [archivedLabels, setArchivedLabels] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['North-West', 'West', 'Central', 'Remote']);
    const currentSet = new Set(primaryLabels);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [primaryLabels, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Label sets</Text>
      
      <Box mb="md" p="sm" style={{ background: '#f5f5f5', borderRadius: 4 }}>
        <Text size="xs" c="dimmed" mb="xs">Target set</Text>
        <Group gap="xs">
          <Badge variant="light">North-West</Badge>
          <Badge variant="light">West</Badge>
          <Badge variant="light">Central</Badge>
          <Badge variant="light">Remote</Badge>
        </Group>
      </Box>

      <Stack gap="md">
        <MultiSelect
          data-testid="primary-labels-select"
          label="Primary labels"
          placeholder="Select labels"
          data={labelOptions}
          value={primaryLabels}
          onChange={setPrimaryLabels}
        />
        <MultiSelect
          data-testid="secondary-labels-select"
          label="Secondary labels"
          placeholder="Select labels"
          data={labelOptions}
          value={secondaryLabels}
          onChange={setSecondaryLabels}
        />
        <MultiSelect
          data-testid="archived-labels-select"
          label="Archived labels"
          placeholder="Select labels"
          data={labelOptions}
          value={archivedLabels}
          onChange={setArchivedLabels}
        />
      </Stack>
    </Card>
  );
}
