'use client';

/**
 * date_picker_single-antd-v2-T01: Billing date with OK among three fields
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Switch, Tag, Table, Typography, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const REMINDER_FIXED = dayjs('2026-03-07');
const ARCHIVE_FIXED = dayjs('2026-12-31');

export default function T01({ onSuccess }: TaskComponentProps) {
  const [billing, setBilling] = useState<Dayjs | null>(null);
  const [autoBill, setAutoBill] = useState(true);
  const [digest, setDigest] = useState(false);

  useEffect(() => {
    if (billing && billing.format('YYYY-MM-DD') === '2028-09-18') {
      onSuccess();
    }
  }, [billing, onSuccess]);

  const auditRows = [
    { key: '1', event: 'Cycle opened', when: '2026-02-01' },
    { key: '2', event: 'Rate check', when: '2026-02-10' },
  ];

  return (
    <div style={{ maxWidth: 520 }}>
      <Space wrap style={{ marginBottom: 12 }}>
        <Tag color="blue">Live</Tag>
        <Tag>v2</Tag>
        <Switch checked={autoBill} onChange={setAutoBill} size="small" />
        <Text type="secondary" style={{ fontSize: 12 }}>
          Auto-billing
        </Text>
        <Switch checked={digest} onChange={setDigest} size="small" />
        <Text type="secondary" style={{ fontSize: 12 }}>
          Weekly digest
        </Text>
      </Space>
      <Table
        size="small"
        pagination={false}
        dataSource={auditRows}
        columns={[
          { title: 'Event', dataIndex: 'event' },
          { title: 'When', dataIndex: 'when', width: 110 },
        ]}
        style={{ marginBottom: 16 }}
      />
      <Card size="small" title="Scheduling" styles={{ header: { fontSize: 14 } }}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="reminder-date" style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>
            Reminder date
          </label>
          <DatePicker
            id="reminder-date"
            value={REMINDER_FIXED}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
            data-testid="reminder-date"
            defaultPickerValue={dayjs('2026-02-01')}
            disabled
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="billing-date" style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>
            Billing date
          </label>
          <DatePicker
            id="billing-date"
            value={billing}
            onChange={(d) => setBilling(d)}
            format="YYYY-MM-DD"
            placeholder="Select date"
            style={{ width: '100%' }}
            data-testid="billing-date"
            needConfirm
            defaultPickerValue={dayjs('2026-02-01')}
          />
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 6 }}>
            Choose a single date
          </Text>
        </div>
        <div>
          <label htmlFor="archive-date" style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>
            Archive date
          </label>
          <DatePicker
            id="archive-date"
            value={ARCHIVE_FIXED}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
            data-testid="archive-date"
            defaultPickerValue={dayjs('2026-02-01')}
            disabled
          />
        </div>
      </Card>
    </div>
  );
}
