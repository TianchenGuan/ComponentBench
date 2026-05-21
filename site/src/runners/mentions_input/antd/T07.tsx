'use client';

/**
 * mentions_input-antd-T07: Dark theme: match reference (Assign/CC)
 *
 * You are on a dark-theme "Copy the reference" card.
 * - Target component: one Ant Design Mentions input labeled Message.
 * - Typing @ opens the suggestions dropdown (8 options): Emma Johnson, Noah Patel, Ava Chen, Maya Rivera, Liam Ortiz, Olivia Kim, Sophia Nguyen, Ethan Brooks.
 * - To the right of the input, there is a read-only Reference preview panel that shows the desired message as a chat bubble.
 *   - The reference bubble visually highlights mentions (e.g., a subtle pill background), but the agent must reproduce the same content in the Mentions input.
 * - Initial state: Message is empty; no dropdown open.
 *
 * No other interactive elements appear.
 *
 * Success: Message text must match the reference message exactly: "Assign to @Emma Johnson; CC @Noah Patel." (whitespace-normalized).
 *          Detected mentions must be exactly: [Emma Johnson, Noah Patel] with both inserted via suggestions.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Mentions, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const { Text } = Typography;

const USERS = [
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const hasSucceeded = useRef(false);

  const mentions = deriveMentionsFromText(value, USERS);

  useEffect(() => {
    if (hasSucceeded.current) return;
    const normalizedText = normalizeWhitespace(value);
    const targetText = 'Assign to @Emma Johnson; CC @Noah Patel.';

    if (
      normalizedText === targetText &&
      mentions.length === 2 &&
      mentions[0].id === 'emma' &&
      mentions[1].id === 'noah'
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card 
      title="Copy the reference" 
      style={{ width: 650, background: '#1f1f1f', borderColor: '#303030' }}
      styles={{ header: { color: '#fff', borderBottomColor: '#303030' }, body: { background: '#1f1f1f' } }}
    >
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Message input */}
        <div style={{ flex: 1 }}>
          <label htmlFor="message" style={{ fontWeight: 500, marginBottom: 4, display: 'block', color: '#fff' }}>
            Message
          </label>
          <Mentions
            id="message"
            placeholder="Type @ to mention teammates..."
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
          <Text style={{ fontSize: 12, marginTop: 8, display: 'block', color: '#888' }}>
            Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>

        {/* Reference preview */}
        <div style={{ width: 220 }}>
          <Text style={{ fontWeight: 500, marginBottom: 8, display: 'block', color: '#fff' }}>
            Reference preview
          </Text>
          <div
            style={{
              background: '#303030',
              borderRadius: 12,
              padding: 12,
              color: '#fff',
              fontSize: 14,
              lineHeight: 1.5,
            }}
            aria-label="Assign to @Emma Johnson; CC @Noah Patel."
          >
            Assign to{' '}
            <span style={{ background: '#404040', borderRadius: 4, padding: '2px 6px' }}>
              @Emma Johnson
            </span>
            ; CC{' '}
            <span style={{ background: '#404040', borderRadius: 4, padding: '2px 6px' }}>
              @Noah Patel
            </span>
            .
          </div>
        </div>
      </div>
    </Card>
  );
}
