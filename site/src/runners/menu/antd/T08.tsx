'use client';

/**
 * menu-antd-T08: Scroll a long menu to select Audit Trail
 * 
 * Scene: theme=light, spacing=compact, layout=dashboard, placement=bottom_right, scale=small, instances=1.
 *
 * The page uses a dashboard-style layout with multiple non-interactive cards (charts as placeholders).
 * The target component is anchored at the bottom-right of the viewport inside a card titled "Activity".
 *
 * Component:
 * - A vertical Ant Design Menu rendered inside a fixed-height container (so it must scroll).
 * - A long list (~30 items) mixing activity-related options.
 * - The target leaf item "Audit Trail" appears near the bottom of the list (not initially visible without scrolling).
 * - A similarly named distractor "Audit settings" appears higher up.
 *
 * Initial state:
 * - "Overview" is selected initially.
 *
 * Success: The Activity menu's selected item is "Audit Trail".
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import type { TaskComponentProps } from '../types';

const activityItems = [
  { key: 'Overview', label: 'Overview' },
  { key: 'Recent events', label: 'Recent events' },
  { key: 'Access history', label: 'Access history' },
  { key: 'Audit settings', label: 'Audit settings' },
  { key: 'User activity', label: 'User activity' },
  { key: 'Login attempts', label: 'Login attempts' },
  { key: 'API calls', label: 'API calls' },
  { key: 'Error logs', label: 'Error logs' },
  { key: 'System events', label: 'System events' },
  { key: 'Notifications', label: 'Notifications' },
  { key: 'Alerts', label: 'Alerts' },
  { key: 'Reports', label: 'Reports' },
  { key: 'Export history', label: 'Export history' },
  { key: 'Import history', label: 'Import history' },
  { key: 'Data changes', label: 'Data changes' },
  { key: 'Permission changes', label: 'Permission changes' },
  { key: 'Role assignments', label: 'Role assignments' },
  { key: 'Team activity', label: 'Team activity' },
  { key: 'Project activity', label: 'Project activity' },
  { key: 'File uploads', label: 'File uploads' },
  { key: 'File downloads', label: 'File downloads' },
  { key: 'Scheduled tasks', label: 'Scheduled tasks' },
  { key: 'Background jobs', label: 'Background jobs' },
  { key: 'Webhooks', label: 'Webhooks' },
  { key: 'Integrations', label: 'Integrations' },
  { key: 'Security events', label: 'Security events' },
  { key: 'Compliance', label: 'Compliance' },
  { key: 'Audit Trail', label: 'Audit Trail' },  // Target - near bottom
  { key: 'Archive', label: 'Archive' },
  { key: 'Settings', label: 'Settings' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string>('Overview');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedKey === 'Audit Trail' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedKey, successTriggered, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', width: '100%', maxWidth: 900 }}>
      {/* Dashboard clutter cards */}
      <Card size="small" style={{ width: 200, height: 120 }}>
        <div style={{ fontSize: 11, color: '#999' }}>Daily Active Users</div>
        <div style={{ fontSize: 24, fontWeight: 600, color: '#1677ff', marginTop: 8 }}>2,451</div>
        <div style={{ fontSize: 10, color: '#52c41a', marginTop: 4 }}>+12.5%</div>
      </Card>
      <Card size="small" style={{ width: 200, height: 120 }}>
        <div style={{ fontSize: 11, color: '#999' }}>API Requests</div>
        <div style={{ fontSize: 24, fontWeight: 600, color: '#722ed1', marginTop: 8 }}>148K</div>
        <div style={{ fontSize: 10, color: '#52c41a', marginTop: 4 }}>+8.2%</div>
      </Card>
      <Card size="small" style={{ width: 200, height: 120 }}>
        <div style={{ fontSize: 11, color: '#999' }}>Error Rate</div>
        <div style={{ fontSize: 24, fontWeight: 600, color: '#fa8c16', marginTop: 8 }}>0.3%</div>
        <div style={{ fontSize: 10, color: '#ff4d4f', marginTop: 4 }}>+0.1%</div>
      </Card>

      {/* Activity Menu Card - target component */}
      <Card 
        size="small" 
        title="Activity" 
        style={{ width: 220 }}
        styles={{ body: { padding: 0 } }}
      >
        <div 
          style={{ maxHeight: 200, overflowY: 'auto' }}
          data-testid="activity-menu-scroll"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={activityItems}
            onClick={({ key }) => setSelectedKey(key)}
            style={{ borderRight: 'none', fontSize: 11 }}
            data-testid="menu-activity"
          />
        </div>
        <div style={{ padding: '8px 12px', fontSize: 10, color: '#666', borderTop: '1px solid #f0f0f0' }}>
          Activity view: <strong data-testid="activity-view">{selectedKey}</strong>
        </div>
      </Card>
    </div>
  );
}
