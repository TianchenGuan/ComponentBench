'use client';

/**
 * tabs-antd-T10: Unsaved changes: confirm to switch to Billing
 *
 * Layout: settings_panel titled "Profile Editor" centered in the viewport.
 * Component: Ant Design Tabs (type=line) with three tabs: "Profile", "Billing", "Security".
 * Initial state: "Profile" is active.
 * Inside the Profile panel, there is a small banner reading "Unsaved changes" (simulated) to justify confirmation behavior.
 * When the user attempts to change away from the active tab, an Ant Design Popconfirm appears near the tab bar with message "Discard changes?".
 * Popconfirm buttons: "Cancel" and primary "Discard".
 * Only after confirming discard does the active tab change to the newly selected tab.
 * Success: Active tab is "Billing" (value/key: billing).
 */

import React, { useState } from 'react';
import { Tabs, Card, Popconfirm, Alert } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState('profile');
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTabClick = (key: string) => {
    if (key !== activeKey) {
      setPendingKey(key);
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    if (pendingKey) {
      setActiveKey(pendingKey);
      if (pendingKey === 'billing') {
        onSuccess();
      }
    }
    setPendingKey(null);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setPendingKey(null);
    setShowConfirm(false);
  };

  return (
    <Card title="Profile Editor" style={{ width: 500 }}>
      <Popconfirm
        title="Discard changes?"
        open={showConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        okText="Discard"
        cancelText="Cancel"
        placement="top"
      >
        <div style={{ marginBottom: 16 }}>
          <Tabs
            activeKey={activeKey}
            onTabClick={handleTabClick}
            items={[
              {
                key: 'profile',
                label: 'Profile',
                children: (
                  <div>
                    <Alert
                      message="Unsaved changes"
                      type="warning"
                      showIcon
                      style={{ marginBottom: 12 }}
                    />
                    <p>Edit your profile details here.</p>
                  </div>
                ),
              },
              {
                key: 'billing',
                label: 'Billing',
                children: <p>Billing panel</p>,
              },
              {
                key: 'security',
                label: 'Security',
                children: <p>Security panel</p>,
              },
            ]}
          />
        </div>
      </Popconfirm>
    </Card>
  );
}
