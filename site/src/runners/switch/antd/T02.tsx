'use client';

/**
 * switch-antd-T02: Disable beta banner
 *
 * Layout: isolated_card in the center of the page titled "Home screen".
 * A single Ant Design Switch appears next to the label "Show beta banner", with helper text explaining it shows a "BETA" ribbon.
 * The switch uses the default AntD styling (no loading spinner) and updates immediately when clicked.
 * Initial state: the switch is ON (checked). There are no other interactive elements in the card.
 */

import React, { useState } from 'react';
import { Card, Switch } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(true);

  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    if (!newChecked) {
      onSuccess();
    }
  };

  return (
    <Card title="Home screen" style={{ width: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Show beta banner</span>
        <Switch
          checked={checked}
          onChange={handleChange}
          data-testid="beta-banner-switch"
          aria-checked={checked}
        />
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        Shows a "BETA" ribbon on the home screen.
      </div>
    </Card>
  );
}
