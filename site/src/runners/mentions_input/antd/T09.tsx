'use client';

/**
 * mentions_input-antd-T09: Dashboard note: insert mention in the middle
 *
 * You are on a lightweight dashboard page with multiple cards (medium clutter).
 *
 * Cards on the dashboard:
 * - "KPI Summary" card (static numbers)
 * - "Recent activity" list (static)
 * - "Task note" card (this contains the target component)
 * - A couple of icon buttons in the header (non-functional distractors)
 *
 * Target component:
 * - In the "Task note" card, there is a single Ant Design Mentions input labeled Note.
 * - The Mentions input supports @mentions with a dropdown list: Noah Patel, Ava Chen, Priya Singh, Liam Ortiz.
 * - Initial state: the Note field already contains the sentence with a deliberate gap:
 *   "Please ask  to review this."
 *   (There are two spaces between "ask" and "to".)
 * - No dropdown is open initially. Detected mentions is empty.
 *
 * Goal requires inserting the mention into the gap, not appending it at the end.
 *
 * Success: The Note Mentions input must equal exactly: "Please ask @Noah Patel to review this." (whitespace-normalized).
 *          Detected mentions must be exactly: [Noah Patel].
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Mentions, Typography, Button, List, Statistic, Row, Col } from 'antd';
import { SettingOutlined, BellOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import { normalizeWhitespace, deriveMentionsFromText } from '../types';

const { Text, Title } = Typography;

const USERS = [
  { id: 'noah', label: 'Noah Patel' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'liam', label: 'Liam Ortiz' },
];

const ACTIVITIES = [
  'Task #234 completed',
  'New comment on PR #89',
  'Build #456 passed',
  'Deployment to staging',
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Please ask  to review this.');
  const hasSucceeded = useRef(false);

  const mentions = deriveMentionsFromText(value, USERS);

  useEffect(() => {
    const normalizedText = normalizeWhitespace(value);
    const targetText = 'Please ask @Noah Patel to review this.';
    
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
    <div style={{ width: 800 }}>
      {/* Dashboard header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
        <div>
          <Button type="text" icon={<BellOutlined />} disabled />
          <Button type="text" icon={<SettingOutlined />} disabled />
        </div>
      </div>

      <Row gutter={16}>
        {/* KPI Summary card */}
        <Col span={8}>
          <Card title="KPI Summary" size="small">
            <Statistic title="Active Users" value={1234} />
            <Statistic title="Completion Rate" value={87} suffix="%" style={{ marginTop: 8 }} />
          </Card>
        </Col>

        {/* Recent activity card */}
        <Col span={8}>
          <Card title="Recent activity" size="small">
            <List
              size="small"
              dataSource={ACTIVITIES}
              renderItem={item => (
                <List.Item style={{ padding: '4px 0', fontSize: 12 }}>{item}</List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Task note card (target) */}
        <Col span={8}>
          <Card title="Task note" size="small">
            <label htmlFor="note" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 13 }}>
              Note
            </label>
            <Text type="secondary" style={{ fontSize: 11, marginBottom: 4, display: 'block' }}>
              Fix the gap by mentioning Noah Patel.
            </Text>
            <Mentions
              id="note"
              placeholder="Type @ to mention..."
              value={value}
              onChange={setValue}
              rows={2}
              data-testid="note-mentions"
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
          </Card>
        </Col>
      </Row>
    </div>
  );
}
