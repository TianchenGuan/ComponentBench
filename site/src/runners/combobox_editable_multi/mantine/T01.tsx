'use client';

/**
 * combobox_editable_multi-mantine-T01: Select two framework tags from suggestions
 *
 * Centered isolated card titled "Stack". The card contains one Mantine MultiSelect component (multi-value combobox with search).
 * - Label: "Framework tags"
 * - Placeholder: "Pick value"
 * - The MultiSelect is searchable (typing filters options).
 * - Options data: React, Angular, Vue, Svelte, Solid, Ember.
 * - Initial state: empty (no selected values).
 *
 * Interaction notes:
 * - Clicking the input opens a dropdown list.
 * - Clicking an option adds it as a pill/value inside the input.
 * - This MultiSelect does NOT allow arbitrary custom values; you must pick from the provided options.
 *
 * Success: Selected values equal {React, Svelte} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, MultiSelect } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const frameworks = ['React', 'Angular', 'Vue', 'Svelte', 'Solid', 'Ember'];

const TARGET_SET = ['React', 'Svelte'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Stack</Text>
      <Text fw={500} size="sm" mb={8}>Framework tags</Text>
      <MultiSelect
        data-testid="framework-tags"
        placeholder="Pick value"
        data={frameworks}
        value={value}
        onChange={setValue}
        searchable
      />
    </Card>
  );
}
