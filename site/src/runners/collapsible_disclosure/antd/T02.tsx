'use client';

/**
 * collapsible_disclosure-antd-T02: Account sections: switch to Billing (accordion mode)
 * 
 * A single centered card titled "Account sections" contains an Ant Design Collapse configured in accordion mode.
 * 
 * - Layout: isolated_card, centered.
 * - Component: one AntD Collapse with accordion behavior (only one panel open at a time).
 * - Panels: "Overview", "Billing", "Security".
 * - Initial state: "Overview" is expanded; "Billing" and "Security" are collapsed.
 * - Interaction: clicking a panel header expands it and collapses the previously open panel automatically.
 * 
 * Success: expanded_panels equals exactly ["Billing"]
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string | string[]>('overview');

  useEffect(() => {
    const key = Array.isArray(activeKey) ? activeKey[0] : activeKey;
    if (key === 'billing') {
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  return (
    <Card title="Account sections" style={{ width: 500 }}>
      <Collapse
        accordion
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        data-testid="collapse-root"
        items={[
          {
            key: 'overview',
            label: 'Overview',
            children: (
              <p>
                Your account overview shows a summary of your recent activity, 
                subscription status, and quick links to common actions.
              </p>
            ),
          },
          {
            key: 'billing',
            label: 'Billing',
            children: (
              <p>
                Manage your payment methods, view billing history, and update 
                your subscription plan here.
              </p>
            ),
          },
          {
            key: 'security',
            label: 'Security',
            children: (
              <p>
                Update your password, enable two-factor authentication, and 
                review recent login activity.
              </p>
            ),
          },
        ]}
      />
    </Card>
  );
}
