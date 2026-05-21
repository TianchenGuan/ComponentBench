'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mentions, Card, Drawer, Button, Typography, Space, Timeline, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const { Text, Title } = Typography;

const USERS = [
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'noah', label: 'Noah Patel' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'emma', label: 'Emma Johnson' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'carlos', label: 'Carlos Reyes' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'isabella', label: 'Isabella Garcia' },
  { id: 'jun', label: 'Jun Ito' },
];

const INITIAL_REPLY = 'We are investigating the incident.';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [replyValue, setReplyValue] = useState(INITIAL_REPLY);
  const replyMentions = deriveMentionsFromText(replyValue, USERS);
  const [noteValue, setNoteValue] = useState('');
  const noteMentions = deriveMentionsFromText(noteValue, USERS);
  const [saved, setSaved] = useState(false);
  const hasSucceeded = useRef(false);

  const handleApply = () => {
    setSaved(true);
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;
    const normalizedNote = normalizeWhitespace(noteValue);
    const target = 'Escalate to @Ava Chen and @Ethan Brooks before 5 PM.';
    const replyUnchanged = normalizeWhitespace(replyValue) === normalizeWhitespace(INITIAL_REPLY);

    if (
      normalizedNote === target &&
      noteMentions.length === 2 &&
      noteMentions[0].id === 'ava' &&
      noteMentions[1].id === 'ethan' &&
      replyUnchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, noteValue, replyValue, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Card title="Support Dashboard — Ticket #4821" style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0 }}>Ticket Summary</Title>
          <Text type="secondary">Customer reported API timeout on /v2/checkout endpoint. Priority: High.</Text>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Status Timeline</Text>
          <Timeline
            style={{ marginTop: 8 }}
            items={[
              { color: 'green', children: 'Ticket created — Mar 18, 10:32 AM' },
              { color: 'blue', children: 'Assigned to Tier 2 — Mar 18, 11:05 AM' },
              { color: 'gray', children: 'Awaiting internal review' },
            ]}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Tag color="red">High Priority</Tag>
          <Tag color="blue">Tier 2</Tag>
          <Tag>Checkout</Tag>
        </div>

        <Button type="primary" onClick={() => setDrawerOpen(true)}>
          Edit routing note
        </Button>
      </Card>

      <Drawer
        title="Edit routing note"
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={420}
        footer={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleApply}>Apply note</Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 20 }}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Customer reply</Text>
          <Mentions
            value={replyValue}
            onChange={setReplyValue}
            rows={3}
            style={{ width: '100%' }}
          >
            {USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
            Detected mentions: {replyMentions.length > 0 ? replyMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Internal note</Text>
          <Mentions
            placeholder="Type @ to mention a teammate"
            value={noteValue}
            onChange={setNoteValue}
            rows={3}
            style={{ width: '100%' }}
          >
            {USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
            Detected mentions: {noteMentions.length > 0 ? noteMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>
      </Drawer>
    </div>
  );
}
