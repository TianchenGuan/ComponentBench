'use client';

/**
 * mentions_input-mantine-T08: Drawer flow: FYI Carlos
 *
 * You start on a simple page with a single action button and a side drawer flow.
 *
 * Step to access the component:
 * - There is a button labeled Edit update. Clicking it opens a drawer from the right side of the screen.
 *
 * Inside the drawer (target area):
 * - Target component: one composite mentions input labeled Update message (Mantine Textarea).
 * - Typing '@' opens a Popover dropdown anchored to the textarea (still within the drawer).
 * - Suggestions list (10 people): Carlos Reyes, Ava Chen, Noah Patel, Maya Rivera, Liam Ortiz, Emma Johnson, Olivia Kim, Sophia Nguyen, Ethan Brooks, Priya Singh.
 * - There is also a "Save" button and a "Close" icon in the drawer header — these are distractors; success does not require clicking Save.
 *
 * Initial state:
 * - Drawer is initially closed.
 * - When opened, Update message is empty and has no mentions.
 *
 * Success: The drawer must be open (so the Update message field is accessible).
 *          Update message text must be exactly: "FYI @Carlos Reyes" (whitespace-normalized).
 *          Detected mentions must be exactly: [Carlos Reyes].
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, Button, Drawer, Group, CloseButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'carlos', label: 'Carlos Reyes' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'priya', label: 'Priya Singh' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [value, setValue] = useState('');
  const mentions = deriveMentionsFromText(value, USERS);
  const [popoverOpened, setPopoverOpened] = useState(false);
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
        setPopoverOpened(true);
        return;
      }
    }
    
    setPopoverOpened(false);
    setMentionStart(null);
  };

  const handleSelectMention = (user: typeof USERS[0]) => {
    if (mentionStart === null) return;
    
    const beforeMention = value.substring(0, mentionStart);
    const afterCursor = value.substring(mentionStart + 1 + filterText.length);
    const newValue = `${beforeMention}@${user.label}${afterCursor}`;
    
    setValue(newValue);
    setPopoverOpened(false);
    setMentionStart(null);
    textareaRef.current?.focus();
  };

  const filteredUsers = USERS.filter(u => 
    u.label.toLowerCase().includes(filterText)
  );

  useEffect(() => {
    const normalizedText = normalizeWhitespace(value);
    const targetText = 'FYI @Carlos Reyes';
    
    if (
      drawerOpened &&
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'carlos' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [drawerOpened, value, mentions, onSuccess]);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300 }}>
        <Text fw={500} size="lg" mb="md">Edit update drawer</Text>
        <Text size="sm" c="dimmed" mb="md">
          Set Update message to FYI @Carlos Reyes
        </Text>
        <Button onClick={openDrawer} data-testid="edit-update-button">
          Edit update
        </Button>
      </Card>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        size="md"
        title={
          <Group justify="space-between" style={{ width: '100%' }}>
            <Text fw={500}>Edit update</Text>
          </Group>
        }
      >
        <div style={{ padding: 16 }}>
          <Text size="sm" fw={500} mb={4}>Update message</Text>
          <Popover opened={popoverOpened} position="bottom-start" width="target" withinPortal>
            <Popover.Target>
              <Textarea
                ref={textareaRef}
                placeholder="Type @ to mention"
                value={value}
                onChange={handleChange}
                minRows={3}
                data-testid="update-message-textarea"
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

          <Group mt="lg">
            <Button disabled style={{ opacity: 0.5 }}>Save</Button>
          </Group>
        </div>
      </Drawer>
    </>
  );
}
