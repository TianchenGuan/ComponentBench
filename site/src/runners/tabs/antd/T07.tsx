'use client';

/**
 * tabs-antd-T07: Dark icon tabs: match the target icon
 *
 * Layout: isolated_card centered titled "Notification Center".
 * Universal variation: dark theme.
 * Component: Ant Design Tabs (type=line) where each tab header includes an icon plus a short label.
 * Tabs (left-to-right):
 *   1) User icon + "Profile"
 *   2) Bell icon + "Alerts"
 *   3) Shield icon + "Security"
 *   4) Card icon + "Billing"
 * Initial state: "Profile" is active.
 * Above the tabs is a small reference card labeled "Target tab" that displays only an icon (no text). The icon matches exactly one tab header icon (the bell).
 * No other tab components exist on the page.
 * Success: Active tab is "Alerts" (value/key: alerts).
 */

import React, { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import { UserOutlined, BellOutlined, SafetyOutlined, CreditCardOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState('profile');

  const handleChange = (key: string) => {
    setActiveKey(key);
    if (key === 'alerts') {
      onSuccess();
    }
  };

  return (
    <Card
      title="Notification Center"
      style={{ width: 500 }}
    >
      {/* Target reference card */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          marginBottom: 16,
          borderRadius: 4,
          border: '1px dashed #434343',
          background: 'rgba(255, 255, 255, 0.04)',
        }}
      >
        <Text type="secondary" style={{ fontSize: 12 }}>Target tab:</Text>
        <BellOutlined style={{ fontSize: 18 }} />
      </div>

      <Tabs
        activeKey={activeKey}
        onChange={handleChange}
        items={[
          {
            key: 'profile',
            label: (
              <span>
                <UserOutlined /> Profile
              </span>
            ),
            children: <p>Profile panel</p>,
          },
          {
            key: 'alerts',
            label: (
              <span>
                <BellOutlined /> Alerts
              </span>
            ),
            children: <p>Alerts panel</p>,
          },
          {
            key: 'security',
            label: (
              <span>
                <SafetyOutlined /> Security
              </span>
            ),
            children: <p>Security panel</p>,
          },
          {
            key: 'billing',
            label: (
              <span>
                <CreditCardOutlined /> Billing
              </span>
            ),
            children: <p>Billing panel</p>,
          },
        ]}
      />
    </Card>
  );
}
