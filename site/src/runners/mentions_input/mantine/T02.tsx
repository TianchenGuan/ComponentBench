'use client';

/**
 * mentions_input-mantine-T02: Mantine update: thank Noah
 *
 * You are on a "Status update" card.
 * - Target component: one composite mentions input labeled Update (Mantine Textarea + Popover suggestions).
 * - Typing @ opens the suggestions Popover with 8 people:
 *   Ava Chen, Noah Patel, Maya Rivera, Liam Ortiz, Emma Johnson, Olivia Kim, Sophia Nguyen, Ethan Brooks.
 * - Selecting a suggestion inserts the mention and updates "Detected mentions".
 *
 * Initial state: Update is empty; no Popover open.
 *
 * Success: Update text must be exactly: "Thanks @Noah Patel!" (whitespace-normalized).
 *          Detected mentions must be exactly: [Noah Patel].
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
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
    const targetText = 'Thanks @Noah Patel!';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'noah' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="md">Status update</Text>
      <Text size="sm" c="dimmed" mb="xs">
        Update: Thanks @Noah Patel!
      </Text>
      <Popover opened={opened} position="bottom-start" width="target" withinPortal>
        <Popover.Target>
          <Textarea
            ref={textareaRef}
            label="Update"
            placeholder="Type @ to mention"
            value={value}
            onChange={handleChange}
            minRows={3}
            data-testid="update-textarea"
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
      <Text size="xs" c="dimmed" mt="xs">
        Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
      </Text>
    </Card>
  );
}
