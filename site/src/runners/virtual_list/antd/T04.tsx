'use client';

/**
 * virtual_list-antd-T04: Check three specific tickets
 *
 * Layout: isolated AntD Card centered, titled "Open Tickets".
 * Component: one virtual list with a checkbox column on the left of each row (multi-select mode).
 * Row structure (left → right): Checkbox · "Ticket #### — <title>" · Status Tag.
 * Initial state: no checkboxes selected; all three target tickets are visible in the initial viewport.
 *
 * Success: Exactly tickets 0002, 0004, 0006 are checked (and no others)
 */

import React, { useState, useEffect } from 'react';
import { Card, Tag, Typography, Checkbox } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../types';
import { selectionSetEquals } from '../types';

const { Text } = Typography;

interface TicketItem {
  key: string;
  id: string;
  title: string;
  status: 'New' | 'Investigating' | 'Waiting' | 'Resolved';
}

const statusColors: Record<string, string> = {
  New: 'blue',
  Investigating: 'orange',
  Waiting: 'purple',
  Resolved: 'green',
};

// Generate 50 tickets
const generateTickets = (): TicketItem[] => {
  const titles = [
    'Login fails', 'Broken link', 'Page not loading', 'UI glitch', 'Search issue',
    'Email not sent', 'Payment timeout', 'Export broken', 'Slow performance', 'Data missing'
  ];
  const statuses: TicketItem['status'][] = ['New', 'Investigating', 'Waiting', 'Resolved'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    key: `ticket-${String(i + 1).padStart(4, '0')}`,
    id: `Ticket ${String(i + 1).padStart(4, '0')}`,
    title: titles[i % titles.length],
    status: statuses[i % statuses.length],
  }));
};

const tickets = generateTickets();
const TARGET_KEYS = ['ticket-0002', 'ticket-0004', 'ticket-0006'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());

  const handleToggleCheck = (key: string) => {
    setCheckedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Check success condition
  useEffect(() => {
    if (selectionSetEquals(checkedKeys, TARGET_KEYS)) {
      onSuccess();
    }
  }, [checkedKeys, onSuccess]);

  return (
    <Card 
      title="Open Tickets" 
      style={{ width: 550 }}
      data-testid="vl-primary"
    >
      <div style={{ marginBottom: 8, fontSize: 13, color: '#666' }}>
        Selected: {checkedKeys.size}
      </div>
      <div 
        style={{ 
          border: '1px solid #f0f0f0', 
          borderRadius: 4,
        }}
      >
        <VirtualList
          data={tickets}
          height={360}
          itemHeight={54}
          itemKey="key"
        >
          {(item: TicketItem) => {
            const isChecked = checkedKeys.has(item.key);
            return (
              <div
                key={item.key}
                data-item-key={item.key}
                aria-checked={isChecked}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  gap: 12,
                }}
              >
                <Checkbox
                  checked={isChecked}
                  onChange={() => handleToggleCheck(item.key)}
                />
                <Text style={{ flex: 1 }}>{item.id} — {item.title}</Text>
                <Tag color={statusColors[item.status]}>{item.status}</Tag>
              </div>
            );
          }}
        </VirtualList>
      </div>
    </Card>
  );
}
