'use client';

/**
 * mentions_input-mantine-T01: Mantine chat: greet Ava
 *
 * You are on a centered "Chat message" card built with Mantine.
 * - Target component: a composite mentions input implemented with Mantine primitives:
 *   - Mantine Textarea for text entry
 *   - Mantine Popover for the dropdown container
 *   - Mantine Combobox (or Autocomplete-like list) for suggestion options
 * - The field label is Message and the placeholder says "Type @ to mention".
 * - When you type @, a Popover opens under the textarea with 6 suggestions:
 *   Ava Chen, Noah Patel, Maya Rivera, Liam Ortiz, Emma Johnson, Olivia Kim.
 * - Selecting an option inserts "@Full Name" into the text and updates a helper line "Detected mentions: …".
 * - Initial state: Message is empty; Popover closed.
 *
 * No other interactive elements exist.
 *
 * Success: Message text must be exactly: "Hi @Ava Chen" (whitespace-normalized).
 *          Detected mentions must be exactly: [Ava Chen].
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
];

export default function T01({ onSuccess }: TaskComponentProps) {
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
    const targetText = 'Hi @Ava Chen';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'ava' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="md">Chat message</Text>
      <Text size="sm" c="dimmed" mb="xs">
        Message: Hi @Ava Chen
      </Text>
      <Popover opened={opened} position="bottom-start" width="target" withinPortal>
        <Popover.Target>
          <Textarea
            ref={textareaRef}
            label="Message"
            placeholder="Type @ to mention"
            value={value}
            onChange={handleChange}
            minRows={3}
            data-testid="message-textarea"
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
