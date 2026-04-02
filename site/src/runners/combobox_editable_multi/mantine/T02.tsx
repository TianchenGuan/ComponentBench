'use client';

/**
 * combobox_editable_multi-mantine-T02: Enter a custom tag (free input)
 *
 * Centered isolated card titled "Review settings".
 * - Component: Mantine TagsInput with no suggestions (data is empty).
 * - Label: "Review tags"
 * - Placeholder: "Press Enter to submit a tag"
 * - Initial state: empty.
 * Behavior:
 * - Typing a value and pressing Enter creates a new pill/tag.
 * - Duplicate values are not allowed (default behavior).
 * No other controls.
 *
 * Success: Selected values equal {needs-review} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TagsInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const TARGET_SET = ['needs-review'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Review settings</Text>
      <Text fw={500} size="sm" mb={8}>Review tags</Text>
      <TagsInput
        data-testid="review-tags"
        placeholder="Press Enter to submit a tag"
        value={value}
        onChange={setValue}
      />
    </Card>
  );
}
