'use client';

/**
 * clipboard_copy-antd-T07: Scroll to Webhooks section and copy secret
 *
 * Layout: settings_panel, centered. The page is taller than the viewport.
 * A vertical settings panel contains multiple sections stacked top-to-bottom:
 * - General
 * - Notifications
 * - Security
 * - Webhooks (this one is near the bottom, below the fold)
 *
 * Each section has a heading and a few irrelevant toggles/inputs as clutter (they are not required for success).
 * In the Webhooks section there is a row labeled "Signing secret" with value "whsec_9A2D7C11".
 * The value is displayed as Typography.Text with a copyable icon (clipboard_copy component).
 *
 * Component behavior:
 * - Clicking the copy icon copies the signing secret and shows a brief "Copied" tooltip.
 *
 * Initial state: page starts scrolled near the top (General section visible). Webhooks section is not visible until scrolling down.
 *
 * Success: Clipboard text equals "whsec_9A2D7C11".
 */

import React, { useState } from 'react';
import { Card, Typography, Space, Switch, Input, Divider } from 'antd';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const { Text, Title } = Typography;

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('whsec_9A2D7C11', 'Signing secret');
    if (success) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card title="Settings" style={{ width: 500, maxHeight: '100vh' }} data-testid="settings-panel">
      <div style={{ height: 800 }}>
        {/* General Section */}
        <section style={{ marginBottom: 32 }}>
          <Title level={5}>General</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Dark mode</Text>
              <Switch />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Language</Text>
              <Input style={{ width: 150 }} defaultValue="English" />
            </div>
          </Space>
        </section>

        <Divider />

        {/* Notifications Section */}
        <section style={{ marginBottom: 32 }}>
          <Title level={5}>Notifications</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Email notifications</Text>
              <Switch defaultChecked />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Push notifications</Text>
              <Switch />
            </div>
          </Space>
        </section>

        <Divider />

        {/* Security Section */}
        <section style={{ marginBottom: 32 }}>
          <Title level={5}>Security</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Two-factor authentication</Text>
              <Switch />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Session timeout (minutes)</Text>
              <Input style={{ width: 80 }} defaultValue="30" />
            </div>
          </Space>
        </section>

        <Divider />

        {/* Webhooks Section - target */}
        <section id="webhooks-section" data-testid="webhooks-section">
          <Title level={5}>Webhooks</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Enable webhooks</Text>
              <Switch defaultChecked />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text>Signing secret:</Text>
              <Text
                copyable={{
                  text: 'whsec_9A2D7C11',
                  onCopy: handleCopy,
                  tooltips: ['Copy', 'Copied'],
                }}
                code
                style={{ fontFamily: 'monospace' }}
                data-testid="copy-signing-secret"
              >
                whsec_9A2D7C11
              </Text>
            </div>
          </Space>
        </section>
      </div>
    </Card>
  );
}
