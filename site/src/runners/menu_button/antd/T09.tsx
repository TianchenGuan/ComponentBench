'use client';

/**
 * menu_button-antd-T09: Switch workspace via long scrollable menu
 * 
 * Layout: isolated_card placed near the bottom-left of the viewport.
 * Component scale is small (the trigger button and menu font are reduced).
 * There is one menu button labeled "Switch workspace: Workspace 1".
 * Clicking opens a dropdown with a scrollable Menu list (height constrained).
 * The list contains 60 sequential options: "Workspace 1" through "Workspace 60".
 * 
 * To reach "Workspace 42", the user must scroll within the menu popup.
 * Selecting an item closes the menu and updates the trigger label.
 * 
 * Initial state: Workspace 1 is selected.
 * Success: The selected workspace value equals "Workspace 42".
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const workspaces = Array.from({ length: 60 }, (_, i) => ({
  key: `workspace-${i + 1}`,
  label: `Workspace ${i + 1}`,
}));

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [selectedWorkspace, setSelectedWorkspace] = useState('Workspace 1');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedWorkspace === 'Workspace 42' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedWorkspace, successTriggered, onSuccess]);

  const handleMenuClick = ({ key }: { key: string }) => {
    const num = parseInt(key.replace('workspace-', ''), 10);
    setSelectedWorkspace(`Workspace ${num}`);
  };

  const dropdownContent = (
    <div
      style={{
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        maxHeight: 250,
        overflowY: 'auto',
        minWidth: 180,
      }}
    >
      {workspaces.map(ws => (
        <div
          key={ws.key}
          onClick={() => handleMenuClick({ key: ws.key })}
          style={{
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: 12,
            backgroundColor: ws.label === selectedWorkspace ? '#f0f5ff' : 'transparent',
          }}
        >
          {ws.label}
        </div>
      ))}
    </div>
  );

  return (
    <Card title="Workspaces" style={{ width: 280 }} styles={{ body: { padding: 12 } }}>
      <Dropdown
        dropdownRender={() => dropdownContent}
        trigger={['click']}
      >
        <Button size="small" data-testid="menu-button-switch-workspace" style={{ fontSize: 12 }}>
          Switch workspace: {selectedWorkspace} <DownOutlined />
        </Button>
      </Dropdown>
    </Card>
  );
}
