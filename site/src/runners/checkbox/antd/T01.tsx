'use client';

/**
 * checkbox-antd-T01: Enable email notifications (single checkbox)
 *
 * Layout: isolated card centered in the viewport.
 * The card title is "Notifications". Inside the card there is one standard Ant Design Checkbox labeled "Email notifications", with a small non-interactive helper line below it.
 * Initial state: unchecked. There is no Save/Apply button; toggling the checkbox immediately updates the setting.
 * Distractors: none (no other checkboxes or toggles on the page).
 */

import React, { useState } from 'react';
import { Card, Checkbox } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (e: { target: { checked: boolean } }) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card title="Notifications" style={{ width: 400 }}>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        data-testid="cb-email-notifications"
      >
        Email notifications
      </Checkbox>
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        Receive email updates about your account activity.
      </div>
    </Card>
  );
}
