'use client';

/**
 * tabs-antd-T04: Two tab sets: switch Project tabs to Members
 *
 * Layout: an isolated_card page with two separate cards stacked vertically.
 * Card 1 title: "Account" and contains Ant Design Tabs with tabs "Profile", "Security", "Billing".
 * Card 2 title: "Project" and contains Ant Design Tabs with tabs "Overview", "Members", "Billing".
 * Initial state: Account card is on "Profile"; Project card is on "Overview".
 * There is intentionally a shared label ("Billing") across both tab sets to test correct-instance selection.
 * No other interactive UI on the page.
 * Success: In the "Project" tabs instance, the active tab is "Members" (value/key: members).
 */

import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [accountActiveKey, setAccountActiveKey] = useState('profile');
  const [projectActiveKey, setProjectActiveKey] = useState('overview');

  const handleProjectChange = (key: string) => {
    setProjectActiveKey(key);
    if (key === 'members') {
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card title="Account" style={{ width: 500 }} data-testid="tabs-instance-account">
        <Tabs
          activeKey={accountActiveKey}
          onChange={setAccountActiveKey}
          items={[
            { key: 'profile', label: 'Profile', children: <p>Account Profile panel</p> },
            { key: 'security', label: 'Security', children: <p>Account Security panel</p> },
            { key: 'billing', label: 'Billing', children: <p>Account Billing panel</p> },
          ]}
        />
      </Card>
      <Card title="Project" style={{ width: 500 }} data-testid="tabs-instance-project">
        <Tabs
          activeKey={projectActiveKey}
          onChange={handleProjectChange}
          items={[
            { key: 'overview', label: 'Overview', children: <p>Project Overview panel</p> },
            { key: 'members', label: 'Members', children: <p>Project Members panel</p> },
            { key: 'billing', label: 'Billing', children: <p>Project Billing panel</p> },
          ]}
        />
      </Card>
    </div>
  );
}
