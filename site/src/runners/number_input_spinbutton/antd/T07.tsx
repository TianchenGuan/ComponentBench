'use client';

/**
 * number_input_spinbutton-antd-T07: Scroll to set session timeout
 * 
 * The page is a tall settings panel with multiple sections separated by headings (Account, Notifications, Security, Integrations).
 * The target component is inside the "Security" section, which is below the fold and requires scrolling to reach.
 * In the Security section there is one Ant Design InputNumber labeled "Session timeout (minutes)".
 * - Constraints: min=5, max=60, step=5.
 * - Initial state: value is 30.
 * For clutter, earlier sections contain checkboxes, toggles, and text fields, but none affect success.
 * No Save/Apply button is present; changes are immediate when the input shows the new number.
 * 
 * Success: The numeric value of the target number input is 15.
 */

import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Switch, Input, Checkbox, Typography, Divider } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [sessionTimeout, setSessionTimeout] = useState<number | null>(30);

  useEffect(() => {
    if (sessionTimeout === 15) {
      onSuccess();
    }
  }, [sessionTimeout, onSuccess]);

  return (
    <Card title="Settings" style={{ width: 450, maxHeight: 400 }} styles={{ body: { padding: 0 } }}>
      <div style={{ height: 350, overflowY: 'auto', padding: 16 }}>
        {/* Account Section */}
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Account</Text>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Display name</label>
            <Input defaultValue="John Doe" style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Email</label>
            <Input defaultValue="john@example.com" style={{ width: '100%' }} />
          </div>
        </div>
        
        <Divider />
        
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Weekly digest</span>
            <Checkbox defaultChecked />
          </div>
        </div>
        
        <Divider />
        
        {/* Security Section */}
        <div style={{ marginBottom: 24 }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Security</Text>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Two-factor authentication</span>
            <Switch />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="session-timeout-input" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
              Session timeout (minutes)
            </label>
            <InputNumber
              id="session-timeout-input"
              min={5}
              max={60}
              step={5}
              value={sessionTimeout}
              onChange={(val) => setSessionTimeout(val)}
              style={{ width: '100%' }}
              data-testid="session-timeout-input"
            />
          </div>
        </div>
        
        <Divider />
        
        {/* Integrations Section */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Integrations</Text>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Slack integration</span>
            <Switch />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>GitHub sync</span>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </Card>
  );
}
