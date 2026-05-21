'use client';

/**
 * tabs-antd-T06: Compact small tabs: reset to Overview
 *
 * Layout: isolated_card centered titled "Limits".
 * Universal variations: spacing is compact and the component scale is small.
 * Component: Ant Design Tabs (type=line, size=small).
 * Tabs: "Overview", "Advanced", "API", "Changelog".
 * Initial state: "Advanced" is active to start.
 * An extra control appears on the right side of the tab bar (tabBarExtraContent): a link-button labeled "Reset".
 * Clicking "Reset" programmatically returns the active tab to "Overview" (same result as clicking the Overview tab).
 * No confirmations or toasts.
 * Success: Active tab is "Overview" (value/key: overview).
 */

import React, { useState } from 'react';
import { Tabs, Card, Button } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState('advanced');

  const handleChange = (key: string) => {
    setActiveKey(key);
    if (key === 'overview') {
      onSuccess();
    }
  };

  const handleReset = () => {
    setActiveKey('overview');
    onSuccess();
  };

  return (
    <Card
      title="Limits"
      style={{ width: 450, padding: '8px' }}
      styles={{ body: { padding: 12 } }}
    >
      <Tabs
        activeKey={activeKey}
        onChange={handleChange}
        size="small"
        tabBarExtraContent={
          <Button type="link" size="small" onClick={handleReset} data-testid="tabs-reset">
            Reset
          </Button>
        }
        items={[
          { key: 'overview', label: 'Overview', children: <p style={{ fontSize: 12 }}>Overview panel</p> },
          { key: 'advanced', label: 'Advanced', children: <p style={{ fontSize: 12 }}>Advanced panel</p> },
          { key: 'api', label: 'API', children: <p style={{ fontSize: 12 }}>API panel</p> },
          { key: 'changelog', label: 'Changelog', children: <p style={{ fontSize: 12 }}>Changelog panel</p> },
        ]}
      />
    </Card>
  );
}
