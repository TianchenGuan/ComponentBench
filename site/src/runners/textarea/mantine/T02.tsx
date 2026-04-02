'use client';

/**
 * textarea-mantine-T02: Clear the notes box
 *
 * A centered "Personal notes" card contains one Mantine Textarea labeled "Notes".
 * - Light theme, comfortable spacing, default scale.
 * - The textarea is prefilled with: "Remember to send invoice".
 * - A small link-style button "Clear notes" appears below the textarea (optional convenience).
 * - No other textareas are present.
 *
 * Success: Value equals "" (empty after trim)
 */

import React, { useState, useEffect } from 'react';
import { Card, Textarea, Text, Button } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Remember to send invoice');

  useEffect(() => {
    if (value.trim() === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">
        Personal notes
      </Text>
      <Textarea
        label="Notes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        minRows={3}
        data-testid="textarea-notes"
      />
      <Button
        variant="subtle"
        size="xs"
        mt="xs"
        onClick={handleClear}
        data-testid="btn-clear-notes"
      >
        Clear notes
      </Button>
    </Card>
  );
}
