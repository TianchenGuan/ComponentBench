'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mentions, Card, Button, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const { Text } = Typography;

const USERS = [
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'ethan', label: 'Ethan Brooks' },
];

const INITIAL_REVIEW = 'Reviewed by @Maya Rivera — ping if blocked.';
const INITIAL_BACKUP = 'No backup assigned.';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [reviewValue, setReviewValue] = useState(INITIAL_REVIEW);
  const reviewMentions = deriveMentionsFromText(reviewValue, USERS);
  const [backupValue, setBackupValue] = useState(INITIAL_BACKUP);
  const backupMentions = deriveMentionsFromText(backupValue, USERS);
  const [saved, setSaved] = useState(false);
  const hasSucceeded = useRef(false);

  const handleSave = () => setSaved(true);

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;
    const normalizedReview = normalizeWhitespace(reviewValue);
    const target = 'Reviewed by @Emma Johnson — ping @Ethan Brooks if blocked.';
    const backupUnchanged = normalizeWhitespace(backupValue) === normalizeWhitespace(INITIAL_BACKUP);

    if (
      normalizedReview === target &&
      reviewMentions.length === 2 &&
      reviewMentions.some(m => m.id === 'emma') &&
      reviewMentions.some(m => m.id === 'ethan') &&
      backupUnchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, reviewValue, backupValue, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Card title="Review Panel" style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: 20 }}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Review note</Text>
          <Mentions
            value={reviewValue}
            onChange={setReviewValue}
            rows={3}
            style={{ width: '100%' }}
          >
            {USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
            Detected mentions: {reviewMentions.length > 0 ? reviewMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Backup note</Text>
          <Mentions
            value={backupValue}
            onChange={setBackupValue}
            rows={2}
            style={{ width: '100%' }}
          >
            {USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
            Detected mentions: {backupMentions.length > 0 ? backupMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>

        <Space>
          <Button type="primary" onClick={handleSave}>Save review</Button>
        </Space>
      </Card>
    </div>
  );
}
