'use client';

/**
 * collapsible_disclosure-antd-T07: Match reference: expand the panel that matches the Target header
 * 
 * A single centered card titled "Accordion challenge" contains:
 * 
 * - A small "Target header" preview tile at the top of the card (shows an icon and a label in the exact header style).
 * - Below it, one AntD Collapse with 5 panels. Each panel header includes a left icon + text label.
 *   Example labels: "Alerts", "Notifications", "Reminders", "Messages", "Updates".
 * - Initial state: all panels collapsed.
 * - Guidance is visual: the goal is determined by matching the header shown in the preview tile to one of the panel headers.
 * - No other controls are required.
 * 
 * Success: Exactly one panel expanded, matching the Target header preview
 */

import React, { useState, useEffect, useRef } from 'react';
import { Collapse, Card, Space } from 'antd';
import { 
  BellOutlined, 
  MailOutlined, 
  ClockCircleOutlined, 
  MessageOutlined, 
  SyncOutlined 
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

// The target is "Reminders" with ClockCircleOutlined icon
const TARGET_KEY = 'reminders';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success when only the target panel is expanded
    if (activeKey.length === 1 && activeKey[0] === TARGET_KEY && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  const items = [
    {
      key: 'alerts',
      label: (
        <Space>
          <BellOutlined />
          Alerts
        </Space>
      ),
      children: <p>System alerts and important notices.</p>,
    },
    {
      key: 'notifications',
      label: (
        <Space>
          <MailOutlined />
          Notifications
        </Space>
      ),
      children: <p>Your notification preferences and history.</p>,
    },
    {
      key: 'reminders',
      label: (
        <Space>
          <ClockCircleOutlined />
          Reminders
        </Space>
      ),
      children: <p>Your upcoming reminders and scheduled tasks.</p>,
    },
    {
      key: 'messages',
      label: (
        <Space>
          <MessageOutlined />
          Messages
        </Space>
      ),
      children: <p>Your message inbox and conversations.</p>,
    },
    {
      key: 'updates',
      label: (
        <Space>
          <SyncOutlined />
          Updates
        </Space>
      ),
      children: <p>System updates and changelog.</p>,
    },
  ];

  return (
    <Card title="Accordion challenge" style={{ width: 500 }}>
      {/* Target header preview */}
      <div 
        data-testid="target-header-preview"
        style={{
          padding: '12px 16px',
          background: '#f5f5f5',
          borderRadius: 8,
          marginBottom: 16,
          border: '2px dashed #1677ff',
        }}
      >
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
          Target header:
        </div>
        <Space style={{ fontSize: 14 }}>
          <ClockCircleOutlined />
          Reminders
        </Space>
      </div>

      <Collapse
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key as string[])}
        data-testid="collapse-root"
        items={items}
      />
    </Card>
  );
}
