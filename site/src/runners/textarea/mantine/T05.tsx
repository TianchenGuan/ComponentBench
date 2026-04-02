'use client';

/**
 * textarea-mantine-T05: Internal memo in a busy form (2 textareas)
 *
 * A support form section contains multiple inputs (form_section layout).
 * - Light theme, comfortable spacing, default scale.
 * - Two Mantine Textarea instances appear:
 *   1) "Customer message" (placeholder "What the customer will see").
 *   2) "Internal memo" (placeholder "Private note").
 * - Additional clutter: a Select for category, a Switch "Urgent", and a small "Assign to me" button.
 * - Both textareas start empty; only "Internal memo" should be filled.
 *
 * Success: Internal memo equals "Escalate to Tier 2 if unresolved by EOD." (require_correct_instance=true)
 */

import React, { useState, useEffect } from 'react';
import { Card, Textarea, Text, Select, Switch, Button, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [customerMessage, setCustomerMessage] = useState('');
  const [internalMemo, setInternalMemo] = useState('');

  useEffect(() => {
    // Only succeed if internal memo matches AND customer message is unchanged
    if (
      internalMemo.trim() === 'Escalate to Tier 2 if unresolved by EOD.' &&
      customerMessage === ''
    ) {
      onSuccess();
    }
  }, [internalMemo, customerMessage, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">
        Support Ticket
      </Text>

      <Stack gap="md">
        {/* Distractor controls */}
        <Select
          label="Category"
          placeholder="Select category"
          data={['Billing', 'Technical', 'General']}
          data-testid="select-category"
        />

        <Group>
          <Switch label="Urgent" data-testid="switch-urgent" />
          <Button variant="subtle" size="xs" data-testid="btn-assign">
            Assign to me
          </Button>
        </Group>

        {/* Target textareas */}
        <Textarea
          label="Customer message"
          placeholder="What the customer will see"
          value={customerMessage}
          onChange={(e) => setCustomerMessage(e.target.value)}
          minRows={3}
          data-testid="textarea-customer-message"
        />

        <Textarea
          label="Internal memo"
          placeholder="Private note"
          value={internalMemo}
          onChange={(e) => setInternalMemo(e.target.value)}
          minRows={3}
          data-testid="textarea-internal-memo"
        />
      </Stack>
    </Card>
  );
}
