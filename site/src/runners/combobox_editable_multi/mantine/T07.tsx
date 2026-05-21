'use client';

/**
 * combobox_editable_multi-mantine-T07: Paste a formatted tag line (split chars)
 *
 * The component is placed in the bottom-left of the viewport inside a small utility card titled "Batch entry".
 * - Placement: bottom_left
 * - Theme: light
 * - Component: Mantine TagsInput labeled "Batch tags"
 * - Configuration: splitChars is set to [',', ' ', '|'] so pasted/typed values are split into multiple tags.
 * - Initial state: empty.
 * The UI includes a short helper text: "Paste tags separated by commas, spaces, or |".
 * To succeed, the single pasted string must result in exactly three pills: alpha, beta, gamma.
 *
 * Success: Selected values equal {alpha, beta, gamma} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TagsInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const TARGET_SET = ['alpha', 'beta', 'gamma'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="lg" mb="md">Batch entry</Text>
      <Text fw={500} size="sm" mb={8}>Batch tags</Text>
      <TagsInput
        data-testid="batch-tags"
        placeholder="Paste or type tags"
        value={value}
        onChange={setValue}
        splitChars={[',', ' ', '|']}
      />
      <Text size="xs" c="dimmed" mt={4}>Paste tags separated by commas, spaces, or |</Text>
    </Card>
  );
}
