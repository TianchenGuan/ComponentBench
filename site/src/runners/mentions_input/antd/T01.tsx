'use client';

/**
 * mentions_input-antd-T01: Chat composer: greet Ava
 *
 * You are on a simple "Chat composer" card centered in the viewport.
 * - Target component: an Ant Design Mentions input (single instance) labeled Message.
 * - The Mentions input is a multiline textarea with a placeholder: "Type @ to mention a teammate".
 * - When you type @, a suggestions dropdown appears under the caret (Mentions popup).
 * - Suggestions list (short, 6 items) shows full names:
 *   - Ava Chen, Noah Patel, Maya Rivera, Liam Ortiz, Emma Johnson, Olivia Kim
 * - Selecting a suggestion inserts a mention token into the textarea (the inserted text includes the leading "@").
 * - Below the field there is a small read-only line "Detected mentions: …" that updates when a suggestion is selected.
 * - Initial state: the Message field is empty; no popup is open.
 *
 * Success: The only Mentions input on the page (Message) must contain the exact text: "Hi @Ava Chen" (whitespace-normalized).
 *          The selected mentions list for this input must be exactly: [Ava Chen].
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Mentions, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const { Text } = Typography;

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'olivia', label: 'Olivia Kim' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const hasSucceeded = useRef(false);

  const mentions = deriveMentionsFromText(value, USERS);

  useEffect(() => {
    const normalizedText = normalizeWhitespace(value);
    const targetText = 'Hi @Ava Chen';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'ava' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Chat composer" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="message" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Message
        </label>
        <Mentions
          id="message"
          placeholder="Type @ to mention a teammate"
          value={value}
          onChange={setValue}
          rows={3}
          data-testid="message-mentions"
          style={{ width: '100%' }}
        >
          {USERS.map(user => (
            <Mentions.Option key={user.id} value={user.label}>
              {user.label}
            </Mentions.Option>
          ))}
        </Mentions>
        <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
          Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
        </Text>
      </div>
    </Card>
  );
}
