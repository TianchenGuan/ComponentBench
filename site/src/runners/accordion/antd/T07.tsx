'use client';

/**
 * accordion-antd-T07: Dark settings panel: open Advanced section
 * 
 * Scene is a settings_panel layout in dark theme. A left column shows non-functional 
 * settings headings and a disabled search input (clutter), while the main panel contains 
 * the target accordion card titled "Settings sections". The accordion is an Ant Design 
 * Collapse in accordion mode with 5 panels: "General", "Appearance", "Notifications", 
 * "Privacy", "Advanced". Initial state: "General" is expanded by default.
 * 
 * Success: expanded_item_ids equals exactly: [advanced]
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card, Input } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string | string[]>('general');

  useEffect(() => {
    if (activeKey === 'advanced' || (Array.isArray(activeKey) && activeKey.includes('advanced') && activeKey.length === 1)) {
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 900 }}>
      {/* Left sidebar (clutter) */}
      <div style={{ width: 200, flexShrink: 0 }}>
        <Input placeholder="Search settings..." disabled style={{ marginBottom: 16 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ padding: '8px 12px', borderRadius: 4, color: '#888' }}>Dashboard</div>
          <div style={{ padding: '8px 12px', borderRadius: 4, color: '#888' }}>Users</div>
          <div style={{ padding: '8px 12px', borderRadius: 4, color: '#888' }}>Analytics</div>
          <div style={{ padding: '8px 12px', borderRadius: 4, color: '#888' }}>Reports</div>
        </div>
      </div>

      {/* Main accordion panel */}
      <Card title="Settings sections" style={{ flex: 1 }}>
        <Collapse
          accordion
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key)}
          data-testid="accordion-root"
          items={[
            {
              key: 'general',
              label: 'General',
              children: <p>General application settings and preferences.</p>,
            },
            {
              key: 'appearance',
              label: 'Appearance',
              children: <p>Customize the look and feel of the application.</p>,
            },
            {
              key: 'notifications',
              label: 'Notifications',
              children: <p>Configure notification preferences and alerts.</p>,
            },
            {
              key: 'privacy',
              label: 'Privacy',
              children: <p>Manage privacy settings and data preferences.</p>,
            },
            {
              key: 'advanced',
              label: 'Advanced',
              children: <p>Advanced settings for power users and developers.</p>,
            },
          ]}
        />
      </Card>
    </div>
  );
}
