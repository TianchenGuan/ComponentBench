'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Table, Textarea, Text, Popover, UnstyledButton, Stack, Button, Card, Badge, Box } from '@mantine/core';
import type { TaskComponentProps, UserSuggestion } from '../../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../../types';

const USERS: UserSuggestion[] = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'ethan', label: 'Ethan Brooks' },
];

interface RowState {
  value: string;
  opened: boolean;
  mentionStart: number | null;
  filterText: string;
  saved: boolean;
}

const INITIAL_ROWS: RowState[] = [
  { value: 'Waiting on ops.', opened: false, mentionStart: null, filterText: '', saved: false },
  { value: 'Escalate to ', opened: false, mentionStart: null, filterText: '', saved: false },
  { value: 'Can close after review.', opened: false, mentionStart: null, filterText: '', saved: false },
];

const INCIDENTS = [
  { id: 203, severity: 'Low' as const },
  { id: 204, severity: 'High' as const },
  { id: 205, severity: 'Medium' as const },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowState[]>(INITIAL_ROWS.map(r => ({ ...r })));
  const refs = [
    useRef<HTMLTextAreaElement>(null),
    useRef<HTMLTextAreaElement>(null),
    useRef<HTMLTextAreaElement>(null),
  ];
  const hasSucceeded = useRef(false);

  const handleChange = (rowIdx: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;

    setRows(prev => {
      const next = [...prev];
      next[rowIdx] = { ...next[rowIdx], value: newValue };

      const textBeforeCursor = newValue.substring(0, cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf('@');
      if (lastAtIndex !== -1) {
        const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
        const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
        if ((charBeforeAt === ' ' || charBeforeAt === '\n' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
          next[rowIdx].mentionStart = lastAtIndex;
          next[rowIdx].filterText = textAfterAt.toLowerCase();
          next[rowIdx].opened = true;
          return next;
        }
      }
      next[rowIdx].opened = false;
      next[rowIdx].mentionStart = null;
      return next;
    });
  };

  const handleSelect = (rowIdx: number, user: UserSuggestion) => {
    setRows(prev => {
      const next = [...prev];
      const row = next[rowIdx];
      if (row.mentionStart === null) return prev;
      const before = row.value.substring(0, row.mentionStart);
      const after = row.value.substring(row.mentionStart + 1 + row.filterText.length);
      next[rowIdx] = {
        ...row,
        value: `${before}@${user.label}${after}`,
        opened: false,
        mentionStart: null,
      };
      return next;
    });
    refs[rowIdx].current?.focus();
  };

  const handleSaveRow = (rowIdx: number) => {
    setRows(prev => {
      const next = [...prev];
      next[rowIdx] = { ...next[rowIdx], saved: true };
      return next;
    });
  };

  useEffect(() => {
    if (hasSucceeded.current) return;
    const targetRow = rows[1];
    if (!targetRow.saved) return;

    const normalizedTarget = normalizeWhitespace(targetRow.value);
    const expected = 'Escalate to @Priya Singh.';

    const row0Unchanged = normalizeWhitespace(rows[0].value) === normalizeWhitespace(INITIAL_ROWS[0].value);
    const row2Unchanged = normalizeWhitespace(rows[2].value) === normalizeWhitespace(INITIAL_ROWS[2].value);

    const targetMentions = deriveMentionsFromText(targetRow.value, USERS);
    if (
      normalizedTarget === expected &&
      targetMentions.length === 1 &&
      targetMentions[0].id === 'priya' &&
      row0Unchanged &&
      row2Unchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 620 }}>
      <Text fw={600} size="lg" mb="sm">Incident Log</Text>
      <Table striped withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 90 }}>Incident</Table.Th>
            <Table.Th style={{ width: 80 }}>Severity</Table.Th>
            <Table.Th>Note</Table.Th>
            <Table.Th style={{ width: 70 }}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {INCIDENTS.map((incident, idx) => {
            const row = rows[idx];
            const filtered = USERS.filter(u => u.label.toLowerCase().includes(row.filterText));
            const rowMentions = deriveMentionsFromText(row.value, USERS);
            const severityColor = incident.severity === 'High' ? 'red' : incident.severity === 'Medium' ? 'yellow' : 'blue';

            return (
              <Table.Tr key={incident.id}>
                <Table.Td>
                  <Text size="sm" fw={500}>#{incident.id}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={severityColor} variant="light" size="sm">{incident.severity}</Badge>
                </Table.Td>
                <Table.Td>
                  <Popover opened={row.opened} position="bottom-start" width={220} withinPortal>
                    <Popover.Target>
                      <Textarea
                        ref={refs[idx]}
                        value={row.value}
                        onChange={handleChange(idx)}
                        minRows={1}
                        maxRows={2}
                        autosize
                        size="xs"
                        data-testid={`note-${incident.id}-textarea`}
                      />
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Stack gap={2}>
                        {filtered.map(user => (
                          <UnstyledButton
                            key={user.id}
                            onClick={() => handleSelect(idx, user)}
                            data-testid={`row${idx}-option-${user.id}`}
                            style={{ padding: '5px 10px', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            {user.label}
                          </UnstyledButton>
                        ))}
                      </Stack>
                    </Popover.Dropdown>
                  </Popover>
                  {rowMentions.length > 0 && (
                    <Text size="xs" c="dimmed" mt={2}>
                      Mentions: {rowMentions.map(m => m.label).join(', ')}
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => handleSaveRow(idx)}
                    disabled={row.saved}
                    data-testid={`save-${incident.id}-button`}
                  >
                    {row.saved ? 'Saved' : 'Save'}
                  </Button>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
