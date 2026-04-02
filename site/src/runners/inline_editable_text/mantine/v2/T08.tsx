'use client';

/**
 * inline_editable_text-mantine-v2-T08: Display badge from reference chip inside left drawer
 *
 * A button labeled "Edit badges" opens a left-anchored Mantine Drawer with small offset.
 * Inside are two inline editable rows: "Display badge" ("PENDING") and "Internal badge"
 * ("ops-only"), each using Text/TextInput inline-edit with row-local Save/Cancel icons.
 * A blue reference chip above the rows shows "ON-CALL / APAC".
 * A drawer-level "Apply badge labels" button commits both rows.
 *
 * Success: Display badge committed value === "ON-CALL / APAC", display mode,
 *          Internal badge remains "ops-only", committed via "Apply badge labels".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Card, Chip, Drawer, Text, TextInput, ActionIcon, Group, Stack, Badge,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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

  return { s, inputRef, startEdit, setDraft, saveLocal, cancel };
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

export default function T08({ onSuccess }: TaskComponentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const displayRow = useRow('PENDING');
  const internalRow = useRow('ops-only');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  const handleApply = () => {
    if (displayRow.s.editing) displayRow.saveLocal();
    if (internalRow.s.editing) internalRow.saveLocal();
    setApplied(true);
  };

  useEffect(() => {
    if (
      applied &&
      !displayRow.s.editing &&
      !internalRow.s.editing &&
      displayRow.s.committed === 'ON-CALL / APAC' &&
      internalRow.s.committed === 'ops-only' &&
      !successFired.current
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, displayRow.s, internalRow.s, onSuccess]);

  return (
    <Box p="md">
      {/* Background content */}
      <Group mb="lg" gap="sm">
        <Badge variant="light" color="blue">Badges</Badge>
        <Badge variant="light" color="green">2 active</Badge>
      </Group>

      <Card shadow="xs" padding="md" radius="md" withBorder w={280} mb="lg">
        <Text fw={600} size="sm" mb={4}>Badge overview</Text>
        <Text size="xs" c="dimmed">Display: PENDING — Internal: ops-only</Text>
      </Card>

      <Button variant="light" onClick={open} data-testid="open-drawer">
        Edit badges
      </Button>

      <Drawer
        opened={opened}
        onClose={close}
        title="Badge labels"
        position="left"
        offset={8}
        size="sm"
        data-testid="badge-drawer"
      >
        <Stack gap="md" mt="sm">
          {/* Blue reference chip */}
          <Box>
            <Text size="xs" c="dimmed" mb={4}>Reference</Text>
            <Chip checked={false} variant="filled" color="blue" size="sm" data-testid="reference-chip">
              ON-CALL / APAC
            </Chip>
            <Text size="xs" c="dimmed" mt={4}>Match the text above exactly.</Text>
          </Box>

          <InlineEditRow label="Display badge" row={displayRow} testId="editable-display-badge" />
          <InlineEditRow label="Internal badge" row={internalRow} testId="editable-internal-badge" />

          <Button
            fullWidth
            onClick={handleApply}
            data-testid="apply-badge-labels-button"
          >
            Apply badge labels
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
}
