'use client';

/**
 * combobox_editable_multi-mantine-T08: Replace tags with a max of 3 (compact small)
 *
 * Compact small card titled "Keyword cap" (centered).
 * - Spacing: compact
 * - Scale: small
 * - Component: Mantine TagsInput labeled "Top keywords"
 * - Configuration: maxTags=3 (cannot add a 4th keyword).
 * - Initial pills (3): invoice, payment, refund
 * - Suggestions list includes: invoice, payment, refund, billing, overdue, escalation, dispute, chargeback.
 * Task: replace the existing three tags with billing, overdue, escalation. Because of maxTags, you must remove existing pills before adding new ones.
 *
 * Success: Selected values equal {billing, overdue, escalation} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TagsInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const suggestions = ['invoice', 'payment', 'refund', 'billing', 'overdue', 'escalation', 'dispute', 'chargeback'];

const TARGET_SET = ['billing', 'overdue', 'escalation'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(['invoice', 'payment', 'refund']);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={600} size="sm" mb="xs">Keyword cap</Text>
      <Text fw={500} size="xs" mb={4}>Top keywords</Text>
      <TagsInput
        data-testid="top-keywords"
        placeholder="Add keywords"
        data={suggestions}
        value={value}
        onChange={setValue}
        maxTags={3}
        size="xs"
      />
      <Text size="xs" c="dimmed" mt={4}>Max 3 keywords</Text>
    </Card>
  );
}
