'use client';

/**
 * switch-antd-T07: Open drawer and enable Developer mode
 *
 * Layout: drawer_flow with the trigger controls placed near the top-right of the viewport.
 * The page shows a small summary card titled "Account" and a button labeled "Advanced settings".
 * The target Ant Design Switch is NOT visible initially. Clicking "Advanced settings" opens an AntD Drawer that slides in from the right.
 * Inside the drawer, there is a short list of settings with one switch labeled "Developer mode" (target) and one non-interactive text note below it.
 * Initial state: "Developer mode" is OFF.
 * Feedback: the switch toggles immediately when clicked; closing the drawer is not required for success.
 */

import React, { useState } from 'react';
import { Card, Button, Drawer, Switch } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [devModeChecked, setDevModeChecked] = useState(false);

  const handleSwitchChange = (newChecked: boolean) => {
    setDevModeChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <>
      <Card title="Account" style={{ width: 300 }}>
        <p style={{ color: '#666', marginBottom: 16 }}>Manage your account settings</p>
        <Button type="primary" onClick={() => setDrawerOpen(true)}>
          Advanced settings
        </Button>
      </Card>
      <Drawer
        title="Advanced settings"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        data-testid="advanced-settings-drawer"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span id="developer-mode-label">Developer mode</span>
          <Switch
            checked={devModeChecked}
            onChange={handleSwitchChange}
            data-testid="developer-mode-switch"
            aria-labelledby="developer-mode-label"
            aria-checked={devModeChecked}
          />
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
          Enables advanced debugging features and logs.
        </div>
      </Drawer>
    </>
  );
}
