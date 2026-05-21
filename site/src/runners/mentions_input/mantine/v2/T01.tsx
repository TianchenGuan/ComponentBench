'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, Switch, SegmentedControl, Group, Button, Box } from '@mantine/core';
import type { TaskComponentProps, UserSuggestion } from '../../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../../types';

const USERS: UserSuggestion[] = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'olivia', label: 'Olivia Kim' },
];

const INITIAL_PUBLIC = 'We are looking into this.';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [visibility, setVisibility] = useState('team');

  const [publicValue, setPublicValue] = useState(INITIAL_PUBLIC);
  const publicMentions = deriveMentionsFromText(publicValue, USERS);
  const [publicOpened, setPublicOpened] = useState(false);
  const [publicMentionStart, setPublicMentionStart] = useState<number | null>(null);
  const [publicFilterText, setPublicFilterText] = useState('');
  const publicRef = useRef<HTMLTextAreaElement>(null);

  const [internalValue, setInternalValue] = useState('');
  const internalMentions = deriveMentionsFromText(internalValue, USERS);
  const [internalOpened, setInternalOpened] = useState(false);
  const [internalMentionStart, setInternalMentionStart] = useState<number | null>(null);
  const [internalFilterText, setInternalFilterText] = useState('');
  const internalRef = useRef<HTMLTextAreaElement>(null);

  const [saved, setSaved] = useState(false);
  const hasSucceeded = useRef(false);

  const makeMentionHandler = (
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setOpened: React.Dispatch<React.SetStateAction<boolean>>,
    setStart: React.Dispatch<React.SetStateAction<number | null>>,
    setFilter: React.Dispatch<React.SetStateAction<string>>,
  ) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    setValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || charBeforeAt === '\n' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setStart(lastAtIndex);
        setFilter(textAfterAt.toLowerCase());
        setOpened(true);
        return;
      }
    }
    setOpened(false);
    setStart(null);
  };

  const makeSelectHandler = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    filterText: string,
    mentionStart: number | null,
    setOpened: React.Dispatch<React.SetStateAction<boolean>>,
    setStart: React.Dispatch<React.SetStateAction<number | null>>,
    ref: React.RefObject<HTMLTextAreaElement | null>,
  ) => (user: UserSuggestion) => {
    if (mentionStart === null) return;
    const before = value.substring(0, mentionStart);
    const after = value.substring(mentionStart + 1 + filterText.length);
    setValue(`${before}@${user.label}${after}`);
    setOpened(false);
    setStart(null);
    ref.current?.focus();
  };

  const handlePublicChange = makeMentionHandler(setPublicValue, setPublicOpened, setPublicMentionStart, setPublicFilterText);
  const handleInternalChange = makeMentionHandler(setInternalValue, setInternalOpened, setInternalMentionStart, setInternalFilterText);

  const handlePublicSelect = makeSelectHandler(publicValue, setPublicValue, publicFilterText, publicMentionStart, setPublicOpened, setPublicMentionStart, publicRef);
  const handleInternalSelect = makeSelectHandler(internalValue, setInternalValue, internalFilterText, internalMentionStart, setInternalOpened, setInternalMentionStart, internalRef);

  const publicFiltered = USERS.filter(u => u.label.toLowerCase().includes(publicFilterText));
  const internalFiltered = USERS.filter(u => u.label.toLowerCase().includes(internalFilterText));

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;
    const normalizedInternal = normalizeWhitespace(internalValue);
    const target = 'Loop in @Liam Ortiz and @Olivia Kim.';
    const publicUnchanged = normalizeWhitespace(publicValue) === normalizeWhitespace(INITIAL_PUBLIC);

    if (
      normalizedInternal === target &&
      internalMentions.length === 2 &&
      internalMentions[0].id === 'liam' &&
      internalMentions[1].id === 'olivia' &&
      publicUnchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, internalValue, internalMentions, publicValue, onSuccess]);

  const renderDropdown = (
    filtered: UserSuggestion[],
    onSelect: (u: UserSuggestion) => void,
    prefix: string,
  ) => (
    <Popover.Dropdown>
      <Stack gap="xs">
        {filtered.map(user => (
          <UnstyledButton
            key={user.id}
            onClick={() => onSelect(user)}
            data-testid={`${prefix}-option-${user.id}`}
            style={{ padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {user.label}
          </UnstyledButton>
        ))}
      </Stack>
    </Popover.Dropdown>
  );

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 480 }}>
      <Text fw={600} size="lg" mb="sm">Settings</Text>

      <Group mb="md" gap="lg">
        <Switch label="Auto-reply" defaultChecked size="sm" />
        <Switch label="Notifications" size="sm" />
      </Group>

      <Box mb="md">
        <Text size="sm" fw={500} mb={4}>Visibility</Text>
        <SegmentedControl
          value={visibility}
          onChange={setVisibility}
          data={[
            { label: 'Public', value: 'public' },
            { label: 'Team', value: 'team' },
            { label: 'Private', value: 'private' },
          ]}
          size="xs"
        />
      </Box>

      <Box mb="md">
        <Text size="sm" fw={500} mb={4}>Public message</Text>
        <Popover opened={publicOpened} position="bottom-start" width="target" withinPortal>
          <Popover.Target>
            <Textarea
              ref={publicRef}
              value={publicValue}
              onChange={handlePublicChange}
              minRows={2}
              data-testid="public-message-textarea"
            />
          </Popover.Target>
          {renderDropdown(publicFiltered, handlePublicSelect, 'public')}
        </Popover>
        <Text size="xs" c="dimmed" mt={4}>
          Detected mentions: {publicMentions.length > 0 ? publicMentions.map(m => m.label).join(', ') : '(none)'}
        </Text>
      </Box>

      <Box mb="md">
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
          {renderDropdown(internalFiltered, handleInternalSelect, 'internal')}
        </Popover>
        <Text size="xs" c="dimmed" mt={4}>
          Detected mentions: {internalMentions.length > 0 ? internalMentions.map(m => m.label).join(', ') : '(none)'}
        </Text>
      </Box>

      <Button onClick={() => setSaved(true)} data-testid="apply-note-button">
        Apply note
      </Button>
    </Card>
  );
}
