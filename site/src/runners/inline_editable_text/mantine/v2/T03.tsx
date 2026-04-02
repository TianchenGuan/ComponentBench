'use client';

/**
 * inline_editable_text-mantine-v2-T03: Service slug validation in dark compact panel
 *
 * A dark settings_panel in the bottom-right with compact spacing. Three inline editable
 * rows under "Routing labels": "Region slug" ("apac"), "Service slug" ("svc-queue-01"),
 * "Escalation slug" ("sev2"). TextInput size="xs" shows error "lowercase letters,
 * digits, and hyphens only" when invalid; Save is disabled while invalid.
 *
 * Success: Service slug committed value === "svc-queue-apac", display mode,
 *          Region slug and Escalation slug unchanged.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box, Card, Text, TextInput, ActionIcon, Group, Stack, Badge, Switch,
  MantineProvider,
} from '@mantine/core';
import { IconPencil, IconCheck, IconX, IconTag, IconRoute } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

const SLUG_RE = /^[a-z0-9-]*$/;

interface SlugRowProps {
  label: string;
  value: string;
  onCommit: (v: string) => void;
  testId: string;
}

function SlugEditRow({ label, value, onCommit, testId }: SlugRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const isValid = useMemo(() => SLUG_RE.test(draft), [draft]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const startEdit = () => { setDraft(value); setEditing(true); };
  const save = () => { if (isValid) { onCommit(draft); setEditing(false); } };
  const cancel = () => { setDraft(value); setEditing(false); };

  return (
    <Box mb="xs">
      <Text size="xs" fw={500} mb={2} c="dimmed">{label}</Text>
      <Box data-testid={testId} data-mode={editing ? 'editing' : 'display'} data-value={value}>
        {editing ? (
          <Group gap={4} wrap="nowrap">
            <TextInput
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              size="xs"
              style={{ flex: 1 }}
              error={!isValid ? 'lowercase letters, digits, and hyphens only' : undefined}
              data-testid={`${testId}-input`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') save();
                if (e.key === 'Escape') cancel();
              }}
            />
            <ActionIcon variant="filled" color="blue" size="xs" onClick={save} disabled={!isValid} aria-label="Save" data-testid={`${testId}-save`}>
              <IconCheck size={12} />
            </ActionIcon>
            <ActionIcon variant="default" size="xs" onClick={cancel} aria-label="Cancel" data-testid={`${testId}-cancel`}>
              <IconX size={12} />
            </ActionIcon>
          </Group>
        ) : (
          <Group gap={4} style={{ cursor: 'pointer' }} onClick={startEdit} data-testid={`${testId}-display`}>
            <Text size="xs" ff="monospace">{value}</Text>
            <ActionIcon variant="subtle" size="xs"><IconPencil size={12} /></ActionIcon>
          </Group>
        )}
      </Box>
    </Box>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [region, setRegion] = useState('apac');
  const [service, setService] = useState('svc-queue-01');
  const [escalation, setEscalation] = useState('sev2');
  const successFired = useRef(false);

  useEffect(() => {
    if (
      service === 'svc-queue-apac' &&
      region === 'apac' &&
      escalation === 'sev2' &&
      !successFired.current
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [service, region, escalation, onSuccess]);

  return (
    <MantineProvider defaultColorScheme="dark">
      <Box p="md" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: 420 }}>
        <Card shadow="sm" padding="sm" radius="md" withBorder w={300} bg="dark.7">
          <Group gap="xs" mb="sm">
            <IconRoute size={16} />
            <Text fw={600} size="sm">Routing labels</Text>
          </Group>

          {/* Clutter controls */}
          <Group gap="xs" mb="sm">
            <Badge size="xs" variant="light" color="teal">prod</Badge>
            <Badge size="xs" variant="light" color="orange">apac</Badge>
            <Switch size="xs" label="Auto-route" labelPosition="left" styles={{ label: { fontSize: 11 } }} />
          </Group>

          <Stack gap={4}>
            <SlugEditRow label="Region slug" value={region} onCommit={setRegion} testId="editable-region-slug" />
            <SlugEditRow label="Service slug" value={service} onCommit={setService} testId="editable-service-slug" />
            <SlugEditRow label="Escalation slug" value={escalation} onCommit={setEscalation} testId="editable-escalation-slug" />
          </Stack>

          <Group gap="xs" mt="sm">
            <IconTag size={12} />
            <Text size="xs" c="dimmed">Labels synced to routing mesh</Text>
          </Group>
        </Card>
      </Box>
    </MantineProvider>
  );
}
