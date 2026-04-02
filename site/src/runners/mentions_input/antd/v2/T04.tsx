'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mentions, Card, Button, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const { Text } = Typography;

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'noah', label: 'Noah Patel' },
];

const INITIAL_AUDIT = 'Keep an internal copy.';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [messageValue, setMessageValue] = useState('');
  const messageMentions = deriveMentionsFromText(messageValue, USERS);
  const [auditValue, setAuditValue] = useState(INITIAL_AUDIT);
  const auditMentions = deriveMentionsFromText(auditValue, USERS);
  const [saved, setSaved] = useState(false);
  const hasSucceeded = useRef(false);

  const handleApply = () => setSaved(true);

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;
    const normalizedMsg = normalizeWhitespace(messageValue);
    const target = 'Assign to @Emma Johnson; CC @Noah Patel.';
    const auditUnchanged = normalizeWhitespace(auditValue) === normalizeWhitespace(INITIAL_AUDIT);

    if (
      normalizedMsg === target &&
      messageMentions.length === 2 &&
      messageMentions[0].id === 'emma' &&
      messageMentions[1].id === 'noah' &&
      auditUnchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, messageValue, auditValue, onSuccess]);

  const darkBg = '#141414';
  const cardBg = '#1f1f1f';
  const borderClr = '#303030';

  return (
    <div style={{ background: darkBg, minHeight: '100vh', padding: 40, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 80 }}>
      <Card
        title="Settings"
        style={{ width: 480, background: cardBg, borderColor: borderClr, marginLeft: 60 }}
        styles={{
          header: { color: '#fff', borderBottomColor: borderClr, background: cardBg },
          body: { background: cardBg, padding: '16px 20px' },
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: 500, display: 'block', marginBottom: 8, color: '#d9d9d9' }}>
            Reference preview
          </Text>
          <div
            style={{
              background: '#2a2a2a',
              borderRadius: 8,
              padding: 12,
              color: '#e0e0e0',
              fontSize: 14,
              lineHeight: 1.6,
              border: `1px solid ${borderClr}`,
            }}
          >
            Assign to{' '}
            <span style={{ background: '#3a3a3a', borderRadius: 4, padding: '1px 6px', color: '#69b1ff' }}>
              @Emma Johnson
            </span>
            ; CC{' '}
            <span style={{ background: '#3a3a3a', borderRadius: 4, padding: '1px 6px', color: '#69b1ff' }}>
              @Noah Patel
            </span>
            .
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 4, color: '#d9d9d9' }}>Message</Text>
          <Mentions
            placeholder="Type @ to mention..."
            value={messageValue}
            onChange={setMessageValue}
            rows={2}
            style={{ width: '100%' }}
          >
            {USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text style={{ fontSize: 11, marginTop: 4, display: 'block', color: '#666' }}>
            Detected mentions: {messageMentions.length > 0 ? messageMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 4, color: '#d9d9d9' }}>Audit note</Text>
          <Mentions
            value={auditValue}
            onChange={setAuditValue}
            rows={2}
            style={{ width: '100%' }}
          >
            {USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text style={{ fontSize: 11, marginTop: 4, display: 'block', color: '#666' }}>
            Detected mentions: {auditMentions.length > 0 ? auditMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>

        <Space>
          <Button type="primary" onClick={handleApply}>Apply message</Button>
        </Space>
      </Card>
    </div>
  );
}
