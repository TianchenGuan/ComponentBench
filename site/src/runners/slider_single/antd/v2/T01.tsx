'use client';

/**
 * slider_single-antd-v2-T01: Drawer alert tuning — Secondary 4, Primary unchanged, Apply
 *
 * Notifications dashboard; "Notification tuning" opens a Drawer with two 1–5 sliders
 * (Primary=2, Secondary=1) and Cancel / Apply changes. Draft until Apply.
 *
 * Success (committed): Secondary alert level === 4, Primary alert level === 2, after Apply.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Drawer, Slider, Space, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draftPrimary, setDraftPrimary] = useState(2);
  const [draftSecondary, setDraftSecondary] = useState(1);
  const [committedPrimary, setCommittedPrimary] = useState(2);
  const [committedSecondary, setCommittedSecondary] = useState(1);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committedPrimary === 2 && committedSecondary === 4) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedPrimary, committedSecondary, onSuccess]);

  const apply = () => {
    setCommittedPrimary(draftPrimary);
    setCommittedSecondary(draftSecondary);
  };

  return (
    <div style={{ padding: 12, maxWidth: 720 }}>
      <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
        <Tag color="green">Live</Tag>
        <Tag>Queue healthy</Tag>
        <Tag color="blue">3 channels</Tag>
      </Space>
      <Title level={5} style={{ marginTop: 0 }}>
        Notifications
      </Title>
      <Card size="small" style={{ marginBottom: 12 }} title="Today">
        <Text type="secondary">12 deliveries · 2 snoozed · 0 failures</Text>
      </Card>
      <Card size="small" title="Recent activity" style={{ marginBottom: 16 }}>
        <ul style={{ margin: 0, paddingLeft: 18, color: '#666', fontSize: 13 }}>
          <li>Billing alert acknowledged</li>
          <li>Digest sent to ops@</li>
          <li>Webhook retry scheduled</li>
        </ul>
      </Card>
      <Button type="primary" onClick={() => setOpen(true)}>
        Notification tuning
      </Button>

      <Drawer
        title="Notification tuning"
        placement="right"
        width={400}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => {
                apply();
              }}
            >
              Apply changes
            </Button>
          </div>
        }
      >
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Primary alert level
          </Text>
          <Slider
            min={1}
            max={5}
            step={1}
            value={draftPrimary}
            onChange={setDraftPrimary}
            marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }}
            data-testid="slider-primary-alert"
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Committed: {committedPrimary}
          </Text>
        </div>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Secondary alert level
          </Text>
          <Slider
            min={1}
            max={5}
            step={1}
            value={draftSecondary}
            onChange={setDraftSecondary}
            marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }}
            data-testid="slider-secondary-alert"
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Committed: {committedSecondary}
          </Text>
        </div>
      </Drawer>
    </div>
  );
}
