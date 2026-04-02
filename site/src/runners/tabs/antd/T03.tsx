'use client';

/**
 * tabs-antd-T03: Top-left quick nav: activate Reports tab
 *
 * Layout: an isolated card anchored near the top-left of the viewport titled "Analytics".
 * Component: Ant Design Tabs (type=line).
 * Tabs: "Summary", "Reports", "Exports", "Logs".
 * Initial state: "Summary" is active.
 * No additional controls or overlays. The only interaction needed is switching the active tab.
 * Visual feedback: underline/ink bar moves to the active tab; the panel heading updates to match the selected tab.
 * Success: Active tab is "Reports" (value/key: reports).
 */

import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState('summary');

  const handleChange = (key: string) => {
    setActiveKey(key);
    if (key === 'reports') {
      onSuccess();
    }
  };

  return (
    <Card title="Analytics" style={{ width: 480 }}>
      <Tabs
        activeKey={activeKey}
        onChange={handleChange}
        items={[
          { key: 'summary', label: 'Summary', children: <p>Summary panel</p> },
          { key: 'reports', label: 'Reports', children: <p>Reports panel</p> },
          { key: 'exports', label: 'Exports', children: <p>Exports panel</p> },
          { key: 'logs', label: 'Logs', children: <p>Logs panel</p> },
        ]}
      />
    </Card>
  );
}
