'use client';

/**
 * breadcrumb-antd-T05: Navigate in dark theme settings
 * 
 * Dark theme settings panel centered on the page.
 * Breadcrumb: Settings > Account > Security
 * Clicking "Account" updates the panel to show navigation.
 */

import React, { useState } from 'react';
import { Breadcrumb, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Account') {
      onSuccess();
    }
  };

  return (
    <Card
      title="Security Settings"
      style={{
        width: 450,
        background: '#1f1f1f',
        borderColor: '#303030',
      }}
      styles={{
        header: { color: '#fff', borderBottomColor: '#303030' },
        body: { color: '#ccc' },
      }}
    >
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: (
              <a
                onClick={() => handleNavigate('Settings')}
                data-testid="antd-breadcrumb-settings"
                style={{ cursor: 'pointer', color: '#91caff' }}
              >
                Settings
              </a>
            ),
          },
          {
            title: (
              <a
                onClick={() => handleNavigate('Account')}
                data-testid="antd-breadcrumb-account"
                style={{ cursor: 'pointer', color: '#91caff' }}
              >
                Account
              </a>
            ),
          },
          {
            title: <span data-testid="antd-breadcrumb-security" style={{ color: '#888' }}>Security</span>,
          },
        ]}
      />
      {navigated ? (
        <p style={{ color: '#52c41a', fontWeight: 500 }}>
          You navigated to: {navigated}
        </p>
      ) : (
        <p>
          Security settings panel. Use breadcrumb to navigate.
        </p>
      )}
    </Card>
  );
}
