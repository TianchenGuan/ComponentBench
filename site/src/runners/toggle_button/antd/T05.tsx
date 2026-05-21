'use client';

/**
 * toggle_button-antd-T05: Enable email alerts for Secondary profile (2 instances)
 *
 * Layout: form_section centered on the page. Light theme, comfortable spacing, default scale. Clutter is low.
 *
 * The form section is titled "Notification preferences" and contains two visually similar toggle rows:
 * - Row 1 label: "Email alerts — Primary" (toggle button on the right)
 * - Row 2 label: "Email alerts — Secondary" (toggle button on the right)
 *
 * Each row uses an AntD Button styled as a toggle button with aria-pressed.
 * Initial state: both toggles are Off (not pressed).
 *
 * The two rows look almost identical except for the "Primary" vs "Secondary" label, so choosing the correct instance matters.
 */

import React, { useState } from 'react';
import { Card, Button, Divider } from 'antd';
import { CheckOutlined, MailOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryPressed, setPrimaryPressed] = useState(false);
  const [secondaryPressed, setSecondaryPressed] = useState(false);

  const handlePrimaryClick = () => {
    setPrimaryPressed(!primaryPressed);
    // Clicking Primary does NOT trigger success
  };

  const handleSecondaryClick = () => {
    const newPressed = !secondaryPressed;
    setSecondaryPressed(newPressed);
    if (newPressed) {
      onSuccess();
    }
  };

  return (
    <Card title="Notification preferences" style={{ width: 500 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Primary row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 500 }}>Email alerts — Primary</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {primaryPressed ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          <Button
            type={primaryPressed ? 'primary' : 'default'}
            icon={primaryPressed ? <CheckOutlined /> : <MailOutlined />}
            onClick={handlePrimaryClick}
            aria-pressed={primaryPressed}
            data-testid="toggle-email-primary"
          >
            {primaryPressed ? 'On' : 'Off'}
          </Button>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* Secondary row - TARGET */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 500 }}>Email alerts — Secondary</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {secondaryPressed ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          <Button
            type={secondaryPressed ? 'primary' : 'default'}
            icon={secondaryPressed ? <CheckOutlined /> : <MailOutlined />}
            onClick={handleSecondaryClick}
            aria-pressed={secondaryPressed}
            data-testid="toggle-email-secondary"
          >
            {secondaryPressed ? 'On' : 'Off'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
