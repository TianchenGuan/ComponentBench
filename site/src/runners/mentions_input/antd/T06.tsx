'use client';

/**
 * mentions_input-antd-T06: Internal note: add two mentions
 *
 * You are in a "Support ticket reply" form section (light theme, comfortable spacing).
 *
 * Layout:
 * - A form card contains several standard fields (Subject text input, Priority select, a non-functional "Send" button). These are distractors and are not required for success.
 * - In the middle of the form there are two Ant Design Mentions inputs of the same type:
 *
 * Instances (E6=2):
 * 1) Customer reply (Mentions) — labeled "Customer reply"
 * 2) Internal note (Mentions) — labeled "Internal note"
 *
 * Mentions behavior:
 * - Both fields support @ mentions with a dropdown suggestions popup.
 * - Suggestions list (shared): Ava Chen, Liam Ortiz, Noah Patel, Maya Rivera, Priya Singh, Ethan Brooks.
 * - Each field has its own "Detected mentions" line directly underneath it.
 *
 * Initial state:
 * - Customer reply contains existing text: "Thanks for reaching out." (no mentions).
 * - Internal note is empty and has no mentions.
 *
 * Target: Internal note.
 *
 * Success: Only the Internal note Mentions input must be modified.
 *          Internal note text must equal exactly: "Looping in @Ava Chen and @Liam Ortiz." (whitespace-normalized).
 *          Internal note detected mentions must be exactly: [Ava Chen, Liam Ortiz] (both selected from dropdown).
 *          Customer reply text/mentions must remain unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Mentions, Typography, Input, Select, Button, Space } from 'antd';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const { Text } = Typography;

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'ethan', label: 'Ethan Brooks' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [customerValue] = useState('Thanks for reaching out.');
  const [customerMentions] = useState<{ id: string; label: string }[]>([]);
  
  const [internalValue, setInternalValue] = useState('');
  
  const hasSucceeded = useRef(false);

  const internalMentions = deriveMentionsFromText(internalValue, USERS);

  useEffect(() => {
    if (hasSucceeded.current) return;
    const normalizedText = normalizeWhitespace(internalValue);
    const targetText = 'Looping in @Ava Chen and @Liam Ortiz.';

    if (normalizedText !== targetText) return;

    if (
      internalMentions.length === 2 &&
      internalMentions[0].id === 'ava' &&
      internalMentions[1].id === 'liam'
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [internalValue, internalMentions, onSuccess]);

  return (
    <Card title="Support ticket reply" style={{ width: 550 }}>
      {/* Distractor fields */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Subject</label>
        <Input value="RE: Order #12345" disabled />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Priority</label>
        <Select value="normal" disabled style={{ width: 200 }}>
          <Select.Option value="low">Low</Select.Option>
          <Select.Option value="normal">Normal</Select.Option>
          <Select.Option value="high">High</Select.Option>
        </Select>
      </div>

      {/* Customer reply (read-only for this task) */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="customer-reply" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Customer reply
        </label>
        <Mentions
          id="customer-reply"
          placeholder="Type @ to mention teammates..."
          value={customerValue}
          rows={2}
          data-testid="customer-reply-mentions"
          aria-describedby="customer-reply-label"
          style={{ width: '100%' }}
          disabled
        >
          {USERS.map(user => (
            <Mentions.Option key={user.id} value={user.label}>
              {user.label}
            </Mentions.Option>
          ))}
        </Mentions>
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          Detected mentions: {customerMentions.length > 0 ? customerMentions.map(m => m.label).join(', ') : '(none)'}
        </Text>
      </div>

      {/* Internal note (target) */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="internal-note" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Internal note
        </label>
        <Text type="secondary" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>
          Fill with: &quot;Looping in @Ava Chen and @Liam Ortiz.&quot;
        </Text>
        <Mentions
          id="internal-note"
          placeholder="Type @ to mention teammates..."
          value={internalValue}
          onChange={setInternalValue}
          rows={2}
          data-testid="internal-note-mentions"
          aria-describedby="internal-note-label"
          style={{ width: '100%' }}
        >
          {USERS.map(user => (
            <Mentions.Option key={user.id} value={user.label}>
              {user.label}
            </Mentions.Option>
          ))}
        </Mentions>
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          Detected mentions: {internalMentions.length > 0 ? internalMentions.map(m => m.label).join(', ') : '(none)'}
        </Text>
      </div>

      <Space>
        <Button type="primary" disabled style={{ opacity: 0.5 }}>Send</Button>
      </Space>
    </Card>
  );
}
