'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mentions, Card, Button, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const { Text, Title } = Typography;

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'carlos', label: 'Carlos Reyes' },
];

const INITIAL_SUMMARY = 'Blockers tracked separately.';
const INITIAL_ESCALATION = `Release blocker summary:
- API migration incomplete
- Customer comms drafted
Escalation window: 17:00 UTC
Owners still pending review.
Escalation owner: 
Next checkpoint: 18:30 UTC`;
const INITIAL_ROLLBACK = 'Rollback owner confirmed.';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [summaryValue, setSummaryValue] = useState(INITIAL_SUMMARY);
  const summaryMentions = deriveMentionsFromText(summaryValue, USERS);
  const [escalationValue, setEscalationValue] = useState(INITIAL_ESCALATION);
  const escalationMentions = deriveMentionsFromText(escalationValue, USERS);
  const [rollbackValue, setRollbackValue] = useState(INITIAL_ROLLBACK);
  const rollbackMentions = deriveMentionsFromText(rollbackValue, USERS);
  const [saved, setSaved] = useState(false);
  const hasSucceeded = useRef(false);

  const handleApply = () => setSaved(true);

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;

    const normalizedEsc = normalizeWhitespace(escalationValue);
    const targetEsc = normalizeWhitespace(
      `Release blocker summary:
- API migration incomplete
- Customer comms drafted
Escalation window: 17:00 UTC
Owners still pending review.
Escalation owner: @Carlos Reyes
Next checkpoint: 18:30 UTC`
    );

    const summaryUnchanged = normalizeWhitespace(summaryValue) === normalizeWhitespace(INITIAL_SUMMARY);
    const rollbackUnchanged = normalizeWhitespace(rollbackValue) === normalizeWhitespace(INITIAL_ROLLBACK);

    if (
      normalizedEsc === targetEsc &&
      escalationMentions.length === 1 &&
      escalationMentions[0].id === 'carlos' &&
      summaryUnchanged &&
      rollbackUnchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, escalationValue, summaryValue, rollbackValue, onSuccess]);

  const scrollFieldStyle: React.CSSProperties = {
    maxHeight: 160,
    overflowY: 'auto',
    marginBottom: 16,
    padding: 8,
    border: '1px solid #d9d9d9',
    borderRadius: 6,
  };

  return (
    <div style={{ padding: 24, maxHeight: '100vh', overflow: 'auto' }}>
      <Title level={4} style={{ marginBottom: 12 }}>Blocker Panel</Title>

      <Card size="small" style={{ maxWidth: 520 }}>
        <div style={scrollFieldStyle}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Summary</Text>
          <Mentions
            value={summaryValue}
            onChange={setSummaryValue}
            autoSize={{ minRows: 1, maxRows: 2 }}
            style={{ width: '100%' }}
          >
            {USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 2, display: 'block' }}>
            Mentions: {summaryMentions.length > 0 ? summaryMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>

        <div style={scrollFieldStyle}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Escalation owner</Text>
          <Mentions
            value={escalationValue}
            onChange={setEscalationValue}
            autoSize={{ minRows: 4, maxRows: 6 }}
            style={{ width: '100%' }}
          >
            {USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 2, display: 'block' }}>
            Mentions: {escalationMentions.length > 0 ? escalationMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>

        <div style={scrollFieldStyle}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Rollback note</Text>
          <Mentions
            value={rollbackValue}
            onChange={setRollbackValue}
            autoSize={{ minRows: 1, maxRows: 2 }}
            style={{ width: '100%' }}
          >
            {USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 2, display: 'block' }}>
            Mentions: {rollbackMentions.length > 0 ? rollbackMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>

        <Space>
          <Button type="primary" onClick={handleApply}>Apply blockers</Button>
        </Space>
      </Card>
    </div>
  );
}
