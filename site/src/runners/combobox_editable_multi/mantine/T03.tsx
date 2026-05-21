'use client';

/**
 * combobox_editable_multi-mantine-T03: Clear all priority tags
 *
 * Centered isolated card titled "Priorities".
 * - Component: Mantine TagsInput with clearable=true.
 * - Label: "Priority tags"
 * - Initial pills: urgent, vip
 * - A clear button appears in the right section when there are selected values.
 * Behavior:
 * - Clicking the clear button removes all pills at once.
 * - Individual pills can also be removed.
 * No confirm/save step is required.
 *
 * Success: Selected values equal [] (empty).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TagsInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const TARGET_SET: string[] = [];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(['urgent', 'vip']);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Priorities</Text>
      <Text fw={500} size="sm" mb={8}>Priority tags</Text>
      <TagsInput
        data-testid="priority-tags"
        placeholder="Add priority tags"
        value={value}
        onChange={setValue}
        clearable
      />
    </Card>
  );
}
