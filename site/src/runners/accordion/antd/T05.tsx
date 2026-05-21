'use client';

/**
 * accordion-antd-T05: Settings accordion: open Notifications and Privacy
 * 
 * A centered isolated card titled "Settings" contains an Ant Design Collapse with 
 * accordion=false so multiple panels can be expanded. Panels (top to bottom): "Profile", 
 * "Security", "Notifications", "Privacy", "Connected apps". Initial state: all panels are 
 * collapsed. Expanding a panel reveals placeholder settings text and a few disabled toggle 
 * switches (distractors) inside the panel content.
 * 
 * Success: expanded_item_ids equals exactly: [notifications, privacy]
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card, Switch } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  useEffect(() => {
    const sortedKeys = [...activeKeys].sort();
    if (sortedKeys.length === 2 && sortedKeys[0] === 'notifications' && sortedKeys[1] === 'privacy') {
      onSuccess();
    }
  }, [activeKeys, onSuccess]);

  return (
    <Card title="Settings" style={{ width: 500 }}>
      <Collapse
        activeKey={activeKeys}
        onChange={(keys) => setActiveKeys(keys as string[])}
        data-testid="accordion-root"
        items={[
          {
            key: 'profile',
            label: 'Profile',
            children: (
              <div>
                <p>Profile settings placeholder</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Switch disabled />
                  <span style={{ color: '#999' }}>Public profile</span>
                </div>
              </div>
            ),
          },
          {
            key: 'security',
            label: 'Security',
            children: (
              <div>
                <p>Security settings placeholder</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Switch disabled />
                  <span style={{ color: '#999' }}>Two-factor auth</span>
                </div>
              </div>
            ),
          },
          {
            key: 'notifications',
            label: 'Notifications',
            children: (
              <div>
                <p>Notification preferences placeholder</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Switch disabled />
                  <span style={{ color: '#999' }}>Email notifications</span>
                </div>
              </div>
            ),
          },
          {
            key: 'privacy',
            label: 'Privacy',
            children: (
              <div>
                <p>Privacy settings placeholder</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Switch disabled />
                  <span style={{ color: '#999' }}>Data sharing</span>
                </div>
              </div>
            ),
          },
          {
            key: 'connected_apps',
            label: 'Connected apps',
            children: (
              <div>
                <p>Connected apps placeholder</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Switch disabled />
                  <span style={{ color: '#999' }}>Auto-sync</span>
                </div>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}
