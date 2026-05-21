'use client';

/**
 * virtual_list-antd-T06: Select an item in the correct list when two are present
 *
 * Layout: isolated_card-style two-column layout centered: two AntD Cards side-by-side.
 *   - Left card title: "Active Users"
 *   - Right card title: "Suspended Users"
 * Initial state:
 *   - Active Users: one row preselected (highlighted) to act as a distractor.
 *   - Suspended Users: no selection; scrolled to top.
 *
 * Success: In Suspended Users list, select 'susp-0112' (Morgan Chen)
 */

import React, { useState, useEffect } from 'react';
import { Card, Tag, Typography } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface UserItem {
  key: string;
  id: string;
  name: string;
  reason?: string;
}

// Generate users for both lists
const generateActiveUsers = (): UserItem[] => {
  const names = ['Morgan Chen', 'Alex Kim', 'Taylor Smith', 'Jordan Lee', 'Casey Brown', 'Riley Johnson', 'Quinn Davis', 'Avery Wilson'];
  return Array.from({ length: 200 }, (_, i) => ({
    key: `active-${String(i + 1).padStart(4, '0')}`,
    id: `ACTIVE-${String(i + 1).padStart(4, '0')}`,
    name: names[i % names.length],
  }));
};

const generateSuspendedUsers = (): UserItem[] => {
  const names = ['Morgan Chen', 'Alex Kim', 'Taylor Smith', 'Jordan Lee', 'Casey Brown', 'Riley Johnson', 'Quinn Davis', 'Avery Wilson'];
  const reasons = ['Billing', 'Abuse', 'Inactive', 'Policy'];
  return Array.from({ length: 200 }, (_, i) => ({
    key: `susp-${String(i + 1).padStart(4, '0')}`,
    id: `SUSP-${String(i + 1).padStart(4, '0')}`,
    name: names[i % names.length],
    reason: reasons[i % reasons.length],
  }));
};

const activeUsers = generateActiveUsers();
const suspendedUsers = generateSuspendedUsers();

export default function T06({ onSuccess }: TaskComponentProps) {
  // Active list has preselected item as distractor
  const [activeSelectedKey, setActiveSelectedKey] = useState<string | null>('active-0015');
  const [suspendedSelectedKey, setSuspendedSelectedKey] = useState<string | null>(null);

  // Check success condition
  useEffect(() => {
    if (suspendedSelectedKey === 'susp-0112') {
      onSuccess();
    }
  }, [suspendedSelectedKey, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Active Users (distractor) */}
      <Card 
        title="Active Users" 
        style={{ width: 380 }}
        data-testid="vl-active"
      >
        <div 
          style={{ 
            border: '1px solid #f0f0f0', 
            borderRadius: 4,
          }}
        >
          <VirtualList
            data={activeUsers}
            height={320}
            itemHeight={48}
            itemKey="key"
          >
            {(item: UserItem) => (
              <div
                key={item.key}
                data-item-key={item.key}
                aria-selected={activeSelectedKey === item.key}
                onClick={() => setActiveSelectedKey(item.key)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: activeSelectedKey === item.key ? '#e6f4ff' : 'transparent',
                }}
              >
                <Text>{item.id} — {item.name}</Text>
              </div>
            )}
          </VirtualList>
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
          Selected: {activeSelectedKey ? activeUsers.find(u => u.key === activeSelectedKey)?.id : 'none'}
        </div>
      </Card>

      {/* Suspended Users (target) */}
      <Card 
        title="Suspended Users" 
        style={{ width: 380 }}
        data-testid="vl-suspended"
      >
        <div 
          style={{ 
            border: '1px solid #f0f0f0', 
            borderRadius: 4,
          }}
        >
          <VirtualList
            data={suspendedUsers}
            height={320}
            itemHeight={48}
            itemKey="key"
          >
            {(item: UserItem) => (
              <div
                key={item.key}
                data-item-key={item.key}
                aria-selected={suspendedSelectedKey === item.key}
                onClick={() => setSuspendedSelectedKey(item.key)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: suspendedSelectedKey === item.key ? '#e6f4ff' : 'transparent',
                }}
              >
                <Text>{item.id} — {item.name}</Text>
                {item.reason && <Tag color="red">{item.reason}</Tag>}
              </div>
            )}
          </VirtualList>
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
          Selected: {suspendedSelectedKey ? suspendedUsers.find(u => u.key === suspendedSelectedKey)?.id : 'none'}
        </div>
      </Card>
    </div>
  );
}
