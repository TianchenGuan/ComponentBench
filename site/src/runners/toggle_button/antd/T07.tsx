'use client';

/**
 * toggle_button-antd-T07: Match the Sync toggle to a visual target
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale. Guidance is visual.
 *
 * The card title is "Sync". At the top-right of the card there is a small "Target state" preview widget:
 * - It shows a miniature toggle button rendering (not interactive) in the desired state.
 * - The preview is clearly labeled "Target state" and visually indicates ON vs OFF via filled vs outline styling.
 *
 * Below the preview is the real interactive AntD toggle-style Button labeled "Sync".
 * - aria-pressed indicates pressed state.
 * - A helper line below reads "Sync toggle: Off/On" for immediate feedback (but the instruction does not tell you which one to choose).
 *
 * Initial state: the Sync toggle starts Off. The target preview shows the desired state (ON for this instance).
 */

import React, { useState } from 'react';
import { Card, Button, Tag } from 'antd';
import { SyncOutlined, CheckOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [pressed, setPressed] = useState(false);
  const targetState = true; // Target is ON

  const handleClick = () => {
    const newPressed = !pressed;
    setPressed(newPressed);
    if (newPressed === targetState) {
      onSuccess();
    }
  };

  return (
    <Card title="Sync" style={{ width: 400 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Target state preview */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#999' }}>Target state:</span>
          <Tag
            color={targetState ? 'blue' : 'default'}
            icon={targetState ? <CheckOutlined /> : null}
            style={{ margin: 0 }}
          >
            {targetState ? 'ON' : 'OFF'}
          </Tag>
        </div>

        {/* Interactive toggle */}
        <div>
          <Button
            type={pressed ? 'primary' : 'default'}
            icon={pressed ? <CheckOutlined /> : <SyncOutlined />}
            onClick={handleClick}
            aria-pressed={pressed}
            data-testid="sync-toggle"
          >
            Sync
          </Button>
        </div>

        <div style={{ fontSize: 12, color: '#999' }}>
          Sync toggle: {pressed ? 'On' : 'Off'}
        </div>
      </div>
    </Card>
  );
}
