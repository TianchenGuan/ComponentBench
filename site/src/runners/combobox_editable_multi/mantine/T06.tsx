'use client';

/**
 * combobox_editable_multi-mantine-T06: Commit a tag explicitly (no accept-on-blur)
 *
 * Centered isolated card titled "On-call rotation".
 * - Component: Mantine TagsInput labeled "On-call reviewers".
 * - Configuration: acceptValueOnBlur is set to false, so typed text is NOT added when the input loses focus; it is only added when:
 *   (a) pressing Enter, or (b) clicking a suggestion.
 * - The UI shows helper text under the input: "Press Enter to add".
 * - Suggestions include: Sam Lee, Priya Patel, Jordan Kim, Mei Chen.
 * - Initial state: empty.
 * To succeed, the value must be committed as an actual pill/tag (not just typed text).
 *
 * Success: Selected values equal {Sam Lee} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TagsInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const suggestions = ['Sam Lee', 'Priya Patel', 'Jordan Kim', 'Mei Chen'];

const TARGET_SET = ['Sam Lee'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">On-call rotation</Text>
      <Text fw={500} size="sm" mb={8}>On-call reviewers</Text>
      <TagsInput
        data-testid="oncall-reviewers"
        placeholder="Type to add"
        data={suggestions}
        value={value}
        onChange={setValue}
        acceptValueOnBlur={false}
      />
      <Text size="xs" c="dimmed" mt={4}>Press Enter to add</Text>
    </Card>
  );
}
