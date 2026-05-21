'use client';

/**
 * switch-antd-T01: Enable email notifications
 *
 * Layout: isolated_card centered in the viewport. The card title is "Notifications".
 * The card contains a single Ant Design Switch to the right of the label "Email notifications".
 * The switch shows inner text: "ON" when enabled and "OFF" when disabled.
 * Initial state: the switch is OFF (unchecked) and no other controls are present besides a short helper sentence under the label.
 * There are no modals, drawers, or confirmation steps; toggling updates the switch state immediately with no toast.
 */

import React, { useState } from 'react';
import { Card, Switch } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card title="Notifications" style={{ width: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Email notifications</span>
        <Switch
          checked={checked}
          onChange={handleChange}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          data-testid="email-notifications-switch"
          aria-checked={checked}
        />
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        Receive email updates about your account activity.
      </div>
    </Card>
  );
}
