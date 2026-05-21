'use client';

/**
 * link-antd-T06: Choose the quick link that matches a reference icon
 * 
 * setup_description:
 * A form_section layout titled "Quick Links" appears centered on the page. At the top of
 * the section, a small "Reference badge" is shown: a monochrome shield icon inside a
 * rounded square. Below it is a vertical list of four Ant Design Typography.Link items,
 * each rendered as an inline link row with a left icon and a text label:
 * 1) Billing (credit-card icon)
 * 2) Security Center (shield icon) <- target
 * 3) Notifications (bell icon)
 * 4) API Keys (key icon)
 * 
 * success_trigger:
 * - The link row whose icon matches the reference badge was activated (data-testid="quicklink-security").
 * - The current route pathname equals "/security".
 */

import React, { useState } from 'react';
import { Card, Typography, Space } from 'antd';
import { CreditCardOutlined, SafetyOutlined, BellOutlined, KeyOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Link, Text } = Typography;

const quickLinks = [
  { key: 'billing', label: 'Billing', icon: CreditCardOutlined, path: '/billing', iconId: 'credit-card' },
  { key: 'security', label: 'Security Center', icon: SafetyOutlined, path: '/security', iconId: 'shield' },
  { key: 'notifications', label: 'Notifications', icon: BellOutlined, path: '/notifications', iconId: 'bell' },
  { key: 'api-keys', label: 'API Keys', icon: KeyOutlined, path: '/api-keys', iconId: 'key' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [route, setRoute] = useState('/home');
  const [activated, setActivated] = useState(false);

  const handleClick = (path: string, isTarget: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setRoute(path);
    if (isTarget) {
      setActivated(true);
      onSuccess();
    }
  };

  return (
    <Card title="Quick Links" style={{ width: 350 }}>
      {/* Reference Badge */}
      <div style={{ marginBottom: 24 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Reference badge:
        </Text>
        <div 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 40, 
            height: 40, 
            background: '#f5f5f5', 
            borderRadius: 8,
            border: '1px solid #d9d9d9',
          }}
          data-reference-icon="shield"
        >
          <SafetyOutlined style={{ fontSize: 20, color: '#666' }} />
        </div>
      </div>

      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Select a quick link that matches the icon above:
      </Text>

      {/* Links List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {quickLinks.map((link) => {
          const IconComponent = link.icon;
          const isTarget = link.key === 'security';
          return (
            <Link
              key={link.key}
              href={link.path}
              onClick={handleClick(link.path, isTarget)}
              data-testid={`quicklink-${link.key}`}
              data-icon={link.iconId}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                cursor: 'pointer',
              }}
            >
              <IconComponent style={{ fontSize: 16 }} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
