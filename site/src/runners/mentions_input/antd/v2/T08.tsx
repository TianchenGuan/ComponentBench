'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mentions, Card, Button, Typography, Space, Tag, Switch, Segmented } from 'antd';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, normalizeWhitespace } from '../../types';

const { Text } = Typography;

const USERS = [
  { id: 'noah', label: 'Noah Patel' },
  { id: 'maya', label: 'Maya Rivera' },
  { id: 'liam', label: 'Liam Ortiz' },
  { id: 'olivia', label: 'Olivia Kim' },
  { id: 'sophia', label: 'Sophia Nguyen' },
  { id: 'priya', label: 'Priya Singh' },
  { id: 'carlos', label: 'Carlos Reyes' },
  { id: 'ava', label: 'Ava Chen' },
  { id: 'daniel', label: 'Daniel Park' },
  { id: 'ethan', label: 'Ethan Brooks' },
  { id: 'jun', label: 'Jun Ito' },
  { id: 'isabella', label: 'Isabella Garcia' },
];

const INITIAL_PUBLIC = '(none)';
const INITIAL_INTERNAL = '(none)';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [publicValue, setPublicValue] = useState(INITIAL_PUBLIC);
  const publicMentions = deriveMentionsFromText(publicValue, USERS);
  const [internalValue, setInternalValue] = useState(INITIAL_INTERNAL);
  const internalMentions = deriveMentionsFromText(internalValue, USERS);
  const [escalationValue, setEscalationValue] = useState('');
  const escalationMentions = deriveMentionsFromText(escalationValue, USERS);
  const [saved, setSaved] = useState(false);
  const [autoRoute, setAutoRoute] = useState(false);
  const [priority, setPriority] = useState<string | number>('Medium');
  const hasSucceeded = useRef(false);

  const handleApply = () => setSaved(true);

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;
    const normalizedEsc = normalizeWhitespace(escalationValue);
    const target = 'Escalating to @Ava Chen, @Ethan Brooks, and @Isabella Garcia.';
    const publicUnchanged = normalizeWhitespace(publicValue) === normalizeWhitespace(INITIAL_PUBLIC);
    const internalUnchanged = normalizeWhitespace(internalValue) === normalizeWhitespace(INITIAL_INTERNAL);

    if (
      normalizedEsc === target &&
      escalationMentions.length === 3 &&
      escalationMentions[0].id === 'ava' &&
      escalationMentions[1].id === 'ethan' &&
      escalationMentions[2].id === 'isabella' &&
      publicUnchanged &&
      internalUnchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, escalationValue, publicValue, internalValue, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <Card title="Routing Settings" size="small" style={{ width: 420 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text>Auto-route</Text>
          <Switch size="small" checked={autoRoute} onChange={setAutoRoute} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <Text style={{ marginRight: 8 }}>Priority</Text>
          <Segmented options={['Low', 'Medium', 'High']} value={priority} onChange={setPriority} size="small" />
        </div>

        <div style={{ marginBottom: 8 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            Suggested escalation contacts:
          </Text>
          <Space size={4}>
            <Tag color="blue">Ava Chen</Tag>
            <Tag color="green">Ethan Brooks</Tag>
            <Tag color="purple">Isabella Garcia</Tag>
          </Space>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>Public update</Text>
          <Mentions
            value={publicValue}
            onChange={setPublicValue}
            autoSize={{ minRows: 1, maxRows: 2 }}
            style={{ width: '100%' }}
          >
            {USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 2, display: 'block' }}>
            Mentions: {publicMentions.length > 0 ? publicMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>Internal update</Text>
          <Mentions
            value={internalValue}
            onChange={setInternalValue}
            autoSize={{ minRows: 1, maxRows: 2 }}
            style={{ width: '100%' }}
          >
            {USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 2, display: 'block' }}>
            Mentions: {internalMentions.length > 0 ? internalMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>Escalation note</Text>
          <Mentions
            placeholder="Type @ to mention..."
            value={escalationValue}
            onChange={setEscalationValue}
            rows={2}
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

        <Button type="primary" onClick={handleApply}>Apply routing</Button>
      </Card>
    </div>
  );
}
