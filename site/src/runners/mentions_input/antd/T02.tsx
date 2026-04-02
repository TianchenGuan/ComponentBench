'use client';

/**
 * mentions_input-antd-T02: Issue comment: FYI Noah
 *
 * You are on an "Issue comment" card centered in the viewport.
 * - Target component: an Ant Design Mentions input (single instance) labeled Comment.
 * - The Mentions input is multiline and supports mentioning teammates with @.
 * - When you type @, a suggestions dropdown opens below the caret.
 * - Suggestions list (8 items): Ava Chen, Noah Patel, Maya Rivera, Liam Ortiz, Emma Johnson, Olivia Kim, Sophia Nguyen, Ethan Brooks.
 * - Selecting a suggestion inserts it into the text (e.g., "@Noah Patel") and updates a read-only "Detected mentions" line below the field.
 * - Initial state: the Comment field is empty.
 *
 * No other fields are required; there is a non-functional "Post" button shown as a distractor but success does not depend on clicking it.
 *
 * Success: The Comment Mentions input must contain exactly: "FYI @Noah Patel, please review." (whitespace-normalized).
 *          Detected mentions must be exactly: [Noah Patel].
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Mentions, Typography, Button } from 'antd';
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
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const hasSucceeded = useRef(false);

  const mentions = deriveMentionsFromText(value, USERS);

  useEffect(() => {
    const normalizedText = normalizeWhitespace(value);
    const targetText = 'FYI @Noah Patel, please review.';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'noah' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Issue comment" style={{ width: 450 }}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="comment" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Comment (supports @mentions)
        </label>
        <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
          Target: FYI @Noah Patel, please review.
        </Text>
        <Mentions
          id="comment"
          placeholder="Type @ to mention teammates..."
          value={value}
          onChange={setValue}
          rows={3}
          data-testid="comment-mentions"
          style={{ width: '100%' }}
        >
          {USERS.map(user => (
            <Mentions.Option key={user.id} value={user.label} data-testid={`option-${user.id}`}>
              {user.label}
            </Mentions.Option>
          ))}
        </Mentions>
        <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
          Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
        </Text>
      </div>
      <Button disabled style={{ opacity: 0.5 }}>Post</Button>
    </Card>
  );
}
