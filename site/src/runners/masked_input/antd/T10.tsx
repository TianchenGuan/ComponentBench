'use client';

/**
 * masked_input-antd-T10: Set server IPv4 in settings panel
 * 
 * Settings panel layout with many unrelated controls (toggles, selects, and help text) arranged in sections.
 * The target masked Ant Design Input is labeled "Server IPv4 address" and appears in the "Network" section below the initial fold, requiring vertical scrolling to reach it.
 * The IPv4 mask enforces three digits per octet with dots, showing a placeholder like "___.___.___.___". Leading zeros are allowed to keep a fixed width.
 * The field starts empty (no value). Other settings are present as distractors but are not required for success.
 * 
 * Success: The "Server IPv4 address" masked input value equals "192.168.001.010".
 */

import React, { useState, useEffect } from 'react';
import { Card, Switch, Select, Typography, Divider } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [ipValue, setIpValue] = useState('');

  useEffect(() => {
    if (ipValue === '192.168.001.010') {
      onSuccess();
    }
  }, [ipValue, onSuccess]);

  return (
    <div style={{ width: 500, maxHeight: 400, overflowY: 'auto' }} data-testid="settings-panel">
      <Card title="Settings" style={{ border: 'none' }}>
        {/* General Section */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5} style={{ marginBottom: 16 }}>General</Title>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Enable notifications</span>
            <Switch defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Auto-save</span>
            <Switch />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Language</span>
            <Select defaultValue="en" style={{ width: 120 }}>
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="es">Español</Select.Option>
              <Select.Option value="fr">Français</Select.Option>
            </Select>
          </div>
        </div>

        <Divider />

        {/* Security Section */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5} style={{ marginBottom: 16 }}>Security</Title>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Two-factor authentication</span>
            <Switch />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Session timeout</span>
            <Select defaultValue="30" style={{ width: 120 }}>
              <Select.Option value="15">15 minutes</Select.Option>
              <Select.Option value="30">30 minutes</Select.Option>
              <Select.Option value="60">1 hour</Select.Option>
            </Select>
          </div>
        </div>

        <Divider />

        {/* Display Section */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5} style={{ marginBottom: 16 }}>Display</Title>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Dark mode</span>
            <Switch />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Font size</span>
            <Select defaultValue="medium" style={{ width: 120 }}>
              <Select.Option value="small">Small</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="large">Large</Select.Option>
            </Select>
          </div>
        </div>

        <Divider />

        {/* Network Section - target is here */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5} style={{ marginBottom: 16 }}>Network</Title>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Proxy enabled</span>
            <Switch />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="server-ipv4" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
              Server IPv4 address
            </label>
            <IMaskInput
              id="server-ipv4"
              mask="000.000.000.000"
              definitions={{
                '0': /[0-9]/
              }}
              placeholder="___.___.___.___ "
              value={ipValue}
              onAccept={(val: string) => setIpValue(val)}
              data-testid="server-ipv4"
              style={{
                width: '100%',
                padding: '4px 11px',
                fontSize: 14,
                lineHeight: '1.5714285714285714',
                border: '1px solid #d9d9d9',
                borderRadius: 6,
                outline: 'none',
                fontFamily: 'monospace',
              }}
            />
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Enter the server address in IPv4 format with leading zeros (e.g., 192.168.001.001)
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}
