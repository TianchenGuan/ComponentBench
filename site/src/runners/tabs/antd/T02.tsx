'use client';

/**
 * tabs-antd-T02: Account form: open Billing tab
 *
 * Layout: a form_section titled "Account Settings" centered on the page.
 * Component: Ant Design Tabs configured as card tabs (type=card) at the top of the section.
 * Tabs: "Profile", "Security", "Billing", "Notifications".
 * Initial state: "Profile" is active. The panel contains several text inputs (Name, Email) and a Save button.
 * Clutter: low—there are a couple of non-interactive help texts and a disabled "Delete account" button below the tabs.
 * Success: Active tab is "Billing" (value/key: billing).
 */

import React, { useState } from 'react';
import { Tabs, Card, Input, Button, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState('profile');

  const handleChange = (key: string) => {
    setActiveKey(key);
    if (key === 'billing') {
      onSuccess();
    }
  };

  return (
    <Card title="Account Settings" style={{ width: 550 }}>
      <Tabs
        activeKey={activeKey}
        onChange={handleChange}
        type="card"
        items={[
          {
            key: 'profile',
            label: 'Profile',
            children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Name</Text>
                  <Input placeholder="Enter your name" style={{ width: 300 }} />
                </div>
                <div>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Email</Text>
                  <Input placeholder="Enter your email" style={{ width: 300 }} />
                </div>
                <Button type="primary" style={{ width: 100 }}>Save</Button>
              </div>
            ),
          },
          { key: 'security', label: 'Security', children: <p>Security settings panel</p> },
          { key: 'billing', label: 'Billing', children: <p>Billing panel</p> },
          { key: 'notifications', label: 'Notifications', children: <p>Notifications panel</p> },
        ]}
      />
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Need help? Contact support for account assistance.
        </Text>
        <Button danger disabled>Delete account</Button>
      </div>
    </Card>
  );
}
