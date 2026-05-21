'use client';

/**
 * menubar-antd-T09: Match the shield icon menu (Security)
 * 
 * Layout: isolated_card placed in the bottom-right of the viewport (placement=bottom_right).
 * The card contains an Ant Design horizontal Menu where each item has a left icon:
 * - Overview (home icon)
 * - Activity (pulse icon)
 * - Security (shield icon)   ← target
 * - Integrations (plug icon)
 * - Help (question icon)
 * Guidance (mixed): above the menubar is a small "Target icon" swatch showing the shield icon.
 * - Initial state: Overview is active.
 * - No submenus; clicking an item makes it active.
 * - Icons are visually similar in size and weight; label text is present but the task references both the icon and the label.
 * 
 * Success: The menubar's active item is "Security".
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import {
  HomeOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  ApiOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const menuItems = [
  { key: 'Overview', label: 'Overview', icon: <HomeOutlined /> },
  { key: 'Activity', label: 'Activity', icon: <ThunderboltOutlined /> },
  { key: 'Security', label: 'Security', icon: <SafetyOutlined /> },
  { key: 'Integrations', label: 'Integrations', icon: <ApiOutlined /> },
  { key: 'Help', label: 'Help', icon: <QuestionCircleOutlined /> },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Overview');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (activeKey === 'Security' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [activeKey, successTriggered, onSuccess]);

  return (
    <Card style={{ width: 550 }} data-testid="menubar-card">
      {/* Target icon reference */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#666' }}>Target icon:</span>
        <span 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 32, 
            height: 32, 
            background: '#f0f5ff', 
            borderRadius: 4,
            border: '1px solid #adc6ff',
          }}
          data-testid="target-icon"
        >
          <SafetyOutlined style={{ fontSize: 18, color: '#1677ff' }} />
        </span>
        <span style={{ fontSize: 12, color: '#999' }}>
          Click the &quot;Security&quot; menu item (shield icon).
        </span>
      </div>

      <Menu
        mode="horizontal"
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={({ key }) => setActiveKey(key)}
        data-testid="menubar-main"
      />
    </Card>
  );
}
