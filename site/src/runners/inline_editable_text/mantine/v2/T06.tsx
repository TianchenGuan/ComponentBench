'use client';

/**
 * inline_editable_text-mantine-v2-T06: Autosize partner note with confirm popover
 *
 * A centered "Partner notes" card with two inline editable rows: "External note"
 * (initial: "Owner: success") and "Internal note" (initial: "Owner: ops").
 * Editing swaps Text → Textarea autosize with Save / Cancel ActionIcons.
 * Clicking Save opens a Popover with "Apply note change?" and Confirm / Cancel buttons.
 *
 * Success: External note committed value === "Owner: success\nRoute: queue-eu",
 *          display mode, popover closed, Internal note remains "Owner: ops".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, Text, Textarea, ActionIcon, Group, Stack, Badge, Popover, Button,
} from '@mantine/core';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

interface NoteRowProps {
  label: string;
  value: string;
  onCommit: (v: string) => void;
  testId: string;
  withPopoverConfirm?: boolean;
}

function NoteEditRow({ label, value, onCommit, testId, withPopoverConfirm }: NoteRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editing]);

  const startEdit = () => { setDraft(value); setEditing(true); };
  const cancel = () => { setDraft(value); setEditing(false); setPopoverOpen(false); };

  const handleSaveClick = () => {
    if (withPopoverConfirm) {
      setPopoverOpen(true);
    } else {
      onCommit(draft);
      setEditing(false);
    }
  };

  const handleConfirm = () => {
    onCommit(draft);
    setPopoverOpen(false);
    setEditing(false);
  };

  const handlePopoverCancel = () => {
    setPopoverOpen(false);
  };

  return (
    <Box mb="sm">
      <Text size="sm" fw={500} mb={4}>{label}</Text>
      <Box
        data-testid={testId}
        data-mode={editing ? 'editing' : 'display'}
        data-value={value}
        data-popover={popoverOpen ? 'open' : 'closed'}
      >
        {editing ? (
          <Box>
            <Textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autosize
              minRows={2}
              maxRows={5}
              size="sm"
              data-testid={`${testId}-input`}
              mb="xs"
            />
            <Group gap="xs">
              <Popover opened={popoverOpen} onClose={handlePopoverCancel} position="bottom" withArrow>
                <Popover.Target>
                  <ActionIcon variant="filled" color="blue" size="sm" onClick={handleSaveClick} aria-label="Save" data-testid={`${testId}-save`}>
                    <IconCheck size={14} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown data-testid={`${testId}-popover`}>
                  <Text size="sm" mb="xs">Apply note change?</Text>
                  <Group gap="xs">
                    <Button size="xs" onClick={handleConfirm} data-testid={`${testId}-confirm`}>Confirm</Button>
                    <Button size="xs" variant="default" onClick={handlePopoverCancel} data-testid={`${testId}-popover-cancel`}>Cancel</Button>
                  </Group>
                </Popover.Dropdown>
              </Popover>
              <ActionIcon variant="default" size="sm" onClick={cancel} aria-label="Cancel" data-testid={`${testId}-cancel`}>
                <IconX size={14} />
              </ActionIcon>
            </Group>
          </Box>
        ) : (
          <Group gap="xs" style={{ cursor: 'pointer' }} onClick={startEdit} data-testid={`${testId}-display`}>
            <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{value || <span style={{ color: '#999' }}>(empty)</span>}</Text>
            <ActionIcon variant="subtle" size="sm"><IconPencil size={14} /></ActionIcon>
          </Group>
        )}
      </Box>
    </Box>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [externalNote, setExternalNote] = useState('Owner: success');
  const [internalNote, setInternalNote] = useState('Owner: ops');
  const successFired = useRef(false);

  const TARGET = 'Owner: success\nRoute: queue-eu';

  useEffect(() => {
    if (
      externalNote === TARGET &&
      internalNote === 'Owner: ops' &&
      !successFired.current
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [externalNote, internalNote, onSuccess]);

  return (
    <Box p="md" style={{ display: 'flex', justifyContent: 'center' }}>
      <Card shadow="sm" padding="md" radius="md" withBorder w={420} data-testid="partner-notes-card">
        <Text fw={600} size="md" mb="xs">Partner notes</Text>

        <Group gap="xs" mb="sm">
          <Badge size="xs" variant="light" color="blue">v2.1</Badge>
          <Badge size="xs" variant="light" color="grape">partner</Badge>
        </Group>

        <Stack gap="xs">
          <NoteEditRow
            label="External note"
            value={externalNote}
            onCommit={setExternalNote}
            testId="editable-external-note"
            withPopoverConfirm
          />
          <NoteEditRow
            label="Internal note"
            value={internalNote}
            onCommit={setInternalNote}
            testId="editable-internal-note"
            withPopoverConfirm
          />
        </Stack>
      </Card>
    </Box>
  );
}
