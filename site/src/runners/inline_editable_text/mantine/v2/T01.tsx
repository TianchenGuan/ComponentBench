'use client';

/**
 * inline_editable_text-mantine-v2-T01: Workspace alias in offset drawer with sibling preserved
 *
 * A button opens a Mantine Drawer from the right with a small viewport offset.
 * Background content includes summary badges and a read-only workspace card.
 * Inside the drawer are two inline editable rows: "Workspace alias" and "Billing alias".
 * In read-only mode each row shows Mantine Text with a pencil ActionIcon in the right section.
 * Editing swaps to a TextInput with Save / Cancel ActionIcons rendered in the right section.
 * Initial values: "Northwind Lab" and "Northwind Billing". Only Workspace alias should change.
 *
 * Success: Workspace alias committed value === "Northwind Labs / EU", display mode,
 *          Billing alias remains "Northwind Billing".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Badge, Card, Drawer, Text, TextInput, ActionIcon, Group, Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

interface InlineRowProps {
  label: string;
  value: string;
  onCommit: (v: string) => void;
  testId: string;
}

function InlineEditRow({ label, value, onCommit, testId }: InlineRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const startEdit = () => { setDraft(value); setEditing(true); };
  const save = () => { onCommit(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  return (
    <Box mb="sm">
      <Text size="sm" fw={500} mb={4}>{label}</Text>
      <Box data-testid={testId} data-mode={editing ? 'editing' : 'display'} data-value={value}>
        {editing ? (
          <TextInput
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            size="sm"
            data-testid={`${testId}-input`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') cancel();
            }}
            rightSection={
              <Group gap={4} wrap="nowrap">
                <ActionIcon variant="filled" color="blue" size="sm" onClick={save} aria-label="Save" data-testid={`${testId}-save`}>
                  <IconCheck size={14} />
                </ActionIcon>
                <ActionIcon variant="default" size="sm" onClick={cancel} aria-label="Cancel" data-testid={`${testId}-cancel`}>
                  <IconX size={14} />
                </ActionIcon>
              </Group>
            }
            rightSectionWidth={60}
          />
        ) : (
          <Group gap="xs" style={{ cursor: 'pointer' }} onClick={startEdit} data-testid={`${testId}-display`}>
            <Text size="sm">{value}</Text>
            <ActionIcon variant="subtle" size="sm"><IconPencil size={14} /></ActionIcon>
          </Group>
        )}
      </Box>
    </Box>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [wsAlias, setWsAlias] = useState('Northwind Lab');
  const [billingAlias, setBillingAlias] = useState('Northwind Billing');
  const successFired = useRef(false);

  useEffect(() => {
    if (
      wsAlias === 'Northwind Labs / EU' &&
      billingAlias === 'Northwind Billing' &&
      !successFired.current
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [wsAlias, billingAlias, onSuccess]);

  return (
    <Box p="md">
      {/* Background content */}
      <Group mb="lg" gap="sm">
        <Badge variant="light" color="blue">Pro plan</Badge>
        <Badge variant="light" color="green">Active</Badge>
        <Badge variant="light" color="gray">3 seats</Badge>
      </Group>

      <Card shadow="xs" padding="md" radius="md" withBorder w={320} mb="lg">
        <Text fw={600} size="sm" mb={4}>Workspace</Text>
        <Text size="xs" c="dimmed">Northwind Lab — 3 members</Text>
      </Card>

      <Button variant="light" onClick={open} data-testid="open-drawer">
        Workspace aliases
      </Button>

      <Drawer
        opened={opened}
        onClose={close}
        title="Workspace aliases"
        position="right"
        offset={8}
        size="sm"
        data-testid="alias-drawer"
      >
        <Stack gap="md" mt="sm">
          <InlineEditRow
            label="Workspace alias"
            value={wsAlias}
            onCommit={setWsAlias}
            testId="editable-workspace-alias"
          />
          <InlineEditRow
            label="Billing alias"
            value={billingAlias}
            onCommit={setBillingAlias}
            testId="editable-billing-alias"
          />
        </Stack>
      </Drawer>
    </Box>
  );
}
