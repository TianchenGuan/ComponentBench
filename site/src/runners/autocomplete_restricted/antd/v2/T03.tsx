'use client';

/**
 * autocomplete_restricted-antd-v2-T03
 *
 * Modal with a searchable time zone Select. Confusable options near the target.
 * Success: Time zone = "UTC+05:30 — Kolkata" committed, Save profile clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Select, Typography, Space, Input, Divider } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const tzOptions = [
  'UTC-12:00 — Baker Island',
  'UTC-11:00 — Pago Pago',
  'UTC-10:00 — Honolulu',
  'UTC-09:30 — Marquesas Islands',
  'UTC-09:00 — Anchorage',
  'UTC-08:00 — Los Angeles',
  'UTC-07:00 — Denver',
  'UTC-06:00 — Chicago',
  'UTC-05:00 — New York',
  'UTC-04:00 — Santiago',
  'UTC-03:30 — St. John\'s',
  'UTC-03:00 — São Paulo',
  'UTC-02:00 — South Georgia',
  'UTC-01:00 — Azores',
  'UTC+00:00 — UTC',
  'UTC+00:00 — Reykjavik',
  'UTC+01:00 — London (BST)',
  'UTC+01:00 — Lagos',
  'UTC+02:00 — Berlin',
  'UTC+02:00 — Cairo',
  'UTC+02:00 — Johannesburg',
  'UTC+03:00 — Moscow',
  'UTC+03:00 — Nairobi',
  'UTC+03:30 — Tehran',
  'UTC+04:00 — Dubai',
  'UTC+04:00 — Baku',
  'UTC+04:30 — Kabul',
  'UTC+05:00 — Karachi',
  'UTC+05:00 — Tashkent',
  'UTC+05:30 — Kolkata',
  'UTC+05:30 — Colombo',
  'UTC+05:45 — Kathmandu',
  'UTC+06:00 — Dhaka',
  'UTC+06:00 — Almaty',
  'UTC+06:30 — Yangon',
  'UTC+07:00 — Bangkok',
  'UTC+07:00 — Jakarta',
  'UTC+08:00 — Singapore',
  'UTC+08:00 — Shanghai',
  'UTC+08:00 — Perth',
  'UTC+08:45 — Eucla',
  'UTC+09:00 — Tokyo',
  'UTC+09:00 — Seoul',
  'UTC+09:30 — Adelaide',
  'UTC+10:00 — Sydney',
  'UTC+10:00 — Guam',
  'UTC+10:30 — Lord Howe Island',
  'UTC+11:00 — Noumea',
  'UTC+12:00 — Auckland',
  'UTC+12:45 — Chatham Islands',
  'UTC+13:00 — Apia',
  'UTC+14:00 — Kiritimati',
].map((tz) => ({ label: tz, value: tz }));

export default function T03({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [timezone, setTimezone] = useState<string>('UTC+00:00 — UTC');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && timezone === 'UTC+05:30 — Kolkata') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, timezone, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
      <Space direction="vertical" align="center" size="middle">
        <Text>Your current time zone: <Text strong>{timezone}</Text></Text>
        <Button type="primary" onClick={() => { setModalOpen(true); setSaved(false); }}>Edit profile</Button>
      </Space>

      <Modal
        title="Edit profile"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save profile</Button>
          </Space>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Input placeholder="Display name" defaultValue="Jane Doe" />
          <Divider style={{ margin: '8px 0' }} />
          <Text strong>Time zone</Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Select time zone"
            value={timezone}
            onChange={(v) => { setTimezone(v); setSaved(false); }}
            showSearch
            optionFilterProp="label"
            options={tzOptions}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Used for scheduling and notification delivery windows.
          </Text>
        </Space>
      </Modal>
    </div>
  );
}
