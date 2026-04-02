'use client';

/**
 * switch-antd-T06: Dark theme: enable quiet hours
 *
 * Theme: dark (page background and card use dark theme tokens).
 * Layout: isolated_card centered in the viewport titled "Quiet hours".
 * The card contains a single Ant Design Switch labeled "Enable quiet hours" with helper text ("Mute notifications at night").
 * Initial state: the switch is OFF.
 * Feedback: clicking the switch immediately flips it to ON; no confirmation, no toast, and no other interactable elements are present.
 */

import React, { useState } from 'react';
import { Card, Switch } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card 
      title="Quiet hours" 
      style={{ width: 400 }}
      styles={{
        header: { borderBottom: '1px solid #424242' },
        body: { background: 'transparent' }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Enable quiet hours</span>
        <Switch
          checked={checked}
          onChange={handleChange}
          data-testid="quiet-hours-switch"
          aria-checked={checked}
        />
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        Mute notifications at night
      </div>
    </Card>
  );
}
