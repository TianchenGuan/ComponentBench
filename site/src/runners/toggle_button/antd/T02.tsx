'use client';

/**
 * toggle_button-antd-T02: Mute button off (single toggle)
 *
 * Layout: isolated_card, centered. Light theme, comfortable spacing, default scale.
 *
 * The card is titled "Call controls". It contains a single toggle-style Ant Design Button:
 * - Label: "Mute"
 * - Pressed state indicates that audio is muted.
 * - Off = default outline button; On = filled/primary button.
 * - aria-pressed reflects the pressed state.
 *
 * Initial state: On (pressed). There are no additional controls or clutter.
 */

import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [pressed, setPressed] = useState(true); // Initial state: On (pressed)

  const handleClick = () => {
    const newPressed = !pressed;
    setPressed(newPressed);
    if (!newPressed) {
      // Success when turned OFF
      onSuccess();
    }
  };

  return (
    <Card title="Call controls" style={{ width: 400 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button
          type={pressed ? 'primary' : 'default'}
          icon={pressed ? <AudioMutedOutlined /> : <AudioOutlined />}
          onClick={handleClick}
          aria-pressed={pressed}
          data-testid="mute-toggle"
        >
          Mute
        </Button>
        <div style={{ fontSize: 12, color: '#999' }}>
          Status: {pressed ? 'On' : 'Off'}
        </div>
      </div>
    </Card>
  );
}
