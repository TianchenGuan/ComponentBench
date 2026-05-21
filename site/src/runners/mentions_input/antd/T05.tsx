'use client';

/**
 * mentions_input-antd-T05: Compact reviewer: search and select Maya
 *
 * You are on a compact-density "Reviewer assignment" card.
 * - Theme: light; Spacing: compact (reduced padding and tighter line height).
 * - Target component: a single Ant Design Mentions input labeled Reviewer.
 * - The Mentions input is configured as a single-line autoSize (minRows=1) and is visually smaller due to compact spacing.
 * - Typing @ opens a suggestions dropdown. The list is moderately sized (12 options) and includes some similar prefixes:
 *   - Maya Rivera, Max Wu, Mia Davis, Emma Johnson, Ethan Brooks, Noah Patel, Olivia Kim, Sophia Nguyen, Ava Chen, Daniel Park, Priya Singh, Carlos Reyes
 * - The dropdown filters as you continue typing after '@' (e.g., '@ma' narrows to Maya/Max).
 * - Initial state: Reviewer field is empty; no dropdown open.
 *
 * No other fields are present.
 *
 * Success: Reviewer field text must be exactly: "@Maya Rivera" (whitespace-normalized).
 *          Detected mentions must be exactly: [Maya Rivera] (selected from the dropdown).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Mentions, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const { Text } = Typography;

const USERS = [
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'max', label: 'Max Wu' },
  { id: 'mia', label: 'Mia Davis' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'daniel', label: 'Daniel Park' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'carlos', label: 'Carlos Reyes' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const hasSucceeded = useRef(false);

  const mentions = deriveMentionsFromText(value, USERS);

  useEffect(() => {
    const normalizedText = normalizeWhitespace(value);
    const targetText = '@Maya Rivera';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'maya' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card 
      title="Reviewer assignment" 
      style={{ width: 400 }}
      styles={{ body: { padding: '12px 16px' } }}
    >
      <div style={{ marginBottom: 4 }}>
        <label htmlFor="reviewer" style={{ fontWeight: 500, marginBottom: 2, display: 'block', fontSize: 13 }}>
          Reviewer (compact)
        </label>
        <Text type="secondary" style={{ fontSize: 11, marginBottom: 4, display: 'block' }}>
          Set to @Maya Rivera.
        </Text>
        <Mentions
          id="reviewer"
          placeholder="Type @ to assign..."
          value={value}
          onChange={setValue}
          autoSize={{ minRows: 1, maxRows: 1 }}
          data-testid="reviewer-mentions"
          style={{ width: '100%' }}
        >
          {USERS.map(user => (
            <Mentions.Option key={user.id} value={user.label}>
              {user.label}
            </Mentions.Option>
          ))}
        </Mentions>
        <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
          Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
        </Text>
      </div>
    </Card>
  );
}
