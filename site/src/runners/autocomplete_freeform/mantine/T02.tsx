'use client';

/**
 * autocomplete_freeform-mantine-T02: Select a vegetable from suggestions
 *
 * setup_description:
 * A centered isolated card titled "Grocery list" contains one Mantine Autocomplete labeled "Vegetable".
 *
 * Suggestions shown in the dropdown are a small list: Apples, Bananas, Broccoli, Carrots, Chocolate, Grapes. The user can type anything, but for this task they should select the exact suggestion.
 *
 * Initial state: empty input, dropdown closed. Distractors: none. Feedback: selecting an option fills the input with the option label.
 *
 * Success: The "Vegetable" Autocomplete input's displayed value equals "Carrots" (trim whitespace). Case-sensitive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Autocomplete } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const items = ['Apples', 'Bananas', 'Broccoli', 'Carrots', 'Chocolate', 'Grapes'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = value.trim();
  const targetValue = 'Carrots';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Grocery list</Text>
      <Text fw={500} size="sm" mb={8}>Vegetable</Text>
      <Autocomplete
        data-testid="vegetable"
        placeholder="Select vegetable"
        data={items}
        value={value}
        onChange={setValue}
      />
    </Card>
  );
}
