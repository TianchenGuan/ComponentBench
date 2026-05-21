'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, Button, Group, Box } from '@mantine/core';
import type { TaskComponentProps, UserSuggestion } from '../../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../../types';

const USERS: UserSuggestion[] = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'liam', label: 'Liam Ortiz' },
];

const INITIAL_AUDIT = 'Keep an internal copy.';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [msgValue, setMsgValue] = useState('');
  const msgMentions = deriveMentionsFromText(msgValue, USERS);
  const [msgOpened, setMsgOpened] = useState(false);
  const [msgMentionStart, setMsgMentionStart] = useState<number | null>(null);
  const [msgFilterText, setMsgFilterText] = useState('');
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const [auditValue, setAuditValue] = useState(INITIAL_AUDIT);
  const auditMentions = deriveMentionsFromText(auditValue, USERS);
  const [auditOpened, setAuditOpened] = useState(false);
  const [auditMentionStart, setAuditMentionStart] = useState<number | null>(null);
  const [auditFilterText, setAuditFilterText] = useState('');
  const auditRef = useRef<HTMLTextAreaElement>(null);

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

  const handleMsgChange = makeMentionHandler(setMsgValue, setMsgOpened, setMsgMentionStart, setMsgFilterText);
  const handleAuditChange = makeMentionHandler(setAuditValue, setAuditOpened, setAuditMentionStart, setAuditFilterText);
  const handleMsgSelect = makeSelectHandler(msgValue, setMsgValue, msgFilterText, msgMentionStart, setMsgOpened, setMsgMentionStart, msgRef);
  const handleAuditSelect = makeSelectHandler(auditValue, setAuditValue, auditFilterText, auditMentionStart, setAuditOpened, setAuditMentionStart, auditRef);

  const msgFiltered = USERS.filter(u => u.label.toLowerCase().includes(msgFilterText));
  const auditFiltered = USERS.filter(u => u.label.toLowerCase().includes(auditFilterText));

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;
    const normalizedMsg = normalizeWhitespace(msgValue);
    const target = 'Please ask @Maya Rivera to pair with @Liam Ortiz.';
    const auditUnchanged = normalizeWhitespace(auditValue) === normalizeWhitespace(INITIAL_AUDIT);

    if (
      normalizedMsg === target &&
      msgMentions.length === 2 &&
      msgMentions[0].id === 'maya' &&
      msgMentions[1].id === 'liam' &&
      auditUnchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, msgValue, msgMentions, auditValue, onSuccess]);

  const dropdownStyle = { backgroundColor: '#333', border: '1px solid #555' };
  const inputStyles = {
    input: {
      backgroundColor: '#2a2a2a',
      color: '#fff',
      borderColor: '#555',
    },
  };

  const renderDarkDropdown = (
    filtered: UserSuggestion[],
    onSelect: (u: UserSuggestion) => void,
    prefix: string,
  ) => (
    <Popover.Dropdown style={dropdownStyle}>
      <Stack gap="xs">
        {filtered.map(user => (
          <UnstyledButton
            key={user.id}
            onClick={() => onSelect(user)}
            data-testid={`${prefix}-option-${user.id}`}
            style={{ padding: '8px 12px', borderRadius: 4, cursor: 'pointer', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#444')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {user.label}
          </UnstyledButton>
        ))}
      </Stack>
    </Popover.Dropdown>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" style={{ width: 680, background: '#1a1a1a', color: '#fff' }}>
      <Text fw={600} size="lg" mb="md" c="white">Dashboard</Text>

      {/* Reference preview bubble */}
      <Box mb="lg">
        <Text size="sm" fw={500} mb={4} c="white">Reference preview</Text>
        <Box style={{ background: '#333', borderRadius: 12, padding: 14 }}>
          <Text size="sm" c="white" style={{ lineHeight: 1.6 }}>
            Please ask{' '}
            <span style={{ background: '#444', borderRadius: 4, padding: '2px 6px' }}>@Maya Rivera</span>
            {' '}to pair with{' '}
            <span style={{ background: '#444', borderRadius: 4, padding: '2px 6px' }}>@Liam Ortiz</span>
            .
          </Text>
        </Box>
      </Box>

      <Group align="flex-start" gap="lg">
        <Box style={{ flex: 1 }}>
          <Text size="sm" fw={500} mb={4} c="white">Message</Text>
          <Popover opened={msgOpened} position="bottom-start" width="target" withinPortal>
            <Popover.Target>
              <Textarea
                ref={msgRef}
                placeholder="Type @ to mention"
                value={msgValue}
                onChange={handleMsgChange}
                minRows={3}
                styles={inputStyles}
                data-testid="message-textarea"
              />
            </Popover.Target>
            {renderDarkDropdown(msgFiltered, handleMsgSelect, 'msg')}
          </Popover>
          <Text size="xs" c="dimmed" mt={4}>
            Detected mentions: {msgMentions.length > 0 ? msgMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </Box>

        <Box style={{ flex: 1 }}>
          <Text size="sm" fw={500} mb={4} c="white">Audit message</Text>
          <Popover opened={auditOpened} position="bottom-start" width="target" withinPortal>
            <Popover.Target>
              <Textarea
                ref={auditRef}
                value={auditValue}
                onChange={handleAuditChange}
                minRows={3}
                styles={inputStyles}
                data-testid="audit-message-textarea"
              />
            </Popover.Target>
            {renderDarkDropdown(auditFiltered, handleAuditSelect, 'audit')}
          </Popover>
          <Text size="xs" c="dimmed" mt={4}>
            Detected mentions: {auditMentions.length > 0 ? auditMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </Box>
      </Group>

      <Button mt="lg" onClick={() => setSaved(true)} data-testid="apply-message-button">
        Apply message
      </Button>
    </Card>
  );
}
