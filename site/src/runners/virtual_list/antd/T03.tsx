'use client';

/**
 * virtual_list-antd-T03: Star a ticket from the list
 *
 * Layout: isolated AntD Card centered, titled "Open Tickets".
 * Component: one virtual list (height ~360px) with virtualized rows.
 * Row affordances: each row contains:
 *   - main label text "Ticket #### — <title>"
 *   - a small Star icon button on the far right (outline when off, filled when on)
 *   - a status Tag
 * Initial state: all tickets are unstarred; Ticket 0009 is visible in the initial viewport.
 *
 * Success: Ticket 0009 has Starred = true
 */

import React, { useState, useEffect } from 'react';
import { Card, Tag, Typography, Button, Tooltip } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
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
    'Login fails', 'Page not loading', 'Slow performance', 'Search issue',
    'UI glitch', 'Email not sent', 'Payment timeout', 'Broken link', 'Export CSV broken',
    'Data missing', 'Crash on startup', 'Password reset', 'API error', 'Upload fails',
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

export default function T03({ onSuccess }: TaskComponentProps) {
  const [starredKeys, setStarredKeys] = useState<Set<string>>(new Set());

  const handleToggleStar = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredKeys(prev => {
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
    if (starredKeys.has('ticket-0009')) {
      onSuccess();
    }
  }, [starredKeys, onSuccess]);

  return (
    <Card 
      title="Open Tickets" 
      style={{ width: 550 }}
      data-testid="vl-primary"
    >
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
            const isStarred = starredKeys.has(item.key);
            return (
              <div
                key={item.key}
                data-item-key={item.key}
                data-starred={isStarred}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <Text>{item.id} — {item.title}</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tag color={statusColors[item.status]}>{item.status}</Tag>
                  <Tooltip title={isStarred ? 'Starred' : 'Star this ticket'}>
                    <Button
                      type="text"
                      size="small"
                      icon={isStarred ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                      onClick={(e) => handleToggleStar(item.key, e)}
                      aria-pressed={isStarred}
                      aria-label="Star"
                    />
                  </Tooltip>
                </div>
              </div>
            );
          }}
        </VirtualList>
      </div>
    </Card>
  );
}
