'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, Button, ScrollArea, Box, Group, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { EXTENDED_USERS, normalizeWhitespace, deriveMentionsFromText } from '../../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const mentions = deriveMentionsFromText(value, EXTENDED_USERS);
  const [opened, setOpened] = useState(false);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [saved, setSaved] = useState(false);
  const hasSucceeded = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    setValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || charBeforeAt === '\n' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setMentionStart(lastAtIndex);
        setFilterText(textAfterAt.toLowerCase());
        setOpened(true);
        return;
      }
    }
    setOpened(false);
    setMentionStart(null);
  };

  const handleSelectMention = (user: (typeof EXTENDED_USERS)[0]) => {
    if (mentionStart === null) return;
    const before = value.substring(0, mentionStart);
    const after = value.substring(mentionStart + 1 + filterText.length);
    setValue(`${before}@${user.label}${after}`);
    setOpened(false);
    setMentionStart(null);
    textareaRef.current?.focus();
  };

  const filtered = EXTENDED_USERS.filter(u => u.label.toLowerCase().includes(filterText));

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;
    const normalizedText = normalizeWhitespace(value);
    if (
      normalizedText === '@Jun Ito' &&
      mentions.length === 1 &&
      mentions[0].id === 'jun'
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, value, mentions, onSuccess]);

  return (
    <Box style={{ position: 'relative', width: 700, height: 420 }}>
      {/* Busier background elements */}
      <Box style={{ position: 'absolute', top: 16, left: 16, right: 16 }}>
        <Group gap="md" mb="md">
          <Badge color="blue" variant="light">Sprint 14</Badge>
          <Badge color="green" variant="light">On Track</Badge>
          <Badge color="gray" variant="light">3 open items</Badge>
        </Group>
        <Box style={{ background: '#f8f9fa', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <Text size="sm" fw={500} mb={4}>Recent Activity</Text>
          <Text size="xs" c="dimmed">09:12 — Deployment pipeline completed</Text>
          <Text size="xs" c="dimmed">09:30 — Code review approved by team lead</Text>
          <Text size="xs" c="dimmed">10:05 — Staging environment updated</Text>
          <Text size="xs" c="dimmed">10:22 — QA pass initiated</Text>
        </Box>
        <Box style={{ background: '#f8f9fa', borderRadius: 8, padding: 16 }}>
          <Text size="sm" fw={500} mb={4}>Metrics</Text>
          <Group gap="xl">
            <Box>
              <Text size="xs" c="dimmed">Build time</Text>
              <Text size="md" fw={600}>2m 14s</Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed">Test coverage</Text>
              <Text size="md" fw={600}>87%</Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed">Open PRs</Text>
              <Text size="md" fw={600}>5</Text>
            </Box>
          </Group>
        </Box>
      </Box>

      {/* Floating quick note anchored bottom-left */}
      <Card
        shadow="md"
        padding="sm"
        radius="md"
        withBorder
        style={{ position: 'absolute', bottom: 0, left: 0, width: 280, zIndex: 10 }}
      >
        <Text fw={500} size="sm" mb="xs">Quick note</Text>
        <Popover opened={opened} position="top-start" width="target" withinPortal>
          <Popover.Target>
            <Textarea
              ref={textareaRef}
              placeholder="Type @..."
              value={value}
              onChange={handleChange}
              minRows={1}
              maxRows={2}
              size="xs"
              data-testid="quick-note-textarea"
            />
          </Popover.Target>
          <Popover.Dropdown>
            <ScrollArea h={160}>
              <Stack gap={2}>
                {filtered.map(user => (
                  <UnstyledButton
                    key={user.id}
                    onClick={() => handleSelectMention(user)}
                    data-testid={`option-${user.id}`}
                    style={{ padding: '5px 10px', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {user.label}
                  </UnstyledButton>
                ))}
              </Stack>
            </ScrollArea>
          </Popover.Dropdown>
        </Popover>
        <Text size="xs" c="dimmed" mt={4}>
          Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
        </Text>
        <Button size="xs" mt="xs" onClick={() => setSaved(true)} data-testid="save-quick-note-button">
          Save quick note
        </Button>
      </Card>
    </Box>
  );
}
