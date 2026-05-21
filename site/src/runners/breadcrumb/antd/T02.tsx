'use client';

/**
 * breadcrumb-antd-T02: Navigate Home (icon breadcrumb)
 * 
 * Centered isolated card titled "Documents".
 * The first breadcrumb item is a home icon (house icon) without text.
 * Clicking it updates the card content to show "You navigated to: Home".
 */

import React, { useState } from 'react';
import { Breadcrumb, Card } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Home') {
      onSuccess();
    }
  };

  return (
    <Card title="Documents" style={{ width: 400 }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: (
              <a
                onClick={() => handleNavigate('Home')}
                data-testid="antd-breadcrumb-home"
                style={{ cursor: 'pointer' }}
              >
                <HomeOutlined />
              </a>
            ),
          },
          {
            title: (
              <a
                onClick={() => handleNavigate('Files')}
                data-testid="antd-breadcrumb-files"
                style={{ cursor: 'pointer' }}
              >
                Files
              </a>
            ),
          },
          {
            title: <span data-testid="antd-breadcrumb-documents">Documents</span>,
          },
        ]}
      />
      {navigated ? (
        <p style={{ color: '#52c41a', fontWeight: 500 }}>
          You navigated to: {navigated}
        </p>
      ) : (
        <p>
          Currently viewing Documents. Click the home icon to go back.
        </p>
      )}
    </Card>
  );
}
