'use client';

/**
 * accordion-antd-T02: Account accordion: switch to Security
 * 
 * Scene is an isolated card centered in the viewport with a single Ant Design Collapse 
 * configured in accordion mode. The card title reads "Account sections". There are 4 panels: 
 * "Profile", "Security", "Notifications", and "Connected apps". Initial state: "Profile" is 
 * expanded by default and its content is visible; the other three are collapsed.
 * 
 * Success: expanded_item_ids equals exactly: [security]
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string | string[]>('profile');

  useEffect(() => {
    if (activeKey === 'security' || (Array.isArray(activeKey) && activeKey.includes('security') && activeKey.length === 1)) {
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  return (
    <Card title="Account sections" style={{ width: 500 }}>
      <Collapse
        accordion
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        data-testid="accordion-root"
        items={[
          {
            key: 'profile',
            label: 'Profile',
            children: (
              <p>
                Manage your profile information including name, email, and profile picture.
              </p>
            ),
          },
          {
            key: 'security',
            label: 'Security',
            children: (
              <p>
                Update your password, enable two-factor authentication, and manage security settings.
              </p>
            ),
          },
          {
            key: 'notifications',
            label: 'Notifications',
            children: (
              <p>
                Configure email and push notification preferences.
              </p>
            ),
          },
          {
            key: 'connected_apps',
            label: 'Connected apps',
            children: (
              <p>
                View and manage third-party applications connected to your account.
              </p>
            ),
          },
        ]}
      />
    </Card>
  );
}
