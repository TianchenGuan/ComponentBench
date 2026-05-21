'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, Button, Box, ScrollArea } from '@mantine/core';
import type { TaskComponentProps, UserSuggestion } from '../../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../../types';

const USERS: UserSuggestion[] = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'farah', label: 'Farah Ali' },
  { id: 'fatima', label: 'Fatima Al-Sayed' },
  { id: 'fabian', label: 'Fabian Costa' },
  { id: 'ethan', label: 'Ethan Brooks' },
];

const INITIAL_SUMMARY = 'Summary stays unchanged.';
const INITIAL_FOOTER = 'Footer note stays unchanged.';
const INITIAL_BLOCKER = `Blocker log:
- Migration lag remains above threshold
- QA sign-off pending
Escalation path remains unchanged.
Escalation owner: 
Next update: 19:00 UTC`;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [summaryValue] = useState(INITIAL_SUMMARY);
  const summaryMentions = deriveMentionsFromText(summaryValue, USERS);

  const [blockerValue, setBlockerValue] = useState(INITIAL_BLOCKER);
  const blockerMentions = deriveMentionsFromText(blockerValue, USERS);
  const [blockerOpened, setBlockerOpened] = useState(false);
  const [blockerMentionStart, setBlockerMentionStart] = useState<number | null>(null);
  const [blockerFilterText, setBlockerFilterText] = useState('');
  const blockerRef = useRef<HTMLTextAreaElement>(null);

  const [footerValue] = useState(INITIAL_FOOTER);
  const footerMentions = deriveMentionsFromText(footerValue, USERS);

  const [saved, setSaved] = useState(false);
  const hasSucceeded = useRef(false);

  const handleBlockerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    setBlockerValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || charBeforeAt === '\n' || lastAtIndex === 0) && !textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setBlockerMentionStart(lastAtIndex);
        setBlockerFilterText(textAfterAt.toLowerCase());
        setBlockerOpened(true);
        return;
      }
    }
    setBlockerOpened(false);
    setBlockerMentionStart(null);
  };

  const handleBlockerSelect = (user: UserSuggestion) => {
    if (blockerMentionStart === null) return;
    const before = blockerValue.substring(0, blockerMentionStart);
    const after = blockerValue.substring(blockerMentionStart + 1 + blockerFilterText.length);
    setBlockerValue(`${before}@${user.label}${after}`);
    setBlockerOpened(false);
    setBlockerMentionStart(null);
    blockerRef.current?.focus();
  };

  const blockerFiltered = USERS.filter(u => u.label.toLowerCase().includes(blockerFilterText));

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;

    const expectedTarget = `Blocker log:
- Migration lag remains above threshold
- QA sign-off pending
Escalation path remains unchanged.
Escalation owner: @Fatima Al-Sayed
Next update: 19:00 UTC`;

    const normalizeLine = (text: string): string =>
      text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map(line => line.replace(/\s+/g, ' ').replace(/\s+([.;,!?])/g, '$1').trim())
        .join('\n')
        .trim();

    const normalizedBlocker = normalizeLine(blockerValue);
    const normalizedTarget = normalizeLine(expectedTarget);
    const summaryUnchanged = normalizeWhitespace(summaryValue) === normalizeWhitespace(INITIAL_SUMMARY);
    const footerUnchanged = normalizeWhitespace(footerValue) === normalizeWhitespace(INITIAL_FOOTER);

    if (
      normalizedBlocker === normalizedTarget &&
      blockerMentions.length === 1 &&
      blockerMentions[0].id === 'fatima' &&
      summaryUnchanged &&
      footerUnchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, blockerValue, blockerMentions, summaryValue, footerValue, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 520 }}>
      <Text fw={600} size="lg" mb="sm">Release Blockers</Text>

      <ScrollArea h={420} type="always" offsetScrollbars>
        <Stack gap="md" p="xs">
          {/* Summary (distractor) */}
          <Box>
            <Text size="sm" fw={500} mb={4}>Summary</Text>
            <Textarea
              value={summaryValue}
              readOnly
              minRows={2}
              data-testid="summary-textarea"
            />
            <Text size="xs" c="dimmed" mt={4}>
              Detected mentions: {summaryMentions.length > 0 ? summaryMentions.map(m => m.label).join(', ') : '(none)'}
            </Text>
          </Box>

          {/* Release blocker (target) — multiline, content extends below fold */}
          <Box>
            <Text size="sm" fw={500} mb={4}>Release blocker</Text>
            <Popover opened={blockerOpened} position="bottom-start" width="target" withinPortal>
              <Popover.Target>
                <Textarea
                  ref={blockerRef}
                  value={blockerValue}
                  onChange={handleBlockerChange}
                  minRows={6}
                  maxRows={8}
                  autosize
                  data-testid="release-blocker-textarea"
                />
              </Popover.Target>
              <Popover.Dropdown>
                <ScrollArea h={140}>
                  <Stack gap={2}>
                    {blockerFiltered.map(user => (
                      <UnstyledButton
                        key={user.id}
                        onClick={() => handleBlockerSelect(user)}
                        data-testid={`blocker-option-${user.id}`}
                        style={{ padding: '6px 10px', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {user.label}
                      </UnstyledButton>
                    ))}
                  </Stack>
                </ScrollArea>
              </Popover.Dropdown>
            </Popover>
            <Text size="xs" c="dimmed" mt={4}>
              Detected mentions: {blockerMentions.length > 0 ? blockerMentions.map(m => m.label).join(', ') : '(none)'}
            </Text>
          </Box>

          {/* Footer note (distractor) */}
          <Box>
            <Text size="sm" fw={500} mb={4}>Footer note</Text>
            <Textarea
              value={footerValue}
              readOnly
              minRows={2}
              data-testid="footer-note-textarea"
            />
            <Text size="xs" c="dimmed" mt={4}>
              Detected mentions: {footerMentions.length > 0 ? footerMentions.map(m => m.label).join(', ') : '(none)'}
            </Text>
          </Box>
        </Stack>
      </ScrollArea>

      <Button mt="md" onClick={() => setSaved(true)} data-testid="apply-blockers-button">
        Apply blockers
      </Button>
    </Card>
  );
}
