'use client';

/**
 * menu-antd-T02: Enable sounds via checkable menu item
 * 
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A vertical Ant Design Menu titled "Preferences".
 * - Each menu row behaves like a checkbox-style toggle: a checkmark indicator appears on the left when enabled.
 *
 * Items and initial state:
 * - Show hints: ON (checked)
 * - Enable sounds: OFF (unchecked) ← target
 * - Send weekly summary: OFF (unchecked)
 *
 * Interaction/feedback:
 * - Clicking an item toggles that item's checked state immediately.
 * - A small status line under the menu mirrors the toggle states.
 *
 * Success: The "Enable sounds" menu item is in the checked/on state.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

interface ToggleState {
  'Show hints': boolean;
  'Enable sounds': boolean;
  'Send weekly summary': boolean;
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [toggles, setToggles] = useState<ToggleState>({
    'Show hints': true,
    'Enable sounds': false,
    'Send weekly summary': false,
  });
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (toggles['Enable sounds'] && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [toggles, successTriggered, onSuccess]);

  const handleToggle = (key: keyof ToggleState) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = (Object.keys(toggles) as Array<keyof ToggleState>).map((key) => ({
    key,
    label: key,
    icon: toggles[key] ? <CheckOutlined style={{ color: '#52c41a' }} /> : <span style={{ width: 14, display: 'inline-block' }} />,
    'data-checked': toggles[key],
  }));

  return (
    <Card style={{ width: 400 }}>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: 500 }}>
        Preferences
      </div>
      <Menu
        mode="inline"
        selectable={false}
        items={menuItems}
        onClick={({ key }) => handleToggle(key as keyof ToggleState)}
        style={{ borderRight: 'none' }}
        data-testid="menu-preferences"
      />
      <div style={{ marginTop: 16, fontSize: 12, color: '#666', borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
        {(Object.entries(toggles) as Array<[keyof ToggleState, boolean]>).map(([key, value]) => (
          <div key={key} data-testid={`status-${key.toLowerCase().replace(/ /g, '-')}`}>
            {key}: <strong>{value ? 'On' : 'Off'}</strong>
          </div>
        ))}
      </div>
    </Card>
  );
}
