'use client';

/**
 * virtual_list-antd-T01: Select a visible ticket row
 *
 * Layout: a single isolated AntD Card centered in the viewport titled "Open Tickets".
 * Component: one virtualized list (height ~360px) rendered with @rc-component/virtual-list.
 * Row affordances: each row looks like an AntD List item with:
 *   - left: "Ticket #### — <short title>"
 *   - right: a small status Tag (e.g., New / Investigating / Waiting)
 * Interaction model: single-select. Clicking anywhere on a row selects it and applies a light blue highlight.
 * Initial state: no row selected; footer text under the list reads "Selected: none".
 *
 * Success: Select row with key 'ticket-0007'
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tag, Typography } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../types';

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

// Generate 100 tickets
const generateTickets = (): TicketItem[] => {
  const titles = [
    'Payment timeout', 'Page not loading', 'Export CSV broken', 'Search not working',
    'UI glitch', 'Email not sent', 'Login fails on iOS', 'Broken link', 'Slow performance',
    'Data missing', 'Crash on startup', 'Password reset issue', 'API error', 'Upload fails',
    'Download stuck', 'Session expired', 'Permission denied', 'Invalid token', 'Sync failed',
    'Notification missing'
  ];
  const statuses: TicketItem['status'][] = ['New', 'Investigating', 'Waiting', 'Resolved'];
  
  return Array.from({ length: 100 }, (_, i) => ({
    key: `ticket-${String(i + 1).padStart(4, '0')}`,
    id: `Ticket ${String(i + 1).padStart(4, '0')}`,
    title: titles[i % titles.length],
    status: statuses[i % statuses.length],
  }));
};

const tickets = generateTickets();

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
  };

  // Check success condition
  useEffect(() => {
    if (selectedKey === 'ticket-0007') {
      onSuccess();
    }
  }, [selectedKey, onSuccess]);

  return (
    <Card 
      title="Open Tickets" 
      style={{ width: 500 }}
      data-testid="vl-primary"
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
        Scroll to browse all tickets
      </Text>
      <div 
        ref={containerRef}
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
          style={{ padding: 0 }}
        >
          {(item: TicketItem) => (
            <div
              key={item.key}
              data-item-key={item.key}
              aria-selected={selectedKey === item.key}
              onClick={() => handleSelect(item.key)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: selectedKey === item.key ? '#e6f4ff' : 'transparent',
                transition: 'background-color 0.2s',
              }}
            >
              <Text>{item.id} — {item.title}</Text>
              <Tag color={statusColors[item.status]}>{item.status}</Tag>
            </div>
          )}
        </VirtualList>
      </div>
      <div style={{ marginTop: 12, color: '#666', fontSize: 13 }}>
        Selected: {selectedKey ? tickets.find(t => t.key === selectedKey)?.id : 'none'}
      </div>
    </Card>
  );
}
