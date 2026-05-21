'use client';

/**
 * toggle_button-antd-T06: Enable delete mode with confirmation popover
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 *
 * The card is titled "Danger zone" and contains one toggle-style AntD Button labeled "Delete mode".
 * - Initial state: Off.
 * - Clicking the button opens an AntD Popconfirm anchored to the button.
 * - The Popconfirm text reads: "Turn on Delete mode?"
 * - Two buttons are inside the popover: "Cancel" and "Confirm".
 *
 * Behavior:
 * - The toggle does NOT change permanently until "Confirm" is clicked.
 * - If "Cancel" is clicked or the popover is dismissed, the toggle remains Off.
 * - After confirming, the button becomes pressed (aria-pressed=true) and the helper line updates to "Delete mode: On".
 */

import React, { useState } from 'react';
import { Card, Button, Popconfirm } from 'antd';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [pressed, setPressed] = useState(false);

  const handleConfirm = () => {
    setPressed(true);
    onSuccess();
  };

  return (
    <Card title="Danger zone" style={{ width: 400 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Popconfirm
          title="Turn on Delete mode?"
          onConfirm={handleConfirm}
          okText="Confirm"
          cancelText="Cancel"
          disabled={pressed}
        >
          <Button
            type={pressed ? 'primary' : 'default'}
            danger={pressed}
            icon={pressed ? <CheckOutlined /> : <DeleteOutlined />}
            aria-pressed={pressed}
            data-testid="delete-mode-toggle"
          >
            Delete mode
          </Button>
        </Popconfirm>
        <div style={{ fontSize: 12, color: '#999' }}>
          Delete mode: {pressed ? 'On' : 'Off'}
        </div>
        <div style={{ fontSize: 11, color: '#bbb' }}>
          (Confirmation required)
        </div>
      </div>
    </Card>
  );
}
