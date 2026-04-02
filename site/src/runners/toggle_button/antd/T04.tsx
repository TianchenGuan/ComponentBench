'use client';

/**
 * toggle_button-antd-T04: Enable compact view in settings panel
 *
 * Layout: settings_panel centered in the viewport. Light theme, comfortable spacing, default scale. Clutter is low.
 *
 * The panel has a left sidebar with headings ("General", "View", "Privacy") but only "View" is active by default.
 * In the main area there is one row labeled "Compact view" with a toggle-style AntD Button labeled "Compact view".
 *
 * Toggle semantics:
 * - aria-pressed reflects state
 * - Off = default button
 * - On = primary/filled button and the row text updates to "Compact view: On"
 *
 * Initial state: Off. No Save/Apply step is required.
 */

import React, { useState } from 'react';
import { Card, Button, Menu } from 'antd';
import { CheckOutlined, SettingOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    const newPressed = !pressed;
    setPressed(newPressed);
    if (newPressed) {
      onSuccess();
    }
  };

  return (
    <Card style={{ width: 600, padding: 0 }} bodyStyle={{ padding: 0 }}>
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div style={{ width: 160, borderRight: '1px solid #f0f0f0' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['view']}
            style={{ border: 'none', height: '100%' }}
            items={[
              { key: 'general', icon: <SettingOutlined />, label: 'General' },
              { key: 'view', icon: <EyeOutlined />, label: 'View' },
              { key: 'privacy', icon: <LockOutlined />, label: 'Privacy' },
            ]}
          />
        </div>
        
        {/* Main content */}
        <div style={{ flex: 1, padding: 24 }}>
          <div style={{ marginBottom: 8, fontSize: 12, color: '#999' }}>
            Settings ▸ View
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 500 }}>Compact view</div>
              <div style={{ fontSize: 12, color: '#999' }}>
                Compact view: {pressed ? 'On' : 'Off'}
              </div>
            </div>
            <Button
              type={pressed ? 'primary' : 'default'}
              icon={pressed ? <CheckOutlined /> : null}
              onClick={handleClick}
              aria-pressed={pressed}
              data-testid="compact-view-toggle"
            >
              Compact view
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
