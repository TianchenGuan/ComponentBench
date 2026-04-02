'use client';

/**
 * autocomplete_restricted-mantine-T07: Scroll to select a project code
 *
 * setup_description:
 * A centered isolated card titled "Link timesheet" contains one Mantine Select labeled **Project code**.
 *
 * Component configuration:
 * - Theme: light; spacing: comfortable; size: default.
 * - Search is **disabled** for this Select (dropdown opens directly to the list).
 * - The dropdown contains a long list of 60 project codes from PRJ-001 to PRJ-060.
 * - Initial state: empty.
 * - The options are rendered in a scrollable dropdown; PRJ-048 is not visible initially.
 *
 * The task requires scrolling within the dropdown list to find and select PRJ-048.
 *
 * Success: The "Project code" Select has selected value "PRJ-048".
 */

import React, { useState } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const projectCodes = Array.from({ length: 60 }, (_, i) => {
  const num = String(i + 1).padStart(3, '0');
  return { label: `PRJ-${num}`, value: `PRJ-${num}` };
});

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'PRJ-048') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Link timesheet</Text>
      <Text fw={500} size="sm" mb={4}>Project code</Text>
      <Select
        data-testid="project-code-select"
        placeholder="Select project"
        data={projectCodes}
        value={value}
        onChange={handleChange}
        searchable={false}
        maxDropdownHeight={200}
      />
    </Card>
  );
}
