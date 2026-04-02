'use client';

/**
 * tabs-antd-T09: Three instances: select Refunds in Billing tabs
 *
 * Layout: isolated_card scene with three compact cards arranged in a 2-column grid, anchored toward the bottom-right of the viewport.
 * Each card contains its own Ant Design Tabs (type=line), and each card has a bold title directly above its tab list:
 *   - Card "User" tabs: "Overview", "Activity", "Permissions" (initially on "Overview").
 *   - Card "System" tabs: "Overview", "Logs", "Alerts" (initially on "Overview").
 *   - Card "Billing" tabs: "Overview", "Invoices", "Refunds" (initially on "Overview").
 * The repeated "Overview" label across instances is intentional.
 * No other interactive elements; the only required action is selecting the correct tab in the correct card.
 * Success: In the "Billing" tabs instance, the active tab is "Refunds" (value/key: refunds).
 */

import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [userActiveKey, setUserActiveKey] = useState('overview');
  const [systemActiveKey, setSystemActiveKey] = useState('overview');
  const [billingActiveKey, setBillingActiveKey] = useState('overview');

  const handleBillingChange = (key: string) => {
    setBillingActiveKey(key);
    if (key === 'refunds') {
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: 600 }}>
      <Card title="User" size="small" data-testid="tabs-instance-user">
        <Tabs
          activeKey={userActiveKey}
          onChange={setUserActiveKey}
          size="small"
          items={[
            { key: 'overview', label: 'Overview', children: <p style={{ fontSize: 12 }}>User Overview</p> },
            { key: 'activity', label: 'Activity', children: <p style={{ fontSize: 12 }}>User Activity</p> },
            { key: 'permissions', label: 'Permissions', children: <p style={{ fontSize: 12 }}>User Permissions</p> },
          ]}
        />
      </Card>
      <Card title="System" size="small" data-testid="tabs-instance-system">
        <Tabs
          activeKey={systemActiveKey}
          onChange={setSystemActiveKey}
          size="small"
          items={[
            { key: 'overview', label: 'Overview', children: <p style={{ fontSize: 12 }}>System Overview</p> },
            { key: 'logs', label: 'Logs', children: <p style={{ fontSize: 12 }}>System Logs</p> },
            { key: 'alerts', label: 'Alerts', children: <p style={{ fontSize: 12 }}>System Alerts</p> },
          ]}
        />
      </Card>
      <Card title="Billing" size="small" style={{ gridColumn: 'span 2' }} data-testid="tabs-instance-billing">
        <Tabs
          activeKey={billingActiveKey}
          onChange={handleBillingChange}
          size="small"
          items={[
            { key: 'overview', label: 'Overview', children: <p style={{ fontSize: 12 }}>Billing Overview</p> },
            { key: 'invoices', label: 'Invoices', children: <p style={{ fontSize: 12 }}>Billing Invoices</p> },
            { key: 'refunds', label: 'Refunds', children: <p style={{ fontSize: 12 }}>Billing Refunds</p> },
          ]}
        />
      </Card>
    </div>
  );
}
