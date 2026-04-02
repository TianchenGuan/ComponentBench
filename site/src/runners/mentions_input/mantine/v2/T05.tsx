'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, Button, Group, Box } from '@mantine/core';
import type { TaskComponentProps, UserSuggestion } from '../../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../../types';

const USERS: UserSuggestion[] = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
];

const INITIAL_REVIEWER = 'Reviewed by @Ava Chen — ping if blocked.';
const INITIAL_ESCALATION = 'No escalation needed yet.';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [reviewerValue, setReviewerValue] = useState(INITIAL_REVIEWER);
  const reviewerMentions = deriveMentionsFromText(reviewerValue, USERS);
  const [reviewerOpened, setReviewerOpened] = useState(false);
  const [reviewerMentionStart, setReviewerMentionStart] = useState<number | null>(null);
  const [reviewerFilterText, setReviewerFilterText] = useState('');
  const reviewerRef = useRef<HTMLTextAreaElement>(null);

  const [escalationValue, setEscalationValue] = useState(INITIAL_ESCALATION);
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

  const handleReviewerChange = makeMentionHandler(setReviewerValue, setReviewerOpened, setReviewerMentionStart, setReviewerFilterText);
  const handleEscalationChange = makeMentionHandler(setEscalationValue, setEscalationOpened, setEscalationMentionStart, setEscalationFilterText);
  const handleReviewerSelect = makeSelectHandler(reviewerValue, setReviewerValue, reviewerFilterText, reviewerMentionStart, setReviewerOpened, setReviewerMentionStart, reviewerRef);
  const handleEscalationSelect = makeSelectHandler(escalationValue, setEscalationValue, escalationFilterText, escalationMentionStart, setEscalationOpened, setEscalationMentionStart, escalationRef);

  const reviewerFiltered = USERS.filter(u => u.label.toLowerCase().includes(reviewerFilterText));
  const escalationFiltered = USERS.filter(u => u.label.toLowerCase().includes(escalationFilterText));

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;
    const normalizedReviewer = normalizeWhitespace(reviewerValue);
    const target = 'Reviewed by @Emma Johnson — ping @Ethan Brooks if blocked.';
    const escalationUnchanged = normalizeWhitespace(escalationValue) === normalizeWhitespace(INITIAL_ESCALATION);

    if (
      normalizedReviewer === target &&
      reviewerMentions.some(m => m.id === 'emma') &&
      reviewerMentions.some(m => m.id === 'ethan') &&
      !reviewerMentions.some(m => m.id !== 'emma' && m.id !== 'ethan') &&
      escalationUnchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, reviewerValue, reviewerMentions, escalationValue, onSuccess]);

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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 680 }}>
      <Text fw={600} size="lg" mb="sm">Review Surface</Text>
      <Text size="sm" c="dimmed" mb="md">
        Replace the stale reviewer and add a backup contact.
      </Text>

      <Group align="flex-start" gap="lg">
        <Box style={{ flex: 1 }}>
          <Text size="sm" fw={500} mb={4}>Reviewer summary</Text>
          <Popover opened={reviewerOpened} position="bottom-start" width="target" withinPortal>
            <Popover.Target>
              <Textarea
                ref={reviewerRef}
                value={reviewerValue}
                onChange={handleReviewerChange}
                minRows={3}
                data-testid="reviewer-summary-textarea"
              />
            </Popover.Target>
            {renderDropdown(reviewerFiltered, handleReviewerSelect, 'reviewer')}
          </Popover>
          <Text size="xs" c="dimmed" mt={4}>
            Detected mentions: {reviewerMentions.length > 0 ? reviewerMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </Box>

        <Box style={{ flex: 1 }}>
          <Text size="sm" fw={500} mb={4}>Escalation note</Text>
          <Popover opened={escalationOpened} position="bottom-start" width="target" withinPortal>
            <Popover.Target>
              <Textarea
                ref={escalationRef}
                value={escalationValue}
                onChange={handleEscalationChange}
                minRows={3}
                data-testid="escalation-note-textarea"
              />
            </Popover.Target>
            {renderDropdown(escalationFiltered, handleEscalationSelect, 'escalation')}
          </Popover>
          <Text size="xs" c="dimmed" mt={4}>
            Detected mentions: {escalationMentions.length > 0 ? escalationMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </Box>
      </Group>

      <Button mt="lg" onClick={() => setSaved(true)} data-testid="save-summary-button">
        Save summary
      </Button>
    </Card>
  );
}
