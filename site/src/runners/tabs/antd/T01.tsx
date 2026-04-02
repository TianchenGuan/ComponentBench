'use client';

/**
 * tabs-antd-T01: Basic switch to Details tab
 *
 * Layout: an isolated card centered in the viewport titled "Project".
 * Component: Ant Design Tabs (type=line, default size).
 * Tabs shown left-to-right: "Overview", "Details", "Activity".
 * Initial state: "Overview" is the active tab and its panel text reads "Overview panel".
 * No other tabs on the page. No overlays, menus, or confirmation dialogs.
 * Selecting a tab updates the ink bar underline and swaps the visible tab panel immediately.
 * Success: Active tab is "Details" (value/key: details).
 */

import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState('overview');

  const handleChange = (key: string) => {
    setActiveKey(key);
    if (key === 'details') {
      onSuccess();
    }
  };

  return (
    <Card title="Project" style={{ width: 500 }} data-testid="tabs-project">
      <Tabs
        activeKey={activeKey}
        onChange={handleChange}
        items={[
          { key: 'overview', label: 'Overview', children: <p>Overview panel</p> },
          { key: 'details', label: 'Details', children: <p>Details panel</p> },
          { key: 'activity', label: 'Activity', children: <p>Activity panel</p> },
        ]}
      />
    </Card>
  );
}
