'use client';

/**
 * password_input-antd-T08: Find and set the Database password in a long settings panel
 * 
 * A settings panel layout fills the page with a scrollable right-hand content area. The content
 * contains several sections (Profile, Notifications, Integrations, and Database connection) with
 * headings and non-interactive toggles as distractors.
 * The "Database connection" section is near the bottom of the scroll area. Inside it, there is
 * one Ant Design Input.Password labeled "Database password" (initially empty) with the eye toggle.
 * No Save button is required; the task ends as soon as the correct value is present.
 * 
 * Success: The Input.Password labeled "Database password" equals exactly "DBase@Jan30".
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Switch, Select, Typography, Divider } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [dbPassword, setDbPassword] = useState('');

  useEffect(() => {
    if (dbPassword === 'DBase@Jan30') {
      onSuccess();
    }
  }, [dbPassword, onSuccess]);

  return (
    <Card title="Settings" style={{ width: 450, maxHeight: 450 }} bodyStyle={{ padding: 0 }}>
      <div style={{ height: 400, overflowY: 'auto', padding: 16 }} data-testid="settings-scroll-area">
        {/* Profile Section */}
        <div style={{ marginBottom: 24 }} data-testid="section-profile">
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Profile</Text>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Show online status</span>
            <Switch defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Display full name</span>
            <Switch />
          </div>
        </div>
        
        <Divider />
        
        {/* Notifications Section */}
        <div style={{ marginBottom: 24 }} data-testid="section-notifications">
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Notifications</Text>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Email alerts</span>
            <Switch defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Push notifications</span>
            <Switch />
          </div>
        </div>
        
        <Divider />
        
        {/* Integrations Section */}
        <div style={{ marginBottom: 24 }} data-testid="section-integrations">
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Integrations</Text>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>API Version</label>
            <Select 
              style={{ width: '100%' }} 
              defaultValue="v2"
              options={[
                { value: 'v1', label: 'API v1' },
                { value: 'v2', label: 'API v2' },
                { value: 'v3', label: 'API v3 (beta)' },
              ]}
            />
          </div>
        </div>
        
        <Divider />
        
        {/* Database Connection Section */}
        <div data-testid="section-database">
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Database connection</Text>
          <div>
            <label htmlFor="db-password" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
              Database password
            </label>
            <Input.Password
              id="db-password"
              value={dbPassword}
              onChange={(e) => setDbPassword(e.target.value)}
              data-testid="db-password-input"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
