'use client';

/**
 * toggle_button-antd-T01: Pin button on (single toggle)
 *
 * Layout: isolated_card centered in the viewport. Theme is light with comfortable spacing and default scale.
 *
 * The card title is "Message actions". Inside the card there is a single Ant Design Button styled as a toggle button:
 * - Label: "Pin"
 * - It behaves like a WAI-ARIA toggle button (aria-pressed toggles between true/false).
 * - Visual states: Off = default button; On = primary/filled button with a small check indicator.
 *
 * Initial state: Off (not pressed). No other components affect success and there are no distractors.
 */

import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { CheckOutlined, PushpinOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    const newPressed = !pressed;
    setPressed(newPressed);
    if (newPressed) {
      onSuccess();
    }
  };

  return (
    <Card title="Message actions" style={{ width: 400 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button
          type={pressed ? 'primary' : 'default'}
          icon={pressed ? <CheckOutlined /> : <PushpinOutlined />}
          onClick={handleClick}
          aria-pressed={pressed}
          data-testid="pin-toggle"
        >
          Pin
        </Button>
        <div style={{ fontSize: 12, color: '#999' }}>
          Status: {pressed ? 'On' : 'Off'}
        </div>
      </div>
    </Card>
  );
}
