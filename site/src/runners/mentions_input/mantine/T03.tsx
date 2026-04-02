'use client';

/**
 * mentions_input-mantine-T03: Mantine message: clear existing mention
 *
 * You are on a "Clear message" card.
 * - Target component: one composite mentions input labeled Message (Mantine Textarea).
 * - A small Clear button sits below the textarea (this button only clears the Message field).
 * - Mentions suggestions open in a Popover when typing '@'.
 * - Initial state: Message contains:
 *   "Please sync with @Emma Johnson today"
 *   and "Detected mentions" shows Emma Johnson.
 *
 * No other interactive elements are relevant.
 *
 * Success: Message must be empty after clearing (text == "" after whitespace normalization).
 *          Detected mentions must be empty.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Button } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const USERS = [
  { id: 'emma', label: 'Emma Johnson' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Please sync with @Emma Johnson today');
  const mentions = deriveMentionsFromText(value, USERS);
  const hasSucceeded = useRef(false);

  const handleClear = () => {
    setValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const normalizedText = normalizeWhitespace(value);
    
    if (
      normalizedText === '' &&
      mentions.length === 0 &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, mentions, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="md">Clear message</Text>
      <Text size="sm" c="dimmed" mb="xs">
        Message: clear it completely.
      </Text>
      <Textarea
        label="Message"
        placeholder="Type @ to mention"
        value={value}
        onChange={handleChange}
        minRows={3}
        data-testid="message-textarea"
      />
      <Text size="xs" c="dimmed" mt="xs">
        Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
      </Text>
      <Button 
        variant="outline" 
        size="xs" 
        mt="sm" 
        onClick={handleClear}
        data-testid="clear-button"
        aria-controls="message-textarea"
      >
        Clear
      </Button>
    </Card>
  );
}
