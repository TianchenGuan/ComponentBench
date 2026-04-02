'use client';

/**
 * mentions_input-mantine-T10: Top-left form: match two-line announcement
 *
 * You are on a "Slack announcement" form section positioned near the top-left of the viewport (low clutter).
 *
 * Form context (distractors):
 * - Channel (select, read-only)
 * - Send at (date/time, disabled)
 * - A non-functional "Send" button
 *
 * Target component:
 * - One composite mentions input labeled Announcement text (Mantine Textarea).
 * - Typing '@' opens a Popover suggestions list: Ava Chen, Noah Patel, Maya Rivera, Liam Ortiz, Emma Johnson, Olivia Kim.
 * - Selecting from the list inserts "@Full Name" and updates "Detected mentions".
 *
 * Guidance (mixed):
 * - On the right, a "Sample announcement" panel shows the exact text to copy:
 *   - visually in a message bubble
 *   - and as a plain-text sample with line breaks preserved
 *
 * Initial state: Announcement text is empty.
 *
 * Success: Announcement text must match the sample exactly, including the line break between the two lines.
 *          Expected text (with newline):
 *            Great work @Ava Chen!
 *            Thanks @Noah Patel and @Maya Rivera.
 *          Detected mentions must be exactly: [Ava Chen, Noah Patel, Maya Rivera].
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, Group, Box, Select, Button } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
];

const TARGET_TEXT = `Great work @Ava Chen!
Thanks @Noah Patel and @Maya Rivera.`;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const mentions = deriveMentionsFromText(value, USERS);
  const [opened, setOpened] = useState(false);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
      if ((charBeforeAt === ' ' || charBeforeAt === '\n' || lastAtIndex === 0) && !textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setMentionStart(lastAtIndex);
        setFilterText(textAfterAt.toLowerCase());
        setOpened(true);
        return;
      }
    }
    
    setOpened(false);
    setMentionStart(null);
  };

  const handleSelectMention = (user: typeof USERS[0]) => {
    if (mentionStart === null) return;
    
    const beforeMention = value.substring(0, mentionStart);
    const afterCursor = value.substring(mentionStart + 1 + filterText.length);
    const newValue = `${beforeMention}@${user.label}${afterCursor}`;
    
    setValue(newValue);
    setOpened(false);
    setMentionStart(null);
    textareaRef.current?.focus();
  };

  const filteredUsers = USERS.filter(u => 
    u.label.toLowerCase().includes(filterText)
  );

  const normalizeText = (text: string): string => {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map(line => line.replace(/\s+/g, ' ').replace(/\s+([.!;,?])/g, '$1').trim())
      .join('\n')
      .trim();
  };

  useEffect(() => {
    if (hasSucceeded.current) return;
    const normalizedValue = normalizeText(value);
    const normalizedTarget = normalizeText(TARGET_TEXT);

    if (normalizedValue !== normalizedTarget) return;

    const requiredIds = new Set(['ava', 'noah', 'maya']);
    const mentionIds = new Set(mentions.map(m => m.id));
    const mentionsOk = requiredIds.size === mentionIds.size &&
      Array.from(requiredIds).every(id => mentionIds.has(id));

    if (mentionsOk) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Group align="flex-start" gap="lg">
      {/* Form section */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="lg" mb="md">Slack announcement</Text>
        <Text size="sm" c="dimmed" mb="md">
          Announcement text: match the sample (two lines).
        </Text>
        
        {/* Distractor fields */}
        <div style={{ marginBottom: 16 }}>
          <Select
            label="Channel"
            value="#general"
            data={['#general', '#announcements', '#team']}
            disabled
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Text size="sm" fw={500} mb={4}>Send at</Text>
          <Text size="sm" c="dimmed">2024-01-15 10:00 AM (disabled)</Text>
        </div>

        {/* Target field */}
        <div style={{ marginBottom: 16 }}>
          <Text size="sm" fw={500} mb={4}>Announcement text</Text>
          <Popover opened={opened} position="bottom-start" width="target" withinPortal>
            <Popover.Target>
              <Textarea
                ref={textareaRef}
                placeholder="Type @ to mention"
                value={value}
                onChange={handleChange}
                minRows={3}
                data-testid="announcement-textarea"
              />
            </Popover.Target>
            <Popover.Dropdown>
              <Stack gap="xs">
                {filteredUsers.map(user => (
                  <UnstyledButton
                    key={user.id}
                    onClick={() => handleSelectMention(user)}
                    data-testid={`option-${user.id}`}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {user.label}
                  </UnstyledButton>
                ))}
              </Stack>
            </Popover.Dropdown>
          </Popover>
          <Text size="xs" c="dimmed" mt={4}>
            Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>

        <Button disabled style={{ opacity: 0.5 }}>Send</Button>
      </Card>

      {/* Sample announcement panel */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 280 }}>
        <Text fw={500} size="md" mb="md">Sample announcement</Text>
        
        {/* Visual bubble */}
        <Box
          style={{
            background: '#f0f4ff',
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <Text size="sm" style={{ lineHeight: 1.6 }}>
            Great work{' '}
            <span style={{ background: '#e0e7ff', borderRadius: 4, padding: '1px 4px' }}>
              @Ava Chen
            </span>
            !
          </Text>
          <Text size="sm" style={{ lineHeight: 1.6 }}>
            Thanks{' '}
            <span style={{ background: '#e0e7ff', borderRadius: 4, padding: '1px 4px' }}>
              @Noah Patel
            </span>
            {' '}and{' '}
            <span style={{ background: '#e0e7ff', borderRadius: 4, padding: '1px 4px' }}>
              @Maya Rivera
            </span>
            .
          </Text>
        </Box>

        {/* Plain text sample */}
        <Text
          size="xs"
          style={{
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            background: '#f5f5f5',
            padding: 8,
            borderRadius: 4,
          }}
        >
          {TARGET_TEXT}
        </Text>
      </Card>
    </Group>
  );
}
