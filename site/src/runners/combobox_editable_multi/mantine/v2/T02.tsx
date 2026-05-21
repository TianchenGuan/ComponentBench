'use client';

/**
 * combobox_editable_multi-mantine-v2-T02
 *
 * Drawer flow: "Edit billing tags" opens a drawer with TagsInput (maxTags=3, clearable).
 * Initial chips: invoice, payment, refund (full). Suggestions: billing, overdue, escalation, refund, payment.
 * Success: Billing tags = {billing, overdue, escalation}, Apply billing tags clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, TagsInput, Button, Drawer, Group, Badge, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const suggestions = ['billing', 'overdue', 'escalation', 'refund', 'payment'];
const TARGET_SET = ['billing', 'overdue', 'escalation'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [billingTags, setBillingTags] = useState<string[]>(['invoice', 'payment', 'refund']);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(billingTags, TARGET_SET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, billingTags, onSuccess]);

  const handleApply = () => {
    setSaved(true);
    setOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 420 }}>
        <Text fw={600} size="lg" mb="sm">Billing overview</Text>
        <Text size="sm" c="dimmed" mb="xs">
          Current tags: {billingTags.join(', ') || '(none)'}
        </Text>
        <Group gap={6} mb="sm">
          {billingTags.map((t) => (
            <Badge key={t} variant="light">{t}</Badge>
          ))}
        </Group>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Edit billing tags
        </Button>
      </Card>

      <Drawer
        opened={open}
        onClose={() => setOpen(false)}
        title="Edit billing tags"
        position="bottom"
        size="sm"
      >
        <Stack gap="sm" p="md">
          <Text fw={500} size="sm">Billing tags</Text>
          <TagsInput
            placeholder="Add billing tags"
            data={suggestions}
            value={billingTags}
            onChange={(v) => { setBillingTags(v); setSaved(false); }}
            maxTags={3}
            clearable
          />
          <Group gap="sm" mt="xs">
            <Button variant="default" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleApply}>Apply billing tags</Button>
          </Group>
        </Stack>
      </Drawer>
    </div>
  );
}
