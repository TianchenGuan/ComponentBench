'use client';

/**
 * icon_button-antd-T08: Toggle Mute alerts in Secondary toolbar (two toolbars)
 *
 * Layout: isolated_card centered in the viewport.
 * The card contains two stacked toolbars with identical controls.
 * Each toolbar has two small, compact icon-only AntD Buttons: "Mute alerts" and "Pin".
 * Initial state: both toolbars show "Mute alerts: Off".
 * 
 * Success: The "Mute alerts" icon button in the Secondary toolbar has aria-pressed="true".
 */

import React, { useState } from 'react';
import { Button, Card, Space, Tag } from 'antd';
import { BellOutlined, PushpinOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

interface ToolbarState {
  muted: boolean;
  pinned: boolean;
}

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [primary, setPrimary] = useState<ToolbarState>({ muted: false, pinned: false });
  const [secondary, setSecondary] = useState<ToolbarState>({ muted: false, pinned: false });

  const handlePrimaryMute = () => {
    setPrimary(prev => ({ ...prev, muted: !prev.muted }));
  };

  const handleSecondaryMute = () => {
    const newState = !secondary.muted;
    setSecondary(prev => ({ ...prev, muted: newState }));
    if (newState) {
      onSuccess();
    }
  };

  const renderToolbar = (
    name: string, 
    state: ToolbarState, 
    onMuteClick: () => void,
    onPinClick: () => void,
    testIdPrefix: string
  ) => (
    <div 
      style={{ 
        padding: 12, 
        background: '#fafafa', 
        borderRadius: 6, 
        marginBottom: 12 
      }}
      data-toolbar={name.toLowerCase()}
    >
      <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 13 }}>{name} toolbar</div>
      <Space size="middle">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            size="small"
            type="text"
            icon={<BellOutlined />}
            onClick={onMuteClick}
            aria-pressed={state.muted}
            aria-label="Mute alerts"
            data-testid={`${testIdPrefix}-mute`}
            style={{ 
              color: state.muted ? '#1677ff' : undefined,
              background: state.muted ? '#e6f4ff' : undefined,
            }}
          />
          <span style={{ fontSize: 12 }}>Mute alerts</span>
          <Tag color={state.muted ? 'green' : 'default'} style={{ margin: 0, fontSize: 10 }}>
            {state.muted ? 'On' : 'Off'}
          </Tag>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            size="small"
            type="text"
            icon={<PushpinOutlined />}
            onClick={onPinClick}
            aria-pressed={state.pinned}
            aria-label="Pin"
            data-testid={`${testIdPrefix}-pin`}
          />
          <span style={{ fontSize: 12 }}>Pin</span>
          <Tag color={state.pinned ? 'green' : 'default'} style={{ margin: 0, fontSize: 10 }}>
            {state.pinned ? 'On' : 'Off'}
          </Tag>
        </div>
      </Space>
    </div>
  );

  return (
    <Card title="Toolbar settings" style={{ width: 450 }}>
      {renderToolbar(
        'Primary',
        primary,
        handlePrimaryMute,
        () => setPrimary(prev => ({ ...prev, pinned: !prev.pinned })),
        'antd-icon-btn-primary'
      )}
      {renderToolbar(
        'Secondary',
        secondary,
        handleSecondaryMute,
        () => setSecondary(prev => ({ ...prev, pinned: !prev.pinned })),
        'antd-icon-btn-secondary'
      )}
    </Card>
  );
}
