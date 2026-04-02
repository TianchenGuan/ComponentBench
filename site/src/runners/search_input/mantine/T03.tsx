'use client';

/**
 * search_input-mantine-T03: Clear a prefilled Mantine TextInput
 *
 * Baseline isolated card centered in the viewport titled "Groceries".
 * One Mantine TextInput labeled "Grocery search" is shown with a clear button in the right section (visible because it has text).
 * Initial state: prefilled value "milk".
 * Feedback: clearing removes the ✕ button and the helper text changes from "Filtering by: milk" to "No filter".
 * No additional clutter.
 *
 * Success: The Mantine TextInput labeled "Grocery search" is empty after clearing.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TextInput, Text, CloseButton } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('milk');
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (value === '' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Groceries</Text>
      <TextInput
        label="Grocery search"
        placeholder="Search groceries…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        leftSection={<IconSearch size={16} />}
        rightSection={
          value ? (
            <CloseButton
              size="sm"
              onClick={() => setValue('')}
              aria-label="Clear input"
            />
          ) : null
        }
        data-testid="search-grocery"
      />
      <Text size="sm" c="dimmed" mt="xs">
        {value ? `Filtering by: ${value}` : 'No filter'}
      </Text>
    </Card>
  );
}
