'use client';

/**
 * inline_editable_text-mantine-v2-T04: Reference badge exact match for internal label
 *
 * A dashboard_panel placed off-center near the upper-right. A "Labels" card has two
 * inline editable rows: "Public label" ("Customer") and "Internal label" ("Ops").
 * A reference card beside it shows a bold badge: "BACK OFFICE / APAC".
 * A card-level "Apply labels" button commits both rows.
 *
 * Success: Internal label committed value === "BACK OFFICE / APAC", display mode,
 *          Public label remains "Customer", committed via "Apply labels".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Card, Text, TextInput, ActionIcon, Group, Stack, Badge,
} from '@mantine/core';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

interface RowState { committed: string; editing: boolean; draft: string }

function useRow(initial: string) {
  const [s, setS] = useState<RowState>({ committed: initial, editing: false, draft: initial });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (s.editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [s.editing]);

  const startEdit = () => setS(prev => ({ ...prev, editing: true, draft: prev.committed }));
  const setDraft = (v: string) => setS(prev => ({ ...prev, draft: v }));
  const saveLocal = () => setS(prev => ({ ...prev, committed: prev.draft, editing: false }));
  const cancel = () => setS(prev => ({ ...prev, draft: prev.committed, editing: false }));

  return { s, inputRef, startEdit, setDraft, saveLocal, cancel, setS };
}

interface InlineRowProps {
  label: string;
  row: ReturnType<typeof useRow>;
  testId: string;
}

function InlineEditRow({ label, row, testId }: InlineRowProps) {
  const { s, inputRef, startEdit, setDraft, saveLocal, cancel } = row;
  return (
    <Box mb="sm">
      <Text size="sm" fw={500} mb={4}>{label}</Text>
      <Box data-testid={testId} data-mode={s.editing ? 'editing' : 'display'} data-value={s.committed}>
        {s.editing ? (
          <Group gap="xs" wrap="nowrap">
            <TextInput
              ref={inputRef}
              value={s.draft}
              onChange={(e) => setDraft(e.target.value)}
              size="sm"
              style={{ flex: 1 }}
              data-testid={`${testId}-input`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveLocal();
                if (e.key === 'Escape') cancel();
              }}
            />
            <ActionIcon variant="filled" color="blue" size="sm" onClick={saveLocal} aria-label="Save" data-testid={`${testId}-save`}>
              <IconCheck size={14} />
            </ActionIcon>
            <ActionIcon variant="default" size="sm" onClick={cancel} aria-label="Cancel" data-testid={`${testId}-cancel`}>
              <IconX size={14} />
            </ActionIcon>
          </Group>
        ) : (
          <Group gap="xs" style={{ cursor: 'pointer' }} onClick={startEdit} data-testid={`${testId}-display`}>
            <Text size="sm">{s.committed}</Text>
            <ActionIcon variant="subtle" size="sm"><IconPencil size={14} /></ActionIcon>
          </Group>
        )}
      </Box>
    </Box>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const publicRow = useRow('Customer');
  const internalRow = useRow('Ops');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  const handleApply = () => {
    if (publicRow.s.editing) publicRow.saveLocal();
    if (internalRow.s.editing) internalRow.saveLocal();
    setApplied(true);
  };

  useEffect(() => {
    if (
      applied &&
      !internalRow.s.editing &&
      !publicRow.s.editing &&
      internalRow.s.committed === 'BACK OFFICE / APAC' &&
      publicRow.s.committed === 'Customer' &&
      !successFired.current
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, internalRow.s, publicRow.s, onSuccess]);

  return (
    <Box p="md" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 24 }}>
      <Group align="flex-start" gap="md">
        {/* Reference card */}
        <Card shadow="xs" padding="md" radius="md" withBorder w={200}>
          <Text size="xs" c="dimmed" mb="xs">Reference</Text>
          <Badge size="lg" variant="light" color="indigo" data-testid="reference-badge">
            <Text fw={700} size="sm" span>BACK OFFICE / APAC</Text>
          </Badge>
          <Text size="xs" c="dimmed" mt="xs">Copy the bold text above exactly.</Text>
        </Card>

        {/* Labels card */}
        <Card shadow="sm" padding="md" radius="md" withBorder w={340} data-testid="labels-card">
          <Text fw={600} size="md" mb="sm">Labels</Text>

          <InlineEditRow label="Public label" row={publicRow} testId="editable-public-label" />
          <InlineEditRow label="Internal label" row={internalRow} testId="editable-internal-label" />

          <Button
            mt="sm"
            fullWidth
            onClick={handleApply}
            data-testid="apply-labels-button"
          >
            Apply labels
          </Button>
        </Card>
      </Group>
    </Box>
  );
}
