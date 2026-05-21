'use client';

/**
 * clipboard_copy-antd-T04: Copy Support ID from profile form
 *
 * Layout: form_section, centered.
 * The page shows a "Profile" form with several standard inputs (Name, Email, Time zone) and two buttons at the bottom ("Save" and "Cancel") that are present only as clutter.
 *
 * The clipboard_copy component appears in a read-only row labeled "Support ID".
 * - The value "SUP-13579" is displayed as Ant Design Typography.Text.
 * - A copyable icon is shown at the end of the value.
 *
 * Component behavior:
 * - Clicking the copy icon writes "SUP-13579" to the clipboard and shows a brief "Copied" tooltip.
 * - Save/Cancel buttons do nothing relevant to the task.
 *
 * Initial state: nothing copied yet; no tooltips visible.
 *
 * Success: Clipboard text equals "SUP-13579".
 */

import React, { useState } from 'react';
import { Card, Typography, Space, Form, Input, Select, Button } from 'antd';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const { Text } = Typography;

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('SUP-13579', 'Support ID');
    if (success) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card title="Profile" style={{ width: 450 }} data-testid="profile-form">
      <Form layout="vertical">
        <Form.Item label="Name">
          <Input defaultValue="Alex Johnson" />
        </Form.Item>
        
        <Form.Item label="Email">
          <Input defaultValue="alex@example.com" />
        </Form.Item>

        <Form.Item label="Time zone">
          <Select defaultValue="utc-5">
            <Select.Option value="utc-8">Pacific Time (UTC-8)</Select.Option>
            <Select.Option value="utc-5">Eastern Time (UTC-5)</Select.Option>
            <Select.Option value="utc+0">UTC</Select.Option>
            <Select.Option value="utc+1">Central European Time (UTC+1)</Select.Option>
          </Select>
        </Form.Item>

        {/* Support ID - read-only with copy */}
        <Form.Item label="Support ID">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text
              copyable={{
                text: 'SUP-13579',
                onCopy: handleCopy,
                tooltips: ['Copy Support ID', 'Copied'],
              }}
              code
              style={{ fontFamily: 'monospace' }}
              data-testid="copy-support-id"
            >
              SUP-13579
            </Text>
          </div>
        </Form.Item>

        <Space>
          <Button type="primary">Save</Button>
          <Button>Cancel</Button>
        </Space>
      </Form>
    </Card>
  );
}
