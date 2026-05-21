'use client';

/**
 * collapsible_disclosure-antd-T04: Secondary preferences: expand Security (two instances)
 * 
 * Two separate cards are stacked vertically in the center of the page.
 * 
 * - Layout: isolated_card (two cards in the same scene), centered.
 * - Instances: 2 Collapse components of the same type.
 *   1) Card title: "Primary preferences" (top)
 *   2) Card title: "Secondary preferences" (bottom)  ← TARGET INSTANCE
 * - Each card contains an AntD Collapse in accordion mode with identical panels:
 *   - "Notifications", "Security", "Connected apps"
 * - Initial state:
 *   - In BOTH instances, all panels start collapsed (no section open).
 * - No other UI is required; the key difficulty is choosing the correct instance by its card title.
 * 
 * Success: In "Secondary preferences", expanded_panels equals ["Security"]
 */

import React, { useState, useEffect, useRef } from 'react';
import { Collapse, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [primaryActiveKey, setPrimaryActiveKey] = useState<string | string[]>([]);
  const [secondaryActiveKey, setSecondaryActiveKey] = useState<string | string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success when Secondary preferences has Security expanded AND Primary remains unchanged
    const secondaryKeys = Array.isArray(secondaryActiveKey) ? secondaryActiveKey : [secondaryActiveKey].filter(Boolean);
    const primaryKeys = Array.isArray(primaryActiveKey) ? primaryActiveKey : [primaryActiveKey].filter(Boolean);
    
    if (secondaryKeys.includes('security') && primaryKeys.length === 0 && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [secondaryActiveKey, primaryActiveKey, onSuccess]);

  const collapseItems = [
    {
      key: 'notifications',
      label: 'Notifications',
      children: (
        <p>
          Configure your notification preferences for this section.
        </p>
      ),
    },
    {
      key: 'security',
      label: 'Security',
      children: (
        <p>
          Manage security settings and access controls.
        </p>
      ),
    },
    {
      key: 'connected_apps',
      label: 'Connected apps',
      children: (
        <p>
          View and manage third-party applications connected to your account.
        </p>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card title="Primary preferences" style={{ width: 500 }} data-testid="collapse-instance-primary">
        <Collapse
          accordion
          activeKey={primaryActiveKey}
          onChange={(key) => setPrimaryActiveKey(key)}
          items={collapseItems}
        />
      </Card>
      
      <Card title="Secondary preferences" style={{ width: 500 }} data-testid="collapse-instance-secondary">
        <Collapse
          accordion
          activeKey={secondaryActiveKey}
          onChange={(key) => setSecondaryActiveKey(key)}
          items={collapseItems}
        />
      </Card>
    </div>
  );
}
