'use client';

/**
 * switch-antd-T09: Confirm to turn off two-factor authentication
 *
 * Layout: settings_panel centered in the viewport titled "Security".
 * The panel contains one primary setting row with an Ant Design Switch labeled "Two-factor authentication".
 * Initial state: the switch is ON (2FA enabled).
 * Interaction behavior: when you try to turn the switch OFF, an AntD confirmation popover appears anchored near the switch.
 * The popover text says "Turn off two-factor authentication?" and has two buttons: "Cancel" and "Confirm".
 * Feedback dynamics: the switch visually flips to OFF only after clicking "Confirm"; clicking "Cancel" keeps it ON.
 * Clutter: low — a few non-interactive helper paragraphs appear in the panel, but no other toggles are present.
 */

import React, { useState } from 'react';
import { Card, Switch, Popconfirm } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSwitchClick = () => {
    if (checked) {
      // Trying to turn OFF, show confirmation
      setConfirmOpen(true);
    } else {
      // Turning ON, just toggle
      setChecked(true);
    }
  };

  const handleConfirm = () => {
    setChecked(false);
    setConfirmOpen(false);
    onSuccess();
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  return (
    <Card title="Security" style={{ width: 450 }}>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Two-factor authentication adds an extra layer of security to your account.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div id="two-factor-label">Two-factor authentication</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            Require a code when signing in
          </div>
        </div>
        <Popconfirm
          title="Turn off two-factor authentication?"
          open={confirmOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          okText="Confirm"
          cancelText="Cancel"
        >
          <Switch
            checked={checked}
            onClick={handleSwitchClick}
            data-testid="two-factor-switch"
            aria-labelledby="two-factor-label"
            aria-checked={checked}
          />
        </Popconfirm>
      </div>
      <p style={{ color: '#999', fontSize: 12, marginTop: 16 }}>
        You will be asked to enter a verification code each time you sign in.
      </p>
    </Card>
  );
}
