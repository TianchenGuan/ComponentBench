'use client';

/**
 * inline_editable_text-mantine-v2-T02: Support footer offscreen in ScrollArea
 *
 * An outer panel with tabs and filter controls wraps a "Brand settings" ScrollArea
 * containing four inline editable text rows mixed with switches and select controls.
 * Rows: "Hero line" ("Fast setup"), "Sidebar label" ("Internal"),
 *        "Support footer" ("Hours may change"), "Legal line" ("© 2026").
 * At load the Support footer row is below the fold inside the ScrollArea.
 *
 * Success: Support footer committed value === "Reply time varies by queue.",
 *          display mode, all other rows unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, Text, TextInput, ActionIcon, Group, Stack, ScrollArea,
  Tabs, Select, Switch, Badge, Divider,
} from '@mantine/core';
import { IconPencil, IconCheck, IconX, IconFilter } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

interface RowState { value: string; editing: boolean; draft: string }

function useEditableRow(initial: string) {
  const [state, setState] = useState<RowState>({ value: initial, editing: false, draft: initial });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [state.editing]);

  const startEdit = () => setState(s => ({ ...s, editing: true, draft: s.value }));
  const setDraft = (v: string) => setState(s => ({ ...s, draft: v }));
  const save = () => setState(s => ({ ...s, value: s.draft, editing: false }));
  const cancel = () => setState(s => ({ ...s, draft: s.value, editing: false }));

  return { state, inputRef, startEdit, setDraft, save, cancel };
}

interface InlineRowProps {
  label: string;
  row: ReturnType<typeof useEditableRow>;
  testId: string;
}

function InlineEditRow({ label, row, testId }: InlineRowProps) {
  const { state, inputRef, startEdit, setDraft, save, cancel } = row;

  return (
    <Box mb="xs">
      <Text size="sm" fw={500} mb={4}>{label}</Text>
      <Box data-testid={testId} data-mode={state.editing ? 'editing' : 'display'} data-value={state.value}>
        {state.editing ? (
          <Group gap="xs" wrap="nowrap">
            <TextInput
              ref={inputRef}
              value={state.draft}
              onChange={(e) => setDraft(e.target.value)}
              size="sm"
              style={{ flex: 1 }}
              data-testid={`${testId}-input`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') save();
                if (e.key === 'Escape') cancel();
              }}
            />
            <ActionIcon variant="filled" color="blue" size="sm" onClick={save} aria-label="Save" data-testid={`${testId}-save`}>
              <IconCheck size={14} />
            </ActionIcon>
            <ActionIcon variant="default" size="sm" onClick={cancel} aria-label="Cancel" data-testid={`${testId}-cancel`}>
              <IconX size={14} />
            </ActionIcon>
          </Group>
        ) : (
          <Group gap="xs" style={{ cursor: 'pointer' }} onClick={startEdit} data-testid={`${testId}-display`}>
            <Text size="sm">{state.value}</Text>
            <ActionIcon variant="subtle" size="sm"><IconPencil size={14} /></ActionIcon>
          </Group>
        )}
      </Box>
    </Box>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const heroRow = useEditableRow('Fast setup');
  const sidebarRow = useEditableRow('Internal');
  const supportRow = useEditableRow('Hours may change');
  const legalRow = useEditableRow('© 2026');
  const successFired = useRef(false);

  useEffect(() => {
    if (
      !supportRow.state.editing &&
      supportRow.state.value === 'Reply time varies by queue.' &&
      heroRow.state.value === 'Fast setup' &&
      sidebarRow.state.value === 'Internal' &&
      legalRow.state.value === '© 2026' &&
      !successFired.current
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [
    supportRow.state.value, supportRow.state.editing,
    heroRow.state.value, sidebarRow.state.value, legalRow.state.value, onSuccess,
  ]);

  return (
    <Box p="md" style={{ maxWidth: 520 }}>
      <Tabs defaultValue="brand" mb="md">
        <Tabs.List>
          <Tabs.Tab value="brand">Brand</Tabs.Tab>
          <Tabs.Tab value="advanced">Advanced</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Group mb="sm" gap="xs">
        <IconFilter size={14} />
        <Select size="xs" data={['All', 'Text only', 'Toggles']} defaultValue="All" w={120} />
        <Badge size="sm" variant="light">4 items</Badge>
      </Group>

      <Card shadow="xs" padding="sm" radius="md" withBorder>
        <Text fw={600} size="md" mb="sm">Brand settings</Text>

        <ScrollArea h={220} data-testid="brand-scroll-area">
          <Stack gap="xs" p="xs">
            <InlineEditRow label="Hero line" row={heroRow} testId="editable-hero-line" />

            <Divider />
            <Group gap="xs" mb="xs">
              <Text size="sm" fw={500}>Show banner</Text>
              <Switch size="sm" defaultChecked />
            </Group>

            <InlineEditRow label="Sidebar label" row={sidebarRow} testId="editable-sidebar-label" />

            <Divider />
            <Group gap="xs" mb="xs">
              <Text size="sm" fw={500}>Accent color</Text>
              <Select size="xs" data={['Blue', 'Green', 'Purple']} defaultValue="Blue" w={100} />
            </Group>

            <Divider />
            <Group gap="xs" mb="xs">
              <Text size="sm" fw={500}>Compact mode</Text>
              <Switch size="sm" />
            </Group>

            <InlineEditRow label="Support footer" row={supportRow} testId="editable-support-footer" />

            <Divider />
            <InlineEditRow label="Legal line" row={legalRow} testId="editable-legal-line" />
          </Stack>
        </ScrollArea>
      </Card>
    </Box>
  );
}
