'use client';

/**
 * menu-antd-T06: Select Logs in the Secondary navigation menu
 * 
 * Scene: theme=light, spacing=comfortable, layout=form_section, placement=top_left, scale=default, instances=2.
 *
 * Components:
 * - Two vertical Ant Design Menus placed side-by-side in the same card:
 *   1) "Primary navigation" (left)
 *   2) "Secondary navigation" (right)
 *
 * Each menu has its own mirrored status line directly beneath it.
 *
 * Menu items (both menus intentionally share similar labels):
 * - Primary navigation: Overview (selected initially), Logs, Alerts, Settings
 * - Secondary navigation: Events (selected initially), Logs, Alerts, Settings
 *
 * Success: In the menu labeled "Secondary navigation", the selected item is "Logs".
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card, Input } from 'antd';
import type { TaskComponentProps } from '../types';

const primaryItems = [
  { key: 'Overview', label: 'Overview' },
  { key: 'Logs', label: 'Logs' },
  { key: 'Alerts', label: 'Alerts' },
  { key: 'Settings', label: 'Settings' },
];

const secondaryItems = [
  { key: 'Events', label: 'Events' },
  { key: 'Logs', label: 'Logs' },
  { key: 'Alerts', label: 'Alerts' },
  { key: 'Settings', label: 'Settings' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [primarySelected, setPrimarySelected] = useState<string>('Overview');
  const [secondarySelected, setSecondarySelected] = useState<string>('Events');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (secondarySelected === 'Logs' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [secondarySelected, successTriggered, onSuccess]);

  return (
    <Card style={{ width: 700 }}>
      <div style={{ display: 'flex', gap: 32 }}>
        {/* Primary Navigation */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: 500 }}>
            Primary navigation
          </div>
          <Menu
            mode="inline"
            selectedKeys={[primarySelected]}
            items={primaryItems}
            onClick={({ key }) => setPrimarySelected(key)}
            style={{ borderRight: 'none' }}
            data-testid="menu-primary"
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#666', borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
            Primary selected: <strong data-testid="primary-selected">{primarySelected}</strong>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: 500 }}>
            Secondary navigation
          </div>
          <Menu
            mode="inline"
            selectedKeys={[secondarySelected]}
            items={secondaryItems}
            onClick={({ key }) => setSecondarySelected(key)}
            style={{ borderRight: 'none' }}
            data-testid="menu-secondary"
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#666', borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
            Secondary selected: <strong data-testid="secondary-selected">{secondarySelected}</strong>
          </div>
        </div>
      </div>

      {/* Read-only form fields for clutter */}
      <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>Configuration</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Input value="Default workspace" disabled style={{ flex: 1 }} />
          <Input value="Production" disabled style={{ flex: 1 }} />
        </div>
      </div>
    </Card>
  );
}
