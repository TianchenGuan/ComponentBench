'use client';

/**
 * collapsible_disclosure-antd-T09: Compact + small: expand exactly Security and Privacy
 * 
 * A dense "Account controls" card is displayed with compact spacing and a small component size.
 * 
 * - Layout: isolated_card, centered.
 * - Spacing: compact (reduced padding between rows).
 * - Scale: small (AntD Collapse rendered with size="small"; smaller click targets).
 * - Component: one AntD Collapse with multi-expand enabled.
 * - Panels (6): "Profile", "Security", "Privacy", "Notifications", "Devices", "Sessions".
 * - Initial state: "Profile" and "Devices" are expanded; the rest are collapsed.
 * - There are no other interactive components; success depends only on the exact set of expanded panels.
 * 
 * Success: expanded_panels equals exactly ["Security", "Privacy"]
 */

import React, { useState, useEffect, useRef } from 'react';
import { Collapse, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string[]>(['profile', 'devices']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success when exactly Security and Privacy are expanded
    const sortedKeys = [...activeKey].sort();
    if (
      sortedKeys.length === 2 &&
      sortedKeys[0] === 'privacy' &&
      sortedKeys[1] === 'security' &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  return (
    <Card 
      title="Account controls" 
      size="small"
      style={{ width: 400 }}
      bodyStyle={{ padding: 8 }}
    >
      <Collapse
        size="small"
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key as string[])}
        data-testid="collapse-root"
        items={[
          {
            key: 'profile',
            label: 'Profile',
            children: <p style={{ margin: 0, fontSize: 12 }}>Your profile information.</p>,
          },
          {
            key: 'security',
            label: 'Security',
            children: <p style={{ margin: 0, fontSize: 12 }}>Security settings and 2FA.</p>,
          },
          {
            key: 'privacy',
            label: 'Privacy',
            children: <p style={{ margin: 0, fontSize: 12 }}>Privacy controls and data sharing.</p>,
          },
          {
            key: 'notifications',
            label: 'Notifications',
            children: <p style={{ margin: 0, fontSize: 12 }}>Notification preferences.</p>,
          },
          {
            key: 'devices',
            label: 'Devices',
            children: <p style={{ margin: 0, fontSize: 12 }}>Manage connected devices.</p>,
          },
          {
            key: 'sessions',
            label: 'Sessions',
            children: <p style={{ margin: 0, fontSize: 12 }}>Active login sessions.</p>,
          },
        ]}
      />
    </Card>
  );
}
