'use client';

/**
 * mentions_input-mantine-T07: Bottom-left small: pick Jun from long list
 *
 * You are on a small "Quick note" card anchored to the bottom-left of the viewport.
 * - Target component: one composite mentions input labeled Quick note (Mantine Textarea).
 * - Scale: small (smaller textarea height and smaller dropdown items).
 * - Typing '@' opens a Popover dropdown that contains a long list (~40 people) inside a scroll area.
 * - The list contains multiple "Ju…" / "Jo…" names such as Julia Stone, Jordan Lee, and Jun Ito.
 * - Typing after '@' filters, but using '@j' still leaves many results, so you may need to scroll within the dropdown.
 *
 * Initial state: Quick note is empty; dropdown closed.
 *
 * Success: Quick note must equal exactly: "@Jun Ito" (whitespace-normalized).
 *          Detected mentions must be exactly: [Jun Ito].
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

// Long list with many J names
const USERS = [
  { id: 'jun', label: 'Jun Ito' },
  { id: 'julia', label: 'Julia Stone' },
  { id: 'jordan', label: 'Jordan Lee' },
  { id: 'james', label: 'James Wilson' },
  { id: 'jennifer', label: 'Jennifer Lopez' },
  { id: 'john', label: 'John Smith' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'isabella', label: 'Isabella Garcia' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'daniel', label: 'Daniel Park' },
  { id: 'carlos', label: 'Carlos Reyes' },
  { id: 'max', label: 'Max Wu' },
  { id: 'mia', label: 'Mia Davis' },
  { id: 'fatima', label: 'Fatima Al-Sayed' },
  { id: 'farah', label: 'Farah Ali' },
  { id: 'fabian', label: 'Fabian Costa' },
  { id: 'alex', label: 'Alex Thompson' },
  { id: 'beth', label: 'Beth Martin' },
  { id: 'carl', label: 'Carl Brown' },
  { id: 'diana', label: 'Diana Ross' },
  { id: 'eric', label: 'Eric Williams' },
  { id: 'fiona', label: 'Fiona Green' },
  { id: 'greg', label: 'Greg Harris' },
  { id: 'helen', label: 'Helen Clark' },
  { id: 'ivan', label: 'Ivan Petrov' },
  { id: 'jane', label: 'Jane Smith' },
  { id: 'kevin', label: 'Kevin Chen' },
  { id: 'lisa', label: 'Lisa Wang' },
  { id: 'mike', label: 'Mike Johnson' },
  { id: 'nina', label: 'Nina Patel' },
  { id: 'oscar', label: 'Oscar Martinez' },
  { id: 'paula', label: 'Paula Garcia' },
  { id: 'quinn', label: 'Quinn Davis' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
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
    const targetText = '@Jun Ito';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'jun' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 280 }}>
      <Text fw={500} size="sm" mb="xs">Quick note</Text>
      <Text size="xs" c="dimmed" mb="xs">
        Quick note: @Jun Ito
      </Text>
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
          <ScrollArea h={150}>
            <Stack gap={2}>
              {filteredUsers.map(user => (
                <UnstyledButton
                  key={user.id}
                  onClick={() => handleSelectMention(user)}
                  data-testid={`option-${user.id}`}
                  style={{
                    padding: '4px 8px',
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
      </Popover>
      <Text size="xs" c="dimmed" mt="xs">
        Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
      </Text>
    </Card>
  );
}
