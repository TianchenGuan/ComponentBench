'use client';

/**
 * autocomplete_freeform-mantine-T01: Type a custom fruit into Autocomplete
 *
 * setup_description:
 * A small isolated card titled "Preferences" is anchored in the bottom-left of the viewport. It contains one Mantine Autocomplete labeled "Favorite fruit" with placeholder "Pick value or enter anything".
 *
 * The Autocomplete has a short suggestions list (Apple, Banana, Cherry, Mango), but values are not enforced and the user can type any string.
 *
 * Initial state: empty input. Distractors: none. Feedback: the input text updates immediately as the user types.
 *
 * Success: The "Favorite fruit" Autocomplete input's displayed value equals "Mango" (case-insensitive, trimmed).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Autocomplete } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const fruits = ['Apple', 'Banana', 'Cherry', 'Mango'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = value.trim().toLowerCase();
  const targetValue = 'mango';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={600} size="lg" mb="md">Preferences</Text>
      <Text fw={500} size="sm" mb={8}>Favorite fruit</Text>
      <Autocomplete
        data-testid="favorite-fruit"
        placeholder="Pick value or enter anything"
        data={fruits}
        value={value}
        onChange={setValue}
      />
    </Card>
  );
}
