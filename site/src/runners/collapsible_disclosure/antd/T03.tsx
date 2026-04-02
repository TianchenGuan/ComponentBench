'use client';

/**
 * collapsible_disclosure-antd-T03: Preferences: collapse everything (dark theme)
 * 
 * The page is in dark theme and shows a single centered card labeled "Preferences".
 * 
 * - Layout: isolated_card, centered.
 * - Theme: dark (dark background and dark card surface).
 * - Component: one Ant Design Collapse (multi-expand allowed).
 * - Panels: "General", "Notifications", "Privacy".
 * - Initial state: "General" and "Notifications" are expanded; "Privacy" is collapsed.
 * - There is no dedicated "Collapse all" button; you must collapse the expanded panels by interacting with their headers.
 * 
 * Success: expanded_panels equals [] (all collapsed)
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string[]>(['general', 'notifications']);

  useEffect(() => {
    // Success when all panels are collapsed
    if (Array.isArray(activeKey) && activeKey.length === 0) {
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  return (
    <Card title="Preferences" style={{ width: 500 }}>
      <Collapse
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key as string[])}
        data-testid="collapse-root"
        items={[
          {
            key: 'general',
            label: 'General',
            children: (
              <p>
                Configure your general preferences including language, timezone, 
                and display settings.
              </p>
            ),
          },
          {
            key: 'notifications',
            label: 'Notifications',
            children: (
              <p>
                Manage your notification preferences for email, push notifications, 
                and in-app alerts.
              </p>
            ),
          },
          {
            key: 'privacy',
            label: 'Privacy',
            children: (
              <p>
                Control your privacy settings including data sharing, visibility, 
                and tracking preferences.
              </p>
            ),
          },
        ]}
      />
    </Card>
  );
}
