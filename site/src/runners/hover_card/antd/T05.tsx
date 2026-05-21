'use client';

/**
 * hover_card-antd-T05: Open the Backup contact hover card (2 instances)
 *
 * Layout: isolated_card anchored in the top-right portion of the viewport (not centered). Light theme, comfortable spacing.
 *
 * The card is titled "Account contacts" and shows two labeled rows:
 * 1) Primary contact — "Lina Soto"
 * 2) Backup contact — "Noah Park"
 *
 * Each contact name is a hover target with its own AntD Popover hover card.
 * - The two hover cards have similar structure (avatar placeholder + email + phone).
 * - A small hover open delay is configured (slightly delayed reveal) to encourage steady hovering.
 *
 * Initial state: both hover cards are closed. No other popovers/tooltips exist.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Popover, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [activeInstance, setActiveInstance] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (activeInstance === 'Backup contact' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeInstance, onSuccess]);

  const createHoverCardContent = (name: string, email: string, phone: string, instance: string) => (
    <div style={{ width: 220 }} data-testid={`hover-card-${instance.toLowerCase().replace(' ', '-')}`} data-cb-instance={instance}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Avatar size={40} icon={<UserOutlined />} />
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: '#666' }}>
        <div style={{ marginBottom: 4 }}>📧 {email}</div>
        <div>📱 {phone}</div>
      </div>
    </div>
  );

  return (
    <Card title="Account contacts" style={{ width: 350 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary">Primary contact</Text>
          <Popover 
            content={createHoverCardContent('Lina Soto', 'lina.soto@company.com', '+1 555-0101', 'Primary contact')}
            trigger="hover"
            mouseEnterDelay={0.3}
            onOpenChange={(visible) => visible && setActiveInstance('Primary contact')}
          >
            <span
              data-testid="primary-contact-trigger"
              data-cb-instance="Primary contact"
              style={{ 
                color: '#1677ff', 
                cursor: 'pointer',
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: '#f0f5ff'
              }}
            >
              Lina Soto
            </span>
          </Popover>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary">Backup contact</Text>
          <Popover 
            content={createHoverCardContent('Noah Park', 'noah.park@company.com', '+1 555-0102', 'Backup contact')}
            trigger="hover"
            mouseEnterDelay={0.3}
            onOpenChange={(visible) => visible && setActiveInstance('Backup contact')}
          >
            <span
              data-testid="backup-contact-trigger"
              data-cb-instance="Backup contact"
              style={{ 
                color: '#1677ff', 
                cursor: 'pointer',
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: '#f0f5ff'
              }}
            >
              Noah Park
            </span>
          </Popover>
        </div>
      </div>
    </Card>
  );
}
