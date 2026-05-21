'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mentions, Card, Button, Typography, Space, Statistic, List } from 'antd';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const { Text, Title } = Typography;

const USERS = [
  { id: 'ava', label: 'Ava Chen' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
];

const INITIAL_NOTE = 'Please ask  to review the rollback.';
const INITIAL_FOLLOWUP = 'Ping support after deploy.';

const KPI_DATA = [
  { title: 'Deploys', value: 14 },
  { title: 'Incidents', value: 3 },
  { title: 'Uptime', value: '99.7%' },
  { title: 'Open PRs', value: 8 },
];

const ACTIVITY_FEED = [
  'Deploy v2.4.1 completed — 2 min ago',
  'Incident #301 resolved — 18 min ago',
  'PR #892 merged by Ava Chen — 45 min ago',
  'Rollback v2.3.9 triggered — 1 hr ago',
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [noteValue, setNoteValue] = useState(INITIAL_NOTE);
  const noteMentions = deriveMentionsFromText(noteValue, USERS);
  const [followupValue, setFollowupValue] = useState(INITIAL_FOLLOWUP);
  const followupMentions = deriveMentionsFromText(followupValue, USERS);
  const [saved, setSaved] = useState(false);
  const hasSucceeded = useRef(false);

  const handleSave = () => setSaved(true);

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;
    const normalizedNote = normalizeWhitespace(noteValue);
    const target = 'Please ask @Noah Patel to review the rollback.';
    const followupUnchanged = normalizeWhitespace(followupValue) === normalizeWhitespace(INITIAL_FOLLOWUP);

    if (
      normalizedNote === target &&
      noteMentions.length === 1 &&
      noteMentions[0].id === 'noah' &&
      followupUnchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, noteValue, followupValue, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 16 }}>Operations Dashboard</Title>

      <Space wrap style={{ marginBottom: 20 }}>
        {KPI_DATA.map(kpi => (
          <Card key={kpi.title} size="small" style={{ minWidth: 120, textAlign: 'center' }}>
            <Statistic title={kpi.title} value={kpi.value} />
          </Card>
        ))}
      </Space>

      <div style={{ display: 'flex', gap: 16 }}>
        <Card title="Activity Feed" size="small" style={{ flex: 1 }}>
          <List
            size="small"
            dataSource={ACTIVITY_FEED}
            renderItem={item => <List.Item style={{ fontSize: 13, padding: '4px 0' }}>{item}</List.Item>}
          />
        </Card>

        <Card
          title="Release blockers"
          size="small"
          style={{ width: 360 }}
          extra={<Button type="primary" size="small" onClick={handleSave}>Save blockers</Button>}
        >
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>Note</Text>
            <Mentions
              value={noteValue}
            onChange={setNoteValue}
            rows={2}
              style={{ width: '100%' }}
            >
              {USERS.map(u => (
                <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
              ))}
            </Mentions>
            <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
              Detected mentions: {noteMentions.length > 0 ? noteMentions.map(m => m.label).join(', ') : '(none)'}
            </Text>
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>Follow-up</Text>
            <Mentions
              value={followupValue}
            onChange={setFollowupValue}
            rows={2}
              style={{ width: '100%' }}
            >
              {USERS.map(u => (
                <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
              ))}
            </Mentions>
            <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
              Detected mentions: {followupMentions.length > 0 ? followupMentions.map(m => m.label).join(', ') : '(none)'}
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
