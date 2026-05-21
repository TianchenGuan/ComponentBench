'use client';

/**
 * mentions_input-mantine-T04: Compact reviewer: search Maya
 *
 * You are on a compact-density "Reviewer" card built with Mantine.
 * - Target component: one composite mentions input labeled Reviewer (Mantine Textarea styled as a compact single-line input).
 * - Spacing: compact (tight padding and smaller line-height).
 * - Typing @ opens a Popover with a list of 12 people, including similar prefixes:
 *   - Maya Rivera, Max Wu, Mia Davis, Emma Johnson, Ethan Brooks, Noah Patel, Olivia Kim, Sophia Nguyen, Ava Chen, Daniel Park, Priya Singh, Carlos Reyes.
 * - The list filters as you type after '@'.
 *
 * Initial state: Reviewer is empty; Popover closed.
 *
 * Success: Reviewer must equal exactly: "@Maya Rivera" (whitespace-normalized).
 *          Detected mentions must be exactly: [Maya Rivera].
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'max', label: 'Max Wu' },
  { id: 'mia', label: 'Mia Davis' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'daniel', label: 'Daniel Park' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'carlos', label: 'Carlos Reyes' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
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
      if ((charBeforeAt === ' ' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
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

  useEffect(() => {
    const normalizedText = normalizeWhitespace(value);
    const targetText = '@Maya Rivera';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'maya' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 380 }}>
      <Text fw={500} size="md" mb="xs">Reviewer</Text>
      <Text size="xs" c="dimmed" mb="xs">
        Reviewer (compact): @Maya Rivera
      </Text>
      <Popover opened={opened} position="bottom-start" width="target" withinPortal>
        <Popover.Target>
          <Textarea
            ref={textareaRef}
            label="Reviewer"
            placeholder="Type @ to assign..."
            value={value}
            onChange={handleChange}
            minRows={1}
            maxRows={1}
            autosize
            size="xs"
            data-testid="reviewer-textarea"
          />
        </Popover.Target>
        <Popover.Dropdown>
          <ScrollArea h={150}>
            <Stack gap={2}>
              {filteredUsers.map(user => (
                <UnstyledButton
                  key={user.id}
                  onClick={() => handleSelectMention(user)}
                  data-testid={`option-${user.id}`}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 4,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {user.label}
                </UnstyledButton>
              ))}
            </Stack>
          </ScrollArea>
        </Popover.Dropdown>
      </Popover>
      <Text size="xs" c="dimmed" mt="xs">
        Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
      </Text>
    </Card>
  );
}
