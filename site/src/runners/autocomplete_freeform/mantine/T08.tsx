'use client';

/**
 * autocomplete_freeform-mantine-T08: Pick the correct reviewer in a dark settings panel
 *
 * setup_description:
 * The page uses a dark theme and shows a centered isolated card titled "Review settings".
 *
 * The target control is a Mantine Autocomplete labeled "Default reviewer". It is configured with autoSelectOnBlur enabled: when an option is highlighted via keyboard navigation, clicking outside can automatically select the highlighted option.
 *
 * The suggestions list contains several visually similar names: "Olivia Chen", "Olivia Cheng", "Oliver Chen", "Olive Chen". The dropdown is scrollable.
 *
 * Initial state: Default reviewer is empty. Distractors: none. Feedback: the selected name appears in the input.
 *
 * Success: The "Default reviewer" Autocomplete input's displayed value equals "Olivia Chen" (trim whitespace). Case-sensitive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Autocomplete } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const reviewers = ['Olivia Chen', 'Olivia Cheng', 'Oliver Chen', 'Olive Chen', 'Alex Kim'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = value.trim();
  const targetValue = 'Olivia Chen';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Review settings</Text>
      <Text fw={500} size="sm" mb={8}>Default reviewer</Text>
      <Autocomplete
        data-testid="default-reviewer"
        placeholder="Select reviewer"
        data={reviewers}
        value={value}
        onChange={setValue}
      />
    </Card>
  );
}
