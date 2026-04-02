'use client';

/**
 * mentions_input-antd-T03: Clear an existing announcement
 *
 * You are on a "Draft announcement" card.
 * - Target component: a single Ant Design Mentions input labeled Announcement.
 * - The component is configured with allowClear (a clear "x" icon appears inside the input when it has content).
 * - Suggestions open when typing @; suggestions list includes: Ava Chen, Maya Rivera, Liam Ortiz, Emma Johnson.
 * - Initial state: the Announcement field already contains the text:
 *   "Reminder: @Maya Rivera is on call today."
 *   The mention was inserted previously (Detected mentions shows: Maya Rivera).
 * - The @ suggestions dropdown is currently closed.
 *
 * No other controls are required for success.
 *
 * Success: The Announcement Mentions input must be completely empty after clearing (text is an empty string after whitespace normalization).
 *          Detected mentions must be empty (no selected mentions).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Mentions, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const { Text } = Typography;

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Reminder: @Maya Rivera is on call today.');
  const hasSucceeded = useRef(false);

  const mentions = deriveMentionsFromText(value, USERS);

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
  }, [value, onSuccess]);

  return (
    <Card title="Draft announcement" style={{ width: 450 }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="announcement" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Announcement (supports @mentions)
        </label>
        <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
          Clear it completely.
        </Text>
        <Mentions
          id="announcement"
          placeholder="Type @ to mention teammates..."
          value={value}
          onChange={setValue}
          rows={3}
          allowClear
          data-testid="announcement-mentions"
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
