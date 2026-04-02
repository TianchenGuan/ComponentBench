'use client';

/**
 * inline_editable_text-mantine-v2-T07: Release badge exact casing in dark strip
 *
 * A dark inline_surface near the top-left with compact spacing and small controls.
 * Three inline editable rows packed into a narrow strip: "Release badge" ("pending"),
 * "Audience badge" ("public"), "Pager badge" ("on-call").
 * Each row uses Text/TextInput inline-edit with right-section ActionIcons.
 * Nearby icon buttons and chips add visual clutter.
 *
 * Success: Release badge committed value === "SEV-2 / Router", display mode,
 *          Audience badge and Pager badge unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, Text, TextInput, ActionIcon, Group, Stack, Badge, Chip,
  MantineProvider,
} from '@mantine/core';
import { IconPencil, IconCheck, IconX, IconBell, IconAlertTriangle } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

interface StripRowProps {
  label: string;
  value: string;
  onCommit: (v: string) => void;
  testId: string;
}

function StripEditRow({ label, value, onCommit, testId }: StripRowProps) {
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
    <Group gap="xs" wrap="nowrap" mb={4}>
      <Text size="xs" fw={500} w={100} style={{ flexShrink: 0 }}>{label}</Text>
      <Box style={{ flex: 1 }} data-testid={testId} data-mode={editing ? 'editing' : 'display'} data-value={value}>
        {editing ? (
          <TextInput
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            size="xs"
            data-testid={`${testId}-input`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') cancel();
            }}
            rightSection={
              <Group gap={2} wrap="nowrap">
                <ActionIcon variant="filled" color="blue" size="xs" onClick={save} aria-label="Save" data-testid={`${testId}-save`}>
                  <IconCheck size={10} />
                </ActionIcon>
                <ActionIcon variant="default" size="xs" onClick={cancel} aria-label="Cancel" data-testid={`${testId}-cancel`}>
                  <IconX size={10} />
                </ActionIcon>
              </Group>
            }
            rightSectionWidth={48}
          />
        ) : (
          <Group gap={4} style={{ cursor: 'pointer' }} onClick={startEdit} data-testid={`${testId}-display`}>
            <Text size="xs" ff="monospace">{value}</Text>
            <ActionIcon variant="subtle" size="xs"><IconPencil size={10} /></ActionIcon>
          </Group>
        )}
      </Box>
    </Group>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [releaseBadge, setReleaseBadge] = useState('pending');
  const [audienceBadge, setAudienceBadge] = useState('public');
  const [pagerBadge, setPagerBadge] = useState('on-call');
  const successFired = useRef(false);

  useEffect(() => {
    if (
      releaseBadge === 'SEV-2 / Router' &&
      audienceBadge === 'public' &&
      pagerBadge === 'on-call' &&
      !successFired.current
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [releaseBadge, audienceBadge, pagerBadge, onSuccess]);

  return (
    <MantineProvider defaultColorScheme="dark">
      <Box p="md" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <Card shadow="sm" padding="sm" radius="md" withBorder w={340} bg="dark.8">
          <Group gap="xs" mb="sm">
            <IconAlertTriangle size={14} />
            <Text fw={600} size="sm">Release strip</Text>
          </Group>

          {/* Clutter chips */}
          <Group gap={4} mb="sm">
            <Chip size="xs" defaultChecked variant="light">canary</Chip>
            <Chip size="xs" variant="light">stable</Chip>
            <ActionIcon variant="subtle" size="xs"><IconBell size={12} /></ActionIcon>
            <Badge size="xs" variant="dot" color="red">3 alerts</Badge>
          </Group>

          <Stack gap={0}>
            <StripEditRow label="Release badge" value={releaseBadge} onCommit={setReleaseBadge} testId="editable-release-badge" />
            <StripEditRow label="Audience badge" value={audienceBadge} onCommit={setAudienceBadge} testId="editable-audience-badge" />
            <StripEditRow label="Pager badge" value={pagerBadge} onCommit={setPagerBadge} testId="editable-pager-badge" />
          </Stack>
        </Card>
      </Box>
    </MantineProvider>
  );
}
