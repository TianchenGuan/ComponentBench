'use client';

/**
 * pin_input_otp-antd-T07: Navigate to Security tab then enter authenticator code
 * 
 * A settings_panel layout with Ant Design Tabs at the top: "Profile", "Notifications",
 * and "Security". The OTP input is only visible in the "Security" tab under a section
 * header "Two-factor authentication". The OTP is a 6-box composite with auto-advance.
 * Uses compact spacing. Initial state: page loads on "Profile" tab; OTP empty when reached.
 * 
 * Success: Target OTP value equals '118502'.
 */

import React, { useState, useEffect } from 'react';
import { Tabs, Card, Input, Switch, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { OTP } = Input;
const { Text } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '118502') {
      onSuccess();
    }
  }, [value, onSuccess]);

  const items = [
    {
      key: 'profile',
      label: 'Profile',
      children: (
        <div style={{ padding: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Display name</label>
            <Input placeholder="Enter your name" style={{ width: 300 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Bio</label>
            <Input.TextArea placeholder="Tell us about yourself" rows={3} style={{ width: 300 }} />
          </div>
        </div>
      ),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      children: (
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Switch />
            <span>Email notifications</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Switch />
            <span>Push notifications</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Switch />
            <span>SMS notifications</span>
          </div>
        </div>
      ),
    },
    {
      key: 'security',
      label: 'Security',
      children: (
        <div style={{ padding: 16 }}>
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 12 }}>Two-factor authentication</h4>
            <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
              Use an authenticator app to generate time-based codes.
            </Text>
            <div aria-labelledby="auth-code-label">
              <label id="auth-code-label" style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>
                Authenticator code
              </label>
              <div data-testid="otp-authenticator-code" aria-label="Authenticator code">
                <OTP
                  length={6}
                  value={value}
                  onChange={setValue}
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card style={{ width: 500 }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        size="small"
      />
    </Card>
  );
}
