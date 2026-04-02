'use client';

/**
 * autocomplete_freeform-mantine-v2-T02: Reviewer autocomplete with first-option trap
 *
 * Compact inline card with Autocomplete "Reviewer". selectFirstOptionOnChange is on,
 * so pressing Enter without explicit selection commits the first highlighted option.
 * Select `Ana María` (not the first option `Ana Marin`). Click "Apply reviewer".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Text, Autocomplete, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const reviewerOptions = ['Ana Marin', 'Ana María', 'Ana-Marie', 'Annika Ma'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [fromSuggestion, setFromSuggestion] = useState(false);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const handleApply = useCallback(() => setSaved(true), []);

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (value === 'Ana María' && fromSuggestion) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, value, fromSuggestion, onSuccess]);

  return (
    <div style={{ padding: 16, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 300 }}>
        <Text fw={600} size="md" mb="sm">Review Assignment</Text>
        <Text size="xs" c="dimmed" mb="md">Select the reviewer for this submission.</Text>

        <Text fw={500} size="sm" mb={6}>Reviewer</Text>
        <Autocomplete
          data-testid="reviewer"
          placeholder="Search reviewer"
          data={reviewerOptions}
          value={value}
          onChange={(val) => {
            setValue(val);
            setFromSuggestion(reviewerOptions.includes(val));
          }}
          selectFirstOptionOnChange
        />

        <Group justify="flex-end" mt="md">
          <Button size="sm" onClick={handleApply}>Apply reviewer</Button>
        </Group>
      </Card>
    </div>
  );
}
