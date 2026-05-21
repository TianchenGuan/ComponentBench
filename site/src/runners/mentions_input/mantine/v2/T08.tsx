'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, Button, Switch, Group, Box, Badge } from '@mantine/core';
import type { TaskComponentProps, UserSuggestion } from '../../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../../types';

const USERS: UserSuggestion[] = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'carlos', label: 'Carlos Reyes' },
];

const INITIAL_PUBLIC = '(none)';
const INITIAL_INTERNAL = '(none)';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [publicValue, setPublicValue] = useState(INITIAL_PUBLIC);
  const publicMentions = deriveMentionsFromText(publicValue, USERS);
  const [publicOpened, setPublicOpened] = useState(false);
  const [publicMentionStart, setPublicMentionStart] = useState<number | null>(null);
  const [publicFilterText, setPublicFilterText] = useState('');
  const publicRef = useRef<HTMLTextAreaElement>(null);

  const [internalValue, setInternalValue] = useState(INITIAL_INTERNAL);
  const internalMentions = deriveMentionsFromText(internalValue, USERS);
  const [internalOpened, setInternalOpened] = useState(false);
  const [internalMentionStart, setInternalMentionStart] = useState<number | null>(null);
  const [internalFilterText, setInternalFilterText] = useState('');
  const internalRef = useRef<HTMLTextAreaElement>(null);

  const [escalationValue, setEscalationValue] = useState('');
  const escalationMentions = deriveMentionsFromText(escalationValue, USERS);
  const [escalationOpened, setEscalationOpened] = useState(false);
  const [escalationMentionStart, setEscalationMentionStart] = useState<number | null>(null);
  const [escalationFilterText, setEscalationFilterText] = useState('');
  const escalationRef = useRef<HTMLTextAreaElement>(null);

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
  const handleEscalationChange = makeMentionHandler(setEscalationValue, setEscalationOpened, setEscalationMentionStart, setEscalationFilterText);

  const handlePublicSelect = makeSelectHandler(publicValue, setPublicValue, publicFilterText, publicMentionStart, setPublicOpened, setPublicMentionStart, publicRef);
  const handleInternalSelect = makeSelectHandler(internalValue, setInternalValue, internalFilterText, internalMentionStart, setInternalOpened, setInternalMentionStart, internalRef);
  const handleEscalationSelect = makeSelectHandler(escalationValue, setEscalationValue, escalationFilterText, escalationMentionStart, setEscalationOpened, setEscalationMentionStart, escalationRef);

  const publicFiltered = USERS.filter(u => u.label.toLowerCase().includes(publicFilterText));
  const internalFiltered = USERS.filter(u => u.label.toLowerCase().includes(internalFilterText));
  const escalationFiltered = USERS.filter(u => u.label.toLowerCase().includes(escalationFilterText));

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;
    const normalizedEscalation = normalizeWhitespace(escalationValue);
    const target = 'Reviewed by @Emma Johnson — ping @Ethan Brooks if blocked.';
    const publicUnchanged = normalizeWhitespace(publicValue) === normalizeWhitespace(INITIAL_PUBLIC);
    const internalUnchanged = normalizeWhitespace(internalValue) === normalizeWhitespace(INITIAL_INTERNAL);

    if (
      normalizedEscalation === target &&
      escalationMentions.length === 2 &&
      escalationMentions[0].id === 'emma' &&
      escalationMentions[1].id === 'ethan' &&
      publicUnchanged &&
      internalUnchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, escalationValue, escalationMentions, publicValue, internalValue, onSuccess]);

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
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 520 }}>
      <Text fw={600} size="lg" mb="sm">Routing Settings</Text>

      <Group mb="md" gap="lg">
        <Switch label="Auto-route" defaultChecked size="sm" />
        <Switch label="Silent mode" size="sm" />
      </Group>

      <Group mb="md" gap="xs">
        <Badge color="green" variant="light">Active</Badge>
        <Badge color="blue" variant="light">v2.1</Badge>
        <Badge color="gray" variant="light">Region: US-East</Badge>
      </Group>

      {/* Mixed-guidance strip */}
      <Box mb="md" style={{ background: '#f0f4ff', borderRadius: 8, padding: '10px 14px' }}>
        <Text size="xs" fw={500} mb={4}>Suggested contacts for escalation:</Text>
        <Group gap="xs">
          <Badge variant="outline" color="indigo" size="sm">Emma Johnson</Badge>
          <Badge variant="outline" color="indigo" size="sm">Ethan Brooks</Badge>
        </Group>
      </Box>

      <Stack gap="md">
        <Box>
          <Text size="sm" fw={500} mb={4}>Public update</Text>
          <Popover opened={publicOpened} position="bottom-start" width="target" withinPortal>
            <Popover.Target>
              <Textarea
                ref={publicRef}
                value={publicValue}
                onChange={handlePublicChange}
                minRows={2}
                size="sm"
                data-testid="public-update-textarea"
              />
            </Popover.Target>
            {renderDropdown(publicFiltered, handlePublicSelect, 'public')}
          </Popover>
          <Text size="xs" c="dimmed" mt={4}>
            Detected mentions: {publicMentions.length > 0 ? publicMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </Box>

        <Box>
          <Text size="sm" fw={500} mb={4}>Internal update</Text>
          <Popover opened={internalOpened} position="bottom-start" width="target" withinPortal>
            <Popover.Target>
              <Textarea
                ref={internalRef}
                value={internalValue}
                onChange={handleInternalChange}
                minRows={2}
                size="sm"
                data-testid="internal-update-textarea"
              />
            </Popover.Target>
            {renderDropdown(internalFiltered, handleInternalSelect, 'internal')}
          </Popover>
          <Text size="xs" c="dimmed" mt={4}>
            Detected mentions: {internalMentions.length > 0 ? internalMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </Box>

        <Box>
          <Text size="sm" fw={500} mb={4}>Escalation note</Text>
          <Popover opened={escalationOpened} position="bottom-start" width="target" withinPortal>
            <Popover.Target>
              <Textarea
                ref={escalationRef}
                placeholder="Type @ to mention"
                value={escalationValue}
                onChange={handleEscalationChange}
                minRows={2}
                size="sm"
                data-testid="escalation-note-textarea"
              />
            </Popover.Target>
            {renderDropdown(escalationFiltered, handleEscalationSelect, 'escalation')}
          </Popover>
          <Text size="xs" c="dimmed" mt={4}>
            Detected mentions: {escalationMentions.length > 0 ? escalationMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </Box>
      </Stack>

      <Button mt="lg" onClick={() => setSaved(true)} data-testid="apply-routing-button">
        Apply routing
      </Button>
    </Card>
  );
}
