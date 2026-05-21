'use client';

/**
 * checkbox_tristate-antd-T10: Settings scroll: set Sync health to Unchecked
 *
 * Layout: settings_panel page with a left sidebar and a scrollable main content column.
 * The main column contains a long list of settings grouped under headings ("General", "Notifications", "Sync").
 * The target tri-state checkbox is in the "Sync" group, which is below the initial fold;
 * the agent must scroll the main content to reach it.
 *
 * Target component: one Ant Design tri-state checkbox labeled "Sync health"
 * with helper text ("Allow partial sync when offline").
 * Initial state: Indeterminate.
 *
 * Clutter: medium. Nearby settings include switches and radio buttons with similar typography.
 * No Save/Apply button; the checkbox state updates immediately.
 * 
 * Success: checkbox is Unchecked.
 */

import React, { useState } from 'react';
import { Checkbox, Switch, Radio, Card } from 'antd';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('indeterminate');
  const [general1, setGeneral1] = useState(true);
  const [general2, setGeneral2] = useState(false);
  const [notif1, setNotif1] = useState(true);
  const [notifRadio, setNotifRadio] = useState('email');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'unchecked') {
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', width: 700, height: 400 }}>
      {/* Sidebar */}
      <div style={{ width: 160, borderRight: '1px solid #f0f0f0', padding: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Settings</div>
        <div style={{ color: '#999', marginBottom: 8, cursor: 'pointer' }}>General</div>
        <div style={{ color: '#999', marginBottom: 8, cursor: 'pointer' }}>Notifications</div>
        <div style={{ color: '#1890ff', marginBottom: 8, cursor: 'pointer' }}>Sync</div>
      </div>

      {/* Main content - scrollable */}
      <div
        style={{ flex: 1, padding: 16, overflowY: 'auto' }}
        data-testid="settings-scroll-container"
      >
        {/* General section */}
        <Card size="small" title="General" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Auto-save drafts</span>
            <Switch size="small" checked={general1} onChange={setGeneral1} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Show tips</span>
            <Switch size="small" checked={general2} onChange={setGeneral2} />
          </div>
        </Card>

        {/* Notifications section */}
        <Card size="small" title="Notifications" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Enable notifications</span>
            <Switch size="small" checked={notif1} onChange={setNotif1} />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>Notification method</div>
            <Radio.Group value={notifRadio} onChange={(e) => setNotifRadio(e.target.value)}>
              <Radio value="email">Email</Radio>
              <Radio value="push">Push</Radio>
              <Radio value="sms">SMS</Radio>
            </Radio.Group>
          </div>
        </Card>

        {/* Some filler content to push Sync below fold */}
        <Card size="small" title="Privacy" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span>Share usage data</span>
            <Switch size="small" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Allow analytics</span>
            <Switch size="small" />
          </div>
        </Card>

        {/* Sync section - below fold */}
        <Card size="small" title="Sync" style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Auto-sync</span>
              <Switch size="small" defaultChecked />
            </div>
          </div>
          <div>
            <div onClick={handleClick} style={{ cursor: 'pointer' }}>
              <Checkbox
                checked={state === 'checked'}
                indeterminate={state === 'indeterminate'}
                data-testid="sync-health-checkbox"
              >
                Sync health
              </Checkbox>
            </div>
            <div style={{ marginTop: 4, marginLeft: 24, fontSize: 12, color: '#999' }}>
              Allow partial sync when offline
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
