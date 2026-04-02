'use client';

/**
 * autocomplete_restricted-antd-T07: Select time zone inside a modal
 *
 * setup_description:
 * The page shows a small profile summary card with a primary button **Edit profile**.
 *
 * Clicking **Edit profile** opens an Ant Design **Modal** (dialog) centered on the page (modal_flow layout).
 * Inside the modal is one target component: an Ant Design Select labeled **Time zone**.
 * - Theme: light; spacing: comfortable; size: default.
 * - Initial state: Time zone is set to "UTC+00:00 (London)".
 * - The dropdown list contains common time zones with UTC offsets, including:
 *   - UTC−08:00 (Los Angeles)
 *   - UTC−05:00 (New York)  ← target
 *   - UTC+00:00 (London)
 *   - UTC+01:00 (Berlin)
 *   - UTC+09:00 (Tokyo)
 * - The select is restricted to these options; selecting an item updates the field immediately.
 *
 * The modal also contains Cancel/Close controls, but they are not required for success. Success depends only on the Time zone Select value.
 *
 * Success: The "Time zone" Select has selected value "UTC−05:00 (New York)".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Select, Typography, Button, Modal, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const timezones = [
  { label: 'UTC−08:00 (Los Angeles)', value: 'UTC−08:00 (Los Angeles)' },
  { label: 'UTC−05:00 (New York)', value: 'UTC−05:00 (New York)' },
  { label: 'UTC+00:00 (London)', value: 'UTC+00:00 (London)' },
  { label: 'UTC+01:00 (Berlin)', value: 'UTC+01:00 (Berlin)' },
  { label: 'UTC+09:00 (Tokyo)', value: 'UTC+09:00 (Tokyo)' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timezone, setTimezone] = useState<string>('UTC+00:00 (London)');
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && timezone === 'UTC−05:00 (New York)') {
      successFired.current = true;
      onSuccess();
    }
  }, [timezone, onSuccess]);

  return (
    <>
      <Card style={{ width: 350 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Profile Summary</Text>
          <Text type="secondary">Name: Alex Johnson</Text>
          <Text type="secondary">Email: alex@example.com</Text>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Edit profile
          </Button>
        </Space>
      </Card>

      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Time zone</Text>
            <Select
              data-testid="timezone-select"
              style={{ width: '100%' }}
              value={timezone}
              onChange={(newValue) => setTimezone(newValue)}
              options={timezones}
            />
          </div>
        </Space>
      </Modal>
    </>
  );
}
