'use client';

/**
 * listbox_single-antd-T03: Sidebar navigation: go to Billing
 *
 * Scene: light theme, comfortable spacing, dashboard layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is low.
 * A dashboard layout shows a left sidebar (about 240px wide) containing an AntD Menu in inline mode with four items:
 * "Overview", "Projects", "Billing", "Team". The main content area shows read-only placeholder cards 
 * (recent invoices, usage chart) that update when a sidebar item is selected, but no other controls are needed.
 * Initial sidebar selection is "Overview".
 *
 * Success: Selected option value equals: billing
 */

import React, { useState } from 'react';
import { Menu, Card, Typography, Progress } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

const { Title, Text } = Typography;

const sidebarOptions = [
  { key: 'overview', label: 'Overview' },
  { key: 'projects', label: 'Projects' },
  { key: 'billing', label: 'Billing' },
  { key: 'team', label: 'Team' },
];

const contentBySection: Record<string, React.ReactNode> = {
  overview: (
    <>
      <Title level={4}>Overview</Title>
      <Text type="secondary">Welcome to your dashboard</Text>
    </>
  ),
  projects: (
    <>
      <Title level={4}>Projects</Title>
      <Text type="secondary">3 active projects</Text>
    </>
  ),
  billing: (
    <>
      <Title level={4}>Billing</Title>
      <Card size="small" style={{ marginTop: 12 }}>
        <Text strong>Recent Invoice #1024</Text>
        <div>$299.00 - Paid</div>
      </Card>
    </>
  ),
  team: (
    <>
      <Title level={4}>Team</Title>
      <Text type="secondary">5 members</Text>
    </>
  ),
};

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('overview');

  const handleSelect: MenuProps['onSelect'] = ({ key }) => {
    setSelected(key);
    if (key === 'billing') {
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', width: 700, border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: '#fafafa', borderRight: '1px solid #e8e8e8' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e8e8e8' }}>
          <Text strong>Dashboard</Text>
        </div>
        <Menu
          data-cb-listbox-root
          data-cb-selected-value={selected}
          mode="inline"
          selectedKeys={[selected]}
          onSelect={handleSelect}
          items={sidebarOptions.map(opt => ({
            key: opt.key,
            label: opt.label,
            'data-cb-option-value': opt.key,
          }))}
          style={{ border: 'none', background: 'transparent' }}
        />
      </div>
      
      {/* Main content */}
      <div style={{ flex: 1, padding: 24, background: '#fff' }}>
        {contentBySection[selected]}
        <Card size="small" style={{ marginTop: 16 }}>
          <Text type="secondary">Usage</Text>
          <Progress percent={65} size="small" />
        </Card>
      </div>
    </div>
  );
}
