'use client';

/**
 * select_custom_single-antd-T09: Match the Backup role to the shield badge
 *
 * Layout: settings_panel in dark theme.
 * The panel title is "Security roles" and it contains two Ant Design Select components:
 * 1) "Default role"
 * 2) "Backup role"
 * Both are default size with comfortable spacing.
 *
 * Instances: 2 selects on the page. The task targets the "Backup role" select.
 *
 * Each option in the dropdown is custom-rendered with a leading icon:
 * - Viewer (eye icon)
 * - Editor (pencil icon)
 * - Security Admin (shield icon)
 * - Owner (crown icon)
 * The option text is present but the icons are visually prominent.
 *
 * Visual guidance: on the right side of the panel there is a "Reference" box showing a single badge/icon (a shield).
 * The intent is to pick the role option whose icon matches that reference.
 *
 * Initial state: Default role is "Editor"; Backup role is "Viewer".
 * Feedback: selecting an option immediately updates the Backup role field; no Apply/OK button.
 *
 * Clutter: below the selects there are two non-target toggles ("Require 2FA", "Lock after 10 attempts").
 * These are distractors and do not affect success.
 *
 * Success: The Select labeled "Backup role" has selected value exactly "Security Admin".
 */

import React, { useState } from 'react';
import { Card, Select, Typography, Switch, Space, Row, Col } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  SafetyOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const roleOptions = [
  { label: 'Viewer', value: 'Viewer', icon: <EyeOutlined /> },
  { label: 'Editor', value: 'Editor', icon: <EditOutlined /> },
  { label: 'Security Admin', value: 'Security Admin', icon: <SafetyOutlined /> },
  { label: 'Owner', value: 'Owner', icon: <CrownOutlined /> },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [defaultRole, setDefaultRole] = useState<string>('Editor');
  const [backupRole, setBackupRole] = useState<string>('Viewer');

  const handleBackupRoleChange = (newValue: string) => {
    setBackupRole(newValue);
    if (newValue === 'Security Admin') {
      onSuccess();
    }
  };

  return (
    <Card title="Security roles" style={{ width: 550 }}>
      <Row gutter={24}>
        <Col span={16}>
          <div style={{ marginBottom: 20 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Default role</Text>
            <Select
              data-testid="default-role-select"
              style={{ width: '100%' }}
              value={defaultRole}
              onChange={setDefaultRole}
              options={roleOptions.map(opt => ({
                value: opt.value,
                label: (
                  <Space>
                    {opt.icon}
                    {opt.label}
                  </Space>
                ),
              }))}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Backup role</Text>
            <Select
              data-testid="backup-role-select"
              style={{ width: '100%' }}
              value={backupRole}
              onChange={handleBackupRoleChange}
              options={roleOptions.map(opt => ({
                value: opt.value,
                label: (
                  <Space>
                    {opt.icon}
                    {opt.label}
                  </Space>
                ),
              }))}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Space>
              <Switch size="small" />
              <Text>Require 2FA</Text>
            </Space>
          </div>
          <div>
            <Space>
              <Switch size="small" />
              <Text>Lock after 10 attempts</Text>
            </Space>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ background: '#2a2a2a', padding: 16, borderRadius: 8, textAlign: 'center' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>Reference</Text>
            <SafetyOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </div>
        </Col>
      </Row>
    </Card>
  );
}
