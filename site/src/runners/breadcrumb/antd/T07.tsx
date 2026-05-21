'use client';

/**
 * breadcrumb-antd-T07: Navigate in compact dashboard
 * 
 * Dashboard layout with compact spacing and breadcrumb in the top-left corner.
 * Breadcrumb: Admin > Reports > Q4 Summary
 * Click "Reports" to navigate.
 */

import React, { useState } from 'react';
import { Breadcrumb, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Reports') {
      onSuccess();
    }
  };

  return (
    <Card
      title="Q4 Summary"
      size="small"
      style={{ width: 350 }}
      styles={{ body: { padding: 12 } }}
    >
      <Breadcrumb
        style={{ marginBottom: 12, fontSize: 12 }}
        items={[
          {
            title: (
              <a
                onClick={() => handleNavigate('Admin')}
                data-testid="antd-breadcrumb-admin"
                style={{ cursor: 'pointer', fontSize: 12 }}
              >
                Admin
              </a>
            ),
          },
          {
            title: (
              <a
                onClick={() => handleNavigate('Reports')}
                data-testid="antd-breadcrumb-reports"
                style={{ cursor: 'pointer', fontSize: 12 }}
              >
                Reports
              </a>
            ),
          },
          {
            title: <span data-testid="antd-breadcrumb-q4" style={{ fontSize: 12 }}>Q4 Summary</span>,
          },
        ]}
      />
      {navigated ? (
        <p style={{ color: '#52c41a', fontWeight: 500, fontSize: 13 }}>
          Navigated to: {navigated}
        </p>
      ) : (
        <p style={{ fontSize: 13, margin: 0 }}>
          Viewing Q4 Summary report. Use breadcrumb to navigate.
        </p>
      )}
    </Card>
  );
}
