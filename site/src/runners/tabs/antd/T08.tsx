'use client';

/**
 * tabs-antd-T08: Overflow tabs: find Audit Log in More menu
 *
 * Layout: isolated_card centered titled "Compliance".
 * Component: Ant Design Tabs (type=line) inside a narrow container so not all tabs fit on one row.
 * There are 12+ tabs with short labels, including: "Overview", "Policies", "Events", "Audit", "Audit Log", "Audit Trail", "Exports", "Retention", "Alerts", "Keys", "Webhooks", "About".
 * Initial state: "Overview" is active.
 * Because the container is narrow, AntD collapses overflowing tabs into a "More" dropdown/ellipsis control at the end of the tab bar.
 * The target tab "Audit Log" is not visible initially and appears only inside the "More" menu until selected.
 * No other distractor components on the page.
 * Success: Active tab is "Audit Log" (value/key: audit-log).
 */

import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState('overview');

  const handleChange = (key: string) => {
    setActiveKey(key);
    if (key === 'audit-log') {
      onSuccess();
    }
  };

  const items = [
    { key: 'overview', label: 'Overview', children: <p>Overview panel</p> },
    { key: 'policies', label: 'Policies', children: <p>Policies panel</p> },
    { key: 'events', label: 'Events', children: <p>Events panel</p> },
    { key: 'audit', label: 'Audit', children: <p>Audit panel</p> },
    { key: 'audit-log', label: 'Audit Log', children: <p>Audit Log panel</p> },
    { key: 'audit-trail', label: 'Audit Trail', children: <p>Audit Trail panel</p> },
    { key: 'exports', label: 'Exports', children: <p>Exports panel</p> },
    { key: 'retention', label: 'Retention', children: <p>Retention panel</p> },
    { key: 'alerts', label: 'Alerts', children: <p>Alerts panel</p> },
    { key: 'keys', label: 'Keys', children: <p>Keys panel</p> },
    { key: 'webhooks', label: 'Webhooks', children: <p>Webhooks panel</p> },
    { key: 'about', label: 'About', children: <p>About panel</p> },
  ];

  return (
    <Card title="Compliance" style={{ width: 400 }}>
      <Tabs
        activeKey={activeKey}
        onChange={handleChange}
        items={items}
        data-testid="tabs-more"
      />
    </Card>
  );
}
