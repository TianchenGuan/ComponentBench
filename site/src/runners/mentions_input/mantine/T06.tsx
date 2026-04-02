'use client';

/**
 * mentions_input-mantine-T06: Dark theme: match reference (pairing request)
 *
 * You are on a dark-theme "Match the preview" card built with Mantine.
 * - Target component: one composite mentions input labeled Message (Mantine Textarea).
 * - Typing '@' opens a Popover suggestions list (8 people): Maya Rivera, Liam Ortiz, Ava Chen, Noah Patel, Emma Johnson, Olivia Kim, Sophia Nguyen, Ethan Brooks.
 * - A Reference preview panel is displayed next to the textarea as a dark chat bubble with highlighted mentions.
 *   - The reference is shown visually; the agent must reproduce it in the Message input.
 * - Initial state: Message is empty; Popover closed.
 *
 * Success: Message must match the reference exactly: "Please ask @Maya Rivera to pair with @Liam Ortiz." (whitespace-normalized).
 *          Detected mentions must be exactly: [Maya Rivera, Liam Ortiz].
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, Group, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
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
    const targetText = 'Please ask @Maya Rivera to pair with @Liam Ortiz.';
    
    if (
      normalizedText === targetText &&
      mentions.length === 2 &&
      mentions[0].id === 'maya' &&
      mentions[1].id === 'liam' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" style={{ width: 650, background: '#1a1a1a', color: '#fff' }}>
      <Text fw={500} size="lg" mb="md" c="white">Match the preview</Text>
      <Text size="sm" c="dimmed" mb="xs">
        Reference preview shown (dark). Match it in Message.
      </Text>
      
      <Group align="flex-start" gap="lg">
        {/* Message input */}
        <Box style={{ flex: 1 }}>
          <Text size="sm" fw={500} mb={4} c="white">Message</Text>
          <Popover opened={opened} position="bottom-start" width="target" withinPortal>
            <Popover.Target>
              <Textarea
                ref={textareaRef}
                placeholder="Type @ to mention"
                value={value}
                onChange={handleChange}
                minRows={3}
                data-testid="message-textarea"
                styles={{
                  input: {
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    borderColor: '#444',
                    '&::placeholder': { color: '#888' },
                  },
                }}
              />
            </Popover.Target>
            <Popover.Dropdown style={{ backgroundColor: '#333', border: '1px solid #444' }}>
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
                      color: '#fff',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#444')}
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
        </Box>

        {/* Reference preview */}
        <Box style={{ width: 220 }}>
          <Text size="sm" fw={500} mb={4} c="white">Reference preview</Text>
          <Box
            style={{
              background: '#333',
              borderRadius: 12,
              padding: 12,
            }}
          >
            <Text size="sm" c="white" style={{ lineHeight: 1.6 }}>
              Please ask{' '}
              <span style={{ background: '#444', borderRadius: 4, padding: '2px 6px' }}>
                @Maya Rivera
              </span>
              {' '}to pair with{' '}
              <span style={{ background: '#444', borderRadius: 4, padding: '2px 6px' }}>
                @Liam Ortiz
              </span>
              .
            </Text>
          </Box>
        </Box>
      </Group>
    </Card>
  );
}
