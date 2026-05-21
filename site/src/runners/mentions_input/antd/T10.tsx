'use client';

/**
 * mentions_input-antd-T10: Settings panel: escalation note with three mentions
 *
 * You are on a "Notification routing" settings panel anchored near the top-left of the viewport (low clutter).
 *
 * Panel contents (distractors):
 * - A couple of toggles (Email alerts, Slack alerts)
 * - A read-only "Team" select showing "Support"
 * - A non-functional "Save settings" button
 *
 * Target components (E6=3):
 * There are three Ant Design Mentions inputs, each with its own label and helper text:
 * 1) Public update
 * 2) Internal update
 * 3) Escalation note  ← target instance
 *
 * Mentions behavior:
 * - All three support @mentions with a dropdown list (about 12 people): Ava Chen, Ethan Brooks, Isabella Garcia, Noah Patel, Maya Rivera, Liam Ortiz, Olivia Kim, Sophia Nguyen, Priya Singh, Daniel Park, Carlos Reyes, Jun Ito.
 * - Selecting an option inserts "@Full Name" into the textarea and updates "Detected mentions".
 *
 * Guidance (mixed):
 * - Above the inputs, a small "Target mentions" strip shows three visual chips: "Ava Chen", "Ethan Brooks", "Isabella Garcia".
 * - The exact sentence to enter is also written in the instruction text.
 *
 * Initial state:
 * - Public update contains "(none)"
 * - Internal update contains "(none)"
 * - Escalation note is empty.
 *
 * Success: Only the Escalation note Mentions input must be changed.
 *          Escalation note text must equal exactly: "Escalating to @Ava Chen, @Ethan Brooks, and @Isabella Garcia." (whitespace-normalized).
 *          Escalation note detected mentions must be exactly: [Ava Chen, Ethan Brooks, Isabella Garcia] in that order.
 *          Public update and Internal update must remain unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Mentions, Typography, Switch, Select, Button, Space, Tag } from 'antd';
import type { TaskComponentProps, Mention } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const { Text, Title } = Typography;

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'isabella', label: 'Isabella Garcia' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'daniel', label: 'Daniel Park' },
  { id: 'carlos', label: 'Carlos Reyes' },
  { id: 'jun', label: 'Jun Ito' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  // Public and Internal update (should not change)
  const [publicValue] = useState('(none)');
  const [publicMentions] = useState<Mention[]>([]);
  const [internalValue] = useState('(none)');
  const [internalMentions] = useState<Mention[]>([]);
  
  // Escalation note (target)
  const [escalationValue, setEscalationValue] = useState('');
  const hasSucceeded = useRef(false);

  const escalationMentions = deriveMentionsFromText(escalationValue, USERS);

  useEffect(() => {
    const normalizedText = normalizeWhitespace(escalationValue);
    const targetText = 'Escalating to @Ava Chen, @Ethan Brooks, and @Isabella Garcia.';
    
    if (
      normalizedText === targetText &&
      escalationMentions.length === 3 &&
      escalationMentions[0].id === 'ava' &&
      escalationMentions[1].id === 'ethan' &&
      escalationMentions[2].id === 'isabella' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [escalationValue, onSuccess]);

  const renderMentionsField = (
    id: string,
    label: string,
    value: string,
    mentions: Mention[],
    disabled: boolean,
    onChange?: (val: string) => void,
    onSelect?: (option: { value?: string; label?: string }) => void
  ) => (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
        {label}
      </label>
      <Mentions
        id={id}
        placeholder="Type @ to mention..."
        value={value}
        onChange={onChange}
        onSelect={onSelect}
        rows={2}
        data-testid={`mentions-${id}`}
        style={{ width: '100%' }}
        disabled={disabled}
      >
        {USERS.map(user => (
          <Mentions.Option key={user.id} value={user.label}>
            {user.label}
          </Mentions.Option>
        ))}
      </Mentions>
      <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
        Detected mentions: {mentions.length > 0 ? mentions.map(m => m.label).join(', ') : '(none)'}
      </Text>
    </div>
  );

  return (
    <Card title="Notification routing" style={{ width: 500 }}>
      {/* Distractor controls */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 24 }}>
        <div>
          <Text style={{ marginRight: 8 }}>Email alerts</Text>
          <Switch defaultChecked disabled />
        </div>
        <div>
          <Text style={{ marginRight: 8 }}>Slack alerts</Text>
          <Switch disabled />
        </div>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Team</label>
        <Select value="support" disabled style={{ width: 200 }}>
          <Select.Option value="support">Support</Select.Option>
          <Select.Option value="engineering">Engineering</Select.Option>
        </Select>
      </div>

      {/* Target mentions guide */}
      <div style={{ marginBottom: 16, padding: 12, background: '#f6f6f6', borderRadius: 8 }}>
        <Text style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Target mentions:</Text>
        <Space>
          <Tag color="blue">Ava Chen</Tag>
          <Tag color="blue">Ethan Brooks</Tag>
          <Tag color="blue">Isabella Garcia</Tag>
        </Space>
      </div>

      {/* Mentions fields */}
      {renderMentionsField('public', 'Public update', publicValue, publicMentions, true)}
      {renderMentionsField('internal', 'Internal update', internalValue, internalMentions, true)}
      {renderMentionsField('escalation', 'Escalation note', escalationValue, escalationMentions, false, setEscalationValue)}

      <Button type="primary" disabled style={{ opacity: 0.5 }}>Save settings</Button>
    </Card>
  );
}
