'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mentions, Card, Drawer, Button, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../../types';
import { deriveMentionsFromText, EXTENDED_USERS, normalizeWhitespace } from '../../types';

const { Text } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [recipientValue, setRecipientValue] = useState('');
  const recipientMentions = deriveMentionsFromText(recipientValue, EXTENDED_USERS);
  const [saved, setSaved] = useState(false);
  const hasSucceeded = useRef(false);

  const handleSave = () => {
    setSaved(true);
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;
    const normalized = normalizeWhitespace(recipientValue);
    const target = '@Zoë Zimmerman';

    if (
      normalized === target &&
      recipientMentions.length === 1 &&
      recipientMentions[0].id === 'zoe'
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, recipientValue, onSuccess]);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '100vh', padding: 24 }}>
      <Card
        title="Compose"
        size="small"
        style={{ width: 340 }}
      >
        <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>
          Draft a quick message or set a recipient.
        </Text>
        <Button type="primary" onClick={() => setDrawerOpen(true)}>
          Edit recipient
        </Button>
      </Card>

      <Drawer
        title="Set recipient"
        placement="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        height={260}
        styles={{ wrapper: { maxWidth: 380, marginLeft: 'auto' } }}
        footer={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save recipient</Button>
          </Space>
        }
      >
        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Quick recipient</Text>
          <Mentions
            placeholder="Type @ to search..."
            value={recipientValue}
            onChange={setRecipientValue}
            autoSize={{ minRows: 1, maxRows: 2 }}
            placement="top"
            style={{ width: '100%' }}
          >
            {EXTENDED_USERS.map(u => (
              <Mentions.Option key={u.id} value={u.label}>{u.label}</Mentions.Option>
            ))}
          </Mentions>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
            Detected mentions: {recipientMentions.length > 0 ? recipientMentions.map(m => m.label).join(', ') : '(none)'}
          </Text>
        </div>
      </Drawer>
    </div>
  );
}
