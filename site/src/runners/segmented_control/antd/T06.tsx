'use client';

/**
 * segmented_control-antd-T06: Theme mode → Dark (scroll to find)
 *
 * Layout: settings panel (single-page settings) with a vertical stack of many settings groups.
 * The target Ant Design Segmented control is in the "Appearance" group labeled "Theme mode".
 * - Options: "System", "Light", "Dark"
 * - Initial state: "System" is selected.
 *
 * The "Appearance" group is not at the top; it appears below several other groups
 * ("Account", "Notifications", "Privacy"), so the agent must scroll down to reach it.
 *
 * Clutter (medium): the panel includes several other controls (switches, text inputs, and dropdowns),
 * but none affect success.
 * Selecting a theme mode updates immediately; there is no Save/Apply button.
 *
 * Success: The Segmented labeled "Theme mode" has selected value = Dark.
 */

import React, { useState } from 'react';
import { Card, Typography, Input, Switch, Select, Space, Divider } from 'antd';
import { Segmented } from 'antd';
import type { TaskComponentProps } from '../types';

const { Title, Text } = Typography;

const themeOptions = ['System', 'Light', 'Dark'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [themeMode, setThemeMode] = useState<string>('System');

  const handleThemeChange = (value: string | number) => {
    const val = String(value);
    setThemeMode(val);
    if (val === 'Dark') {
      onSuccess();
    }
  };

  return (
    <div style={{ width: 500, maxHeight: 400, overflowY: 'auto', padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
      {/* Account Section */}
      <Title level={5} id="settings-account">Account</Title>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <div>
          <Text type="secondary">Display name</Text>
          <Input defaultValue="John Doe" style={{ marginTop: 4 }} />
        </div>
        <div>
          <Text type="secondary">Email</Text>
          <Input defaultValue="john@example.com" style={{ marginTop: 4 }} />
        </div>
      </Space>
      <Divider />

      {/* Notifications Section */}
      <Title level={5} id="settings-notifications">Notifications</Title>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Push notifications</Text>
          <Switch defaultChecked />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Email digest</Text>
          <Switch />
        </div>
      </Space>
      <Divider />

      {/* Privacy Section */}
      <Title level={5} id="settings-privacy">Privacy</Title>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <div>
          <Text type="secondary">Profile visibility</Text>
          <Select defaultValue="public" style={{ width: '100%', marginTop: 4 }}>
            <Select.Option value="public">Public</Select.Option>
            <Select.Option value="private">Private</Select.Option>
          </Select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Show online status</Text>
          <Switch defaultChecked />
        </div>
      </Space>
      <Divider />

      {/* Appearance Section - Target */}
      <Title level={5} id="settings-appearance">Appearance</Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Theme mode</Text>
          <Segmented
            data-testid="theme-mode"
            data-canonical-type="segmented_control"
            data-selected-value={themeMode}
            options={themeOptions}
            value={themeMode}
            onChange={handleThemeChange}
          />
        </div>
      </Space>
    </div>
  );
}
