'use client';

/**
 * mentions_input-mantine-T05: Settings panel: internal note with two mentions
 *
 * You are on a "Notification template" settings panel (low clutter).
 *
 * Panel includes a few toggles (distractors) and two message fields:
 *
 * Target components (E6=2):
 * 1) Public message — composite mentions input (Mantine Textarea + Popover suggestions)
 * 2) Internal note — composite mentions input (Mantine Textarea + Popover suggestions)  ← target instance
 *
 * Mentions behavior:
 * - Typing '@' opens a Popover list (9 people): Liam Ortiz, Olivia Kim, Ava Chen, Noah Patel, Maya Rivera, Emma Johnson, Sophia Nguyen, Ethan Brooks, Priya Singh.
 * - Selecting inserts "@Full Name" and updates "Detected mentions".
 *
 * Initial state:
 * - Public message already contains: "We're looking into this." (no mentions).
 * - Internal note is empty.
 *
 * Goal targets Internal note only.
 *
 * Success: Only the Internal note field must be updated.
 *          Internal note text must equal exactly: "Loop in @Liam Ortiz and @Olivia Kim." (whitespace-normalized).
 *          Internal note detected mentions must be exactly: [Liam Ortiz, Olivia Kim].
 *          Public message must remain unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, Switch, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'priya', label: 'Priya Singh' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  // Public message (should not change)
  const [publicValue] = useState("We're looking into this.");
  const publicMentions = deriveMentionsFromText(publicValue, USERS);

  // Internal note (target)
  const [internalValue, setInternalValue] = useState('');
  const internalMentions = deriveMentionsFromText(internalValue, USERS);
  const [internalOpened, setInternalOpened] = useState(false);
  const [internalMentionStart, setInternalMentionStart] = useState<number | null>(null);
  const [internalFilterText, setInternalFilterText] = useState('');
  const internalRef = useRef<HTMLTextAreaElement>(null);

  const hasSucceeded = useRef(false);

  const handleInternalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    setInternalValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setInternalMentionStart(lastAtIndex);
        setInternalFilterText(textAfterAt.toLowerCase());
        setInternalOpened(true);
        return;
      }
    }
    
    setInternalOpened(false);
    setInternalMentionStart(null);
  };

  const handleInternalSelectMention = (user: typeof USERS[0]) => {
    if (internalMentionStart === null) return;
    
    const beforeMention = internalValue.substring(0, internalMentionStart);
    const afterCursor = internalValue.substring(internalMentionStart + 1 + internalFilterText.length);
    const newValue = `${beforeMention}@${user.label}${afterCursor}`;
    
    setInternalValue(newValue);
    setInternalOpened(false);
    setInternalMentionStart(null);
    internalRef.current?.focus();
  };

  const filteredUsers = USERS.filter(u => 
    u.label.toLowerCase().includes(internalFilterText)
  );

  useEffect(() => {
    const normalizedText = normalizeWhitespace(internalValue);
    const targetText = 'Loop in @Liam Ortiz and @Olivia Kim.';
    
    if (
      normalizedText === targetText &&
      internalMentions.length === 2 &&
      internalMentions[0].id === 'liam' &&
      internalMentions[1].id === 'olivia' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [internalValue, internalMentions, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={500} size="lg" mb="md">Notification template</Text>
      
      {/* Distractor toggles */}
      <Group mb="md">
        <Switch label="Email alerts" defaultChecked disabled size="sm" />
        <Switch label="Slack alerts" disabled size="sm" />
      </Group>

      <Text size="sm" c="dimmed" mb="xs">
        Internal note: Loop in @Liam Ortiz and @Olivia Kim.
      </Text>

      {/* Public message (disabled) */}
      <div style={{ marginBottom: 16 }}>
        <Text size="sm" fw={500} mb={4}>Public message</Text>
        <Textarea
          value={publicValue}
          readOnly
          minRows={2}
          data-testid="public-message-textarea"
        />
        <Text size="xs" c="dimmed" mt={4}>
          Detected mentions: {publicMentions.length > 0 ? publicMentions.map(m => m.label).join(', ') : '(none)'}
        </Text>
      </div>

      {/* Internal note (target) */}
      <div>
        <Text size="sm" fw={500} mb={4}>Internal note</Text>
        <Popover opened={internalOpened} position="bottom-start" width="target" withinPortal>
          <Popover.Target>
            <Textarea
              ref={internalRef}
              placeholder="Type @ to mention"
              value={internalValue}
              onChange={handleInternalChange}
              minRows={2}
              data-testid="internal-note-textarea"
            />
          </Popover.Target>
          <Popover.Dropdown>
            <Stack gap="xs">
              {filteredUsers.map(user => (
                <UnstyledButton
                  key={user.id}
                  onClick={() => handleInternalSelectMention(user)}
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
          Detected mentions: {internalMentions.length > 0 ? internalMentions.map(m => m.label).join(', ') : '(none)'}
        </Text>
      </div>
    </Card>
  );
}
