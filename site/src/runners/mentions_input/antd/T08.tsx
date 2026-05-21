'use client';

/**
 * mentions_input-antd-T08: Bottom-right small: find Zoë in long list
 *
 * You are on a small card anchored to the bottom-right of the viewport (think "floating quick note").
 * - Target component: a single Ant Design Mentions input labeled Quick note.
 * - Scale: small; Spacing: compact (the textarea and dropdown items are smaller than default).
 * - The Mentions popup is configured with placement="top" so the dropdown opens upward (because the card is near the bottom of the screen).
 * - Suggestions list is long (about 40 people) and scrolls inside the popup. Many names start with similar letters.
 *   - The list includes multiple "Z…" entries such as: Zoe Zimmer, Zora Khan, Zane Miller, Zelia Costa, and Zoë Zimmerman.
 * - Typing after '@' filters the list, but typing just '@z' still leaves enough "Z…" options that scrolling may be required.
 * - Initial state: Quick note is empty; no dropdown open.
 *
 * No other interactive elements are present.
 *
 * Success: Quick note text must be exactly: "@Zoë Zimmerman" (whitespace-normalized).
 *          Detected mentions must be exactly: [Zoë Zimmerman] and must come from selecting the dropdown option.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Mentions, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const { Text } = Typography;

// Long list with many Z names
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
  { id: 'daniel', label: 'Daniel Park' },
  { id: 'carlos', label: 'Carlos Reyes' },
  { id: 'jun', label: 'Jun Ito' },
  { id: 'max', label: 'Max Wu' },
  { id: 'mia', label: 'Mia Davis' },
  { id: 'fatima', label: 'Fatima Al-Sayed' },
  { id: 'farah', label: 'Farah Ali' },
  { id: 'fabian', label: 'Fabian Costa' },
  { id: 'julia', label: 'Julia Stone' },
  { id: 'jordan', label: 'Jordan Lee' },
  { id: 'ann', label: 'Ann Lee' },
  { id: 'anna', label: 'Anna Lee' },
  { id: 'anne', label: 'Anne Lee' },
  { id: 'sofia', label: 'Sofia Navarro' },
  { id: 'alex', label: 'Alex Thompson' },
  { id: 'beth', label: 'Beth Martin' },
  { id: 'carl', label: 'Carl Brown' },
  { id: 'diana', label: 'Diana Ross' },
  { id: 'eric', label: 'Eric Williams' },
  { id: 'fiona', label: 'Fiona Green' },
  { id: 'greg', label: 'Greg Harris' },
  { id: 'helen', label: 'Helen Clark' },
  { id: 'ivan', label: 'Ivan Petrov' },
  { id: 'jane', label: 'Jane Smith' },
  { id: 'zoe_zimmer', label: 'Zoe Zimmer' },
  { id: 'zora', label: 'Zora Khan' },
  { id: 'zane', label: 'Zane Miller' },
  { id: 'zelia', label: 'Zelia Costa' },
  { id: 'zoe', label: 'Zoë Zimmerman' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const hasSucceeded = useRef(false);

  const mentions = deriveMentionsFromText(value, USERS);

  useEffect(() => {
    const normalizedText = normalizeWhitespace(value);
    const targetText = '@Zoë Zimmerman';
    
    if (
      normalizedText === targetText &&
      mentions.length === 1 &&
      mentions[0].id === 'zoe' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card 
      title="Quick note" 
      style={{ width: 300 }}
      styles={{ body: { padding: '8px 12px' } }}
      size="small"
    >
      <div style={{ marginBottom: 4 }}>
        <label htmlFor="quick-note" style={{ fontWeight: 500, marginBottom: 2, display: 'block', fontSize: 12 }}>
          Quick note
        </label>
        <Text type="secondary" style={{ fontSize: 10, marginBottom: 4, display: 'block' }}>
          Set to @Zoë Zimmerman.
        </Text>
        <Mentions
          id="quick-note"
          placeholder="Type @..."
          value={value}
          onChange={setValue}
          autoSize={{ minRows: 1, maxRows: 2 }}
          data-testid="quick-note-mentions"
          style={{ width: '100%', fontSize: 12 }}
          placement="top"
        >
          {USERS.map(user => (
            <Mentions.Option key={user.id} value={user.label}>
              {user.label}
            </Mentions.Option>
          ))}
        </Mentions>
        <Text type="secondary" style={{ fontSize: 10, marginTop: 4, display: 'block' }}>
          Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
        </Text>
      </div>
    </Card>
  );
}
