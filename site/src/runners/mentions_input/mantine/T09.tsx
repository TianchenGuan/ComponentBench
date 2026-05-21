'use client';

/**
 * mentions_input-mantine-T09: Dashboard: postmortem note with two mentions
 *
 * You are on a busy "Incident follow-up" dashboard (high clutter).
 *
 * Distractors:
 * - Sidebar navigation, header actions, several non-interactive metric cards, a long activity feed.
 *
 * Target components (E6=3):
 * There are three composite mentions inputs (Mantine Textarea + Popover suggestions) placed in different cards:
 * 1) Customer reply
 * 2) Internal note
 * 3) Postmortem note  ← target instance
 *
 * All three:
 * - Support '@' mention suggestions with a shared list (12 people):
 *   Isabella Garcia, Daniel Park, Ava Chen, Noah Patel, Maya Rivera, Liam Ortiz, Emma Johnson, Olivia Kim, Sophia Nguyen, Ethan Brooks, Priya Singh, Carlos Reyes.
 * - Have their own "Detected mentions" helper line.
 *
 * Initial state:
 * - Customer reply contains a short placeholder sentence.
 * - Internal note contains another placeholder sentence.
 * - Postmortem note is empty.
 *
 * Goal targets Postmortem note only.
 *
 * Success: Only Postmortem note must be changed.
 *          Postmortem note text must be exactly: "Follow up with @Isabella Garcia and @Daniel Park." (whitespace-normalized).
 *          Postmortem note detected mentions must be exactly: [Isabella Garcia, Daniel Park].
 *          Customer reply and Internal note must remain unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, Group, Box, NavLink, ScrollArea, ActionIcon } from '@mantine/core';
import { IconBell, IconSettings, IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps, Mention } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'isabella', label: 'Isabella Garcia' },
  { id: 'daniel', label: 'Daniel Park' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'carlos', label: 'Carlos Reyes' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  // Customer reply and Internal note (should not change)
  const [customerValue] = useState('Thank you for your patience during this incident.');
  const customerMentions = deriveMentionsFromText(customerValue, USERS);
  const [internalValue] = useState('Root cause: database connection pool exhaustion.');
  const internalMentions = deriveMentionsFromText(internalValue, USERS);

  // Postmortem note (target)
  const [postmortemValue, setPostmortemValue] = useState('');
  const postmortemMentions = deriveMentionsFromText(postmortemValue, USERS);
  const [postmortemOpened, setPostmortemOpened] = useState(false);
  const [postmortemMentionStart, setPostmortemMentionStart] = useState<number | null>(null);
  const [postmortemFilterText, setPostmortemFilterText] = useState('');
  const postmortemRef = useRef<HTMLTextAreaElement>(null);

  const hasSucceeded = useRef(false);

  const handlePostmortemChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    setPostmortemValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setPostmortemMentionStart(lastAtIndex);
        setPostmortemFilterText(textAfterAt.toLowerCase());
        setPostmortemOpened(true);
        return;
      }
    }
    
    setPostmortemOpened(false);
    setPostmortemMentionStart(null);
  };

  const handlePostmortemSelectMention = (user: typeof USERS[0]) => {
    if (postmortemMentionStart === null) return;
    
    const beforeMention = postmortemValue.substring(0, postmortemMentionStart);
    const afterCursor = postmortemValue.substring(postmortemMentionStart + 1 + postmortemFilterText.length);
    const newValue = `${beforeMention}@${user.label}${afterCursor}`;
    
    setPostmortemValue(newValue);
    setPostmortemOpened(false);
    setPostmortemMentionStart(null);
    postmortemRef.current?.focus();
  };

  const filteredUsers = USERS.filter(u => 
    u.label.toLowerCase().includes(postmortemFilterText)
  );

  useEffect(() => {
    const normalizedText = normalizeWhitespace(postmortemValue);
    const targetText = 'Follow up with @Isabella Garcia and @Daniel Park.';
    
    if (
      normalizedText === targetText &&
      postmortemMentions.length === 2 &&
      postmortemMentions[0].id === 'isabella' &&
      postmortemMentions[1].id === 'daniel' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [postmortemValue, postmortemMentions, onSuccess]);

  const renderMentionsCard = (
    title: string,
    value: string,
    mentions: Mention[],
    disabled: boolean,
    testId: string,
    textareaRef?: React.RefObject<HTMLTextAreaElement>,
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    popoverContent?: React.ReactNode
  ) => (
    <Card shadow="xs" padding="sm" radius="sm" withBorder style={{ width: 220 }} aria-label={title}>
      <Text size="sm" fw={500} mb={4}>{title}</Text>
      {popoverContent ? (
        <Popover opened={postmortemOpened} position="bottom-start" width="target" withinPortal>
          <Popover.Target>
            <Textarea
              ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
              placeholder="Type @ to mention"
              value={value}
              onChange={onChange}
              minRows={2}
              size="xs"
              data-testid={testId}
            />
          </Popover.Target>
          {popoverContent}
        </Popover>
      ) : (
        <Textarea
          value={value}
          readOnly
          minRows={2}
          size="xs"
          data-testid={testId}
        />
      )}
      <Text size="xs" c="dimmed" mt={4}>
        Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
      </Text>
    </Card>
  );

  return (
    <Box style={{ width: 900, display: 'flex', gap: 16 }}>
      {/* Sidebar (distractor) */}
      <Box style={{ width: 140, background: '#f5f5f5', padding: 12, borderRadius: 8 }}>
        <Text size="sm" fw={500} mb="xs">Navigation</Text>
        <NavLink label="Overview" disabled />
        <NavLink label="Incidents" disabled active />
        <NavLink label="Reports" disabled />
        <NavLink label="Settings" disabled />
      </Box>

      {/* Main content */}
      <Box style={{ flex: 1 }}>
        {/* Header */}
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">Incident follow-up</Text>
          <Group gap="xs">
            <ActionIcon variant="subtle" disabled><IconSearch size={16} /></ActionIcon>
            <ActionIcon variant="subtle" disabled><IconBell size={16} /></ActionIcon>
            <ActionIcon variant="subtle" disabled><IconSettings size={16} /></ActionIcon>
          </Group>
        </Group>

        <Text size="sm" c="dimmed" mb="md">
          Fill Postmortem note.
        </Text>

        {/* Cards grid */}
        <Group align="flex-start" gap="md">
          {/* Static metric cards */}
          <Card shadow="xs" padding="sm" radius="sm" withBorder style={{ width: 150 }}>
            <Text size="xs" c="dimmed">Duration</Text>
            <Text size="lg" fw={500}>47 min</Text>
          </Card>
          <Card shadow="xs" padding="sm" radius="sm" withBorder style={{ width: 150 }}>
            <Text size="xs" c="dimmed">Affected users</Text>
            <Text size="lg" fw={500}>2,340</Text>
          </Card>

          {/* Activity feed */}
          <Card shadow="xs" padding="sm" radius="sm" withBorder style={{ width: 200 }}>
            <Text size="sm" fw={500} mb="xs">Activity</Text>
            <ScrollArea h={80}>
              <Text size="xs" c="dimmed">10:15 - Incident opened</Text>
              <Text size="xs" c="dimmed">10:20 - Team notified</Text>
              <Text size="xs" c="dimmed">10:45 - Root cause found</Text>
              <Text size="xs" c="dimmed">11:02 - Fix deployed</Text>
            </ScrollArea>
          </Card>
        </Group>

        {/* Mentions cards */}
        <Group align="flex-start" gap="md" mt="md">
          {renderMentionsCard('Customer reply', customerValue, customerMentions, true, 'customer-reply-textarea')}
          {renderMentionsCard('Internal note', internalValue, internalMentions, true, 'internal-note-textarea')}
          {renderMentionsCard(
            'Postmortem note',
            postmortemValue,
            postmortemMentions,
            false,
            'postmortem-note-textarea',
            postmortemRef,
            handlePostmortemChange,
            <Popover.Dropdown>
              <ScrollArea h={120}>
                <Stack gap={2}>
                  {filteredUsers.map(user => (
                    <UnstyledButton
                      key={user.id}
                      onClick={() => handlePostmortemSelectMention(user)}
                      data-testid={`postmortem-option-${user.id}`}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 4,
                        fontSize: 12,
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
          )}
        </Group>
      </Box>
    </Box>
  );
}
