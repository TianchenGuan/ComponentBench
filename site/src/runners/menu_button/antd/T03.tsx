'use client';

/**
 * menu_button-antd-T03: Reset view density to default
 * 
 * Layout: isolated_card centered with title "Table preferences".
 * A single menu button labeled "View density: Compact" opens an AntD Dropdown menu.
 * Menu items are "Comfortable", "Compact", and "Reset to default".
 * 
 * Initial state: the current density is Compact.
 * Selecting "Reset to default" sets the density to Default and updates the button label.
 * A small inline hint text below the button updates to "Default applied" for feedback.
 * 
 * Success: The View density menu's value is set to "Default".
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [density, setDensity] = useState('Compact');
  const [feedback, setFeedback] = useState('');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (density === 'Default' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [density, successTriggered, onSuccess]);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'reset') {
      setDensity('Default');
      setFeedback('Default applied');
    } else if (key === 'comfortable') {
      setDensity('Comfortable');
      setFeedback('');
    } else if (key === 'compact') {
      setDensity('Compact');
      setFeedback('');
    }
  };

  const menuItems = [
    { key: 'comfortable', label: 'Comfortable' },
    { key: 'compact', label: 'Compact' },
    { key: 'reset', label: 'Reset to default' },
  ];

  return (
    <Card title="Table preferences" style={{ width: 400 }}>
      <div>
        <Dropdown
          menu={{ items: menuItems, onClick: handleMenuClick }}
          trigger={['click']}
        >
          <Button data-testid="menu-button-view-density">
            View density: {density} <DownOutlined />
          </Button>
        </Dropdown>
        {feedback && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
            {feedback}
          </div>
        )}
      </div>
    </Card>
  );
}
