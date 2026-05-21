'use client';

/**
 * text_input-antd-T10: Scroll to webhook URL field and set it
 * 
 * Scene is a settings_panel page anchored near the bottom-left of the viewport, with a fixed-height scroll
 * container that requires scrolling to reach the last section. Several sections appear first (Notifications,
 * Appearance, Privacy) containing toggles and dropdowns as distractors. The final section is "Integrations".
 * Inside Integrations there is a single Ant Design Input labeled "Webhook URL" (the only text_input instance
 * on the page). The field starts with the value "https://hooks.acme.io/default". There is a small helper
 * note: "Must start with https://". No Save/Apply is required for success.
 * 
 * Success: The input labeled "Webhook URL" has value exactly "https://hooks.acme.io/orders" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Switch, Select, Typography, Divider } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.acme.io/default');

  useEffect(() => {
    if (webhookUrl.trim() === 'https://hooks.acme.io/orders') {
      onSuccess();
    }
  }, [webhookUrl, onSuccess]);

  return (
    <Card title="Integration settings" style={{ width: 400, maxHeight: 400 }} bodyStyle={{ padding: 0 }}>
      <div style={{ height: 350, overflowY: 'auto', padding: 16 }}>
        {/* Notifications Section */}
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Notifications</Text>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Email notifications</span>
            <Switch defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Push notifications</span>
            <Switch />
          </div>
        </div>
        
        <Divider />
        
        {/* Appearance Section */}
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Appearance</Text>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Theme</label>
            <Select 
              style={{ width: '100%' }} 
              defaultValue="system"
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' },
              ]}
            />
          </div>
        </div>
        
        <Divider />
        
        {/* Privacy Section */}
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Privacy</Text>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Share analytics</span>
            <Switch defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Public profile</span>
            <Switch />
          </div>
        </div>
        
        <Divider />
        
        {/* Integrations Section */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Integrations</Text>
          <div>
            <label htmlFor="webhook-url" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
              Webhook URL
            </label>
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              data-testid="webhook-url-input"
            />
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Must start with https://
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
