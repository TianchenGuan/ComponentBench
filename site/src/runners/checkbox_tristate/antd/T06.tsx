'use client';

/**
 * checkbox_tristate-antd-T06: Compact panel: disable daily summary emails (Unchecked)
 *
 * Layout: settings_panel anchored in the top-right of the viewport.
 * The panel uses compact spacing and the tri-state checkbox is rendered in a small size variant.
 * Target component: one Ant Design tri-state checkbox labeled "Daily summary emails".
 * Initial state: Checked.
 * 
 * Clutter: medium but realistic. The same panel includes:
 * - Two Ant Design Switch toggles ("Push notifications", "Sound effects") as distractors
 * - A disabled tri-state checkbox ("Admin-only setting") shown below, clearly disabled
 *
 * No confirmation button is required; changes are immediate.
 * Success: checkbox is Unchecked.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Switch, Space } from 'antd';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('checked');
  const [pushNotif, setPushNotif] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'unchecked') {
      onSuccess();
    }
  };

  return (
    <Card size="small" style={{ width: 280 }}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
          <Checkbox
            checked={state === 'checked'}
            indeterminate={state === 'indeterminate'}
            data-testid="daily-summary-checkbox"
            style={{ fontSize: 12 }}
          >
            <span style={{ fontSize: 12 }}>Daily summary emails</span>
          </Checkbox>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12 }}>Push notifications</span>
          <Switch size="small" checked={pushNotif} onChange={setPushNotif} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12 }}>Sound effects</span>
          <Switch size="small" checked={soundEffects} onChange={setSoundEffects} />
        </div>
        
        <div style={{ marginTop: 4 }}>
          <Checkbox disabled indeterminate style={{ fontSize: 12 }}>
            <span style={{ fontSize: 12, color: '#999' }}>Admin-only setting</span>
          </Checkbox>
        </div>
      </Space>
    </Card>
  );
}
