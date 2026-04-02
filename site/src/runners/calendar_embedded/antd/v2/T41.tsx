'use client';

/**
 * calendar_embedded-antd-v2-T41: Far-future release date with panel save
 */

import React, { useState, useEffect } from 'react';
import { Card, Calendar, Button, Switch, Tag, Space, Typography, Divider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const TARGET = '2035-11-23';

export default function T41({ onSuccess }: TaskComponentProps) {
  const [visible, setVisible] = useState<Dayjs>(dayjs('2026-02-01'));
  const [pending, setPending] = useState<Dayjs | null>(null);
  const [applied, setApplied] = useState<Dayjs | null>(null);
  const [autoPublish, setAutoPublish] = useState(false);
  const [betaChannel, setBetaChannel] = useState(true);

  useEffect(() => {
    if (applied && applied.format('YYYY-MM-DD') === TARGET) {
      onSuccess();
    }
  }, [applied, onSuccess]);

  const save = () => {
    setApplied(pending);
  };

  return (
    <div style={{ maxWidth: 520, padding: 8 }} data-testid="release-settings-panel">
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        Release settings
      </Typography.Title>
      <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
        <Tag color="blue">Staging</Tag>
        <Tag>Build 4921</Tag>
        <Tag color="default">QA pending</Tag>
      </Space>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <Space>
          <span style={{ fontSize: 12 }}>Auto-publish</span>
          <Switch checked={autoPublish} onChange={setAutoPublish} size="small" />
        </Space>
        <Space>
          <span style={{ fontSize: 12 }}>Beta channel</span>
          <Switch checked={betaChannel} onChange={setBetaChannel} size="small" />
        </Space>
      </div>
      <Card size="small" style={{ marginBottom: 12, background: '#fafafa' }}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Release summary: feature freeze active; target window requires PM sign-off before deploy.
        </Typography.Text>
      </Card>
      <Card
        title="Release calendar"
        size="small"
        style={{ marginBottom: 12 }}
        data-testid="release-calendar-card"
      >
        <Calendar
          fullscreen={false}
          value={pending ?? visible}
          onSelect={(d) => setPending(d)}
          onPanelChange={(d) => setVisible(d.startOf('month'))}
          data-testid="release-calendar"
        />
      </Card>
      <div style={{ fontSize: 13, marginBottom: 12 }}>
        <span style={{ fontWeight: 500 }}>Applied release date: </span>
        <span data-testid="applied-release-date">{applied ? applied.format('YYYY-MM-DD') : '—'}</span>
      </div>
      <Divider style={{ margin: '12px 0' }} />
      <Button type="primary" onClick={save} data-testid="save-panel">
        Save panel
      </Button>
    </div>
  );
}
