'use client';

/**
 * mentions_input-antd-T04: Open the @ suggestions dropdown
 *
 * You are on a minimal "Mention picker" card.
 * - Target component: a single Ant Design Mentions input labeled Message.
 * - The textarea is empty and focused state is not active initially.
 * - When you type the trigger character @, the component opens a suggestions dropdown (Mentions popup) with 10 people.
 * - The dropdown shows at least these options: Ava Chen, Noah Patel, Maya Rivera, Liam Ortiz, Emma Johnson, Olivia Kim, Sophia Nguyen, Ethan Brooks, Isabella Garcia, Priya Singh.
 * - No selection has been made yet; "Detected mentions" reads "(none)".
 *
 * There are no other fields. The goal is specifically about opening (and keeping open) the Mentions suggestions overlay.
 *
 * Success: The Message Mentions suggestions dropdown must be open/visible.
 *          The active trigger must be '@' with the current query text equal to just '@' (no additional filter characters).
 *          No mention should be inserted into the Message field (Detected mentions remains empty).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Mentions, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { deriveMentionsFromText } from '../types';

const { Text } = Typography;

const USERS = [
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
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const hasSucceeded = useRef(false);

  const mentions = deriveMentionsFromText(value, USERS);

  useEffect(() => {
    // Success when dropdown is open, value is just '@', and no mentions selected
    if (
      isOpen &&
      value === '@' &&
      mentions.length === 0 &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [isOpen, value, onSuccess]);

  return (
    <Card title="Mention picker" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="message" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Message
        </label>
        <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
          Type @ to open suggestions (do not select).
        </Text>
        <Mentions
          id="message"
          placeholder="Type @ to mention a teammate"
          value={value}
          onChange={setValue}
          onFocus={() => {}}
          onBlur={() => setIsOpen(false)}
          onSearch={(_, prefix) => {
            setIsOpen(prefix === '@');
          }}
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
