'use client';

/**
 * search_input-mantine-T06: Open dropdown and pick from recent searches (Mantine Autocomplete)
 *
 * Isolated card centered in the viewport titled "Billing".
 * Contains one Mantine Autocomplete labeled "Recent searches". It opens a dropdown list when focused (even before typing).
 * Options are a short "recent" list: Invoices, Payments, Refunds, Chargebacks, Statements.
 * Initial state: empty; dropdown closed.
 * Feedback: selecting an option fills the input and shows a small inline note "Using recent search: Invoices".
 * Clutter is low: only a static paragraph explaining recent searches.
 *
 * Success: The Autocomplete labeled "Recent searches" has selected_option/value equal to "Invoices".
 */

import React, { useState, useRef } from 'react';
import { Card, Autocomplete, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const recentSearches = ['Invoices', 'Payments', 'Refunds', 'Chargebacks', 'Statements'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const hasSucceeded = useRef(false);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'Invoices' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Billing</Text>
      
      <Text size="sm" c="dimmed" mb="md">
        Your recent searches are saved for quick access. Click the field to see your history.
      </Text>

      <Autocomplete
        label="Recent searches"
        placeholder="Click to see recent…"
        data={recentSearches}
        value={value}
        onChange={handleChange}
        data-testid="search-recent"
      />
      {value && (
        <Text size="sm" c="dimmed" mt="sm">
          Using recent search: {value}
        </Text>
      )}
    </Card>
  );
}
