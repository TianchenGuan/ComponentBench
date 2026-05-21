'use client';

/**
 * virtual_list-antd-T02: Scroll until a specific ticket becomes visible
 *
 * Layout: isolated AntD Card centered, titled "Open Tickets".
 * Component: one virtual list (height ~360px) with 200+ tickets; only visible rows are mounted.
 * Initial state: scrolled to the very top showing Ticket 0001–0010 approximately.
 *
 * Success: Ticket 0040 (key 'ticket-0040') is visible (at least 60% in viewport)
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
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

// Generate 200 tickets
const generateTickets = (): TicketItem[] => {
  const titles = [
    'Login fails', 'Page not loading', 'Export broken', 'Search issue',
    'UI glitch', 'Email not sent', 'Payment timeout', 'Broken link', 'Slow performance',
    'Data missing', 'Crash on startup', 'Password reset', 'API error', 'Upload fails',
    'Download stuck', 'Session expired', 'Permission denied', 'Invalid token', 'Sync failed',
    'Payment declined', 'Payment receipt missing', 'Notification issue'
  ];
  const statuses: TicketItem['status'][] = ['New', 'Investigating', 'Waiting', 'Resolved'];
  
  return Array.from({ length: 200 }, (_, i) => {
    const num = i + 1;
    let title = titles[i % titles.length];
    // Special title for ticket 40
    if (num === 40) title = 'Payment timeout';
    return {
      key: `ticket-${String(num).padStart(4, '0')}`,
      id: `Ticket ${String(num).padStart(4, '0')}`,
      title,
      status: statuses[i % statuses.length],
    };
  });
};

const tickets = generateTickets();

export default function T02({ onSuccess }: TaskComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkVisibility = useCallback(() => {
    if (hasCompleted) return;
    
    const targetElement = containerRef.current?.querySelector('[data-item-key="ticket-0040"]');
    const container = containerRef.current?.querySelector('.rc-virtual-list-holder');
    
    if (targetElement && container) {
      const itemRect = targetElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const visibleTop = Math.max(itemRect.top, containerRect.top);
      const visibleBottom = Math.min(itemRect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const itemHeight = itemRect.height;
      
      if (itemHeight > 0 && visibleHeight / itemHeight >= 0.6) {
        setHasCompleted(true);
        onSuccess();
      }
    }
  }, [hasCompleted, onSuccess]);

  useEffect(() => {
    const interval = setInterval(checkVisibility, 100);
    return () => clearInterval(interval);
  }, [checkVisibility]);

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
          onScroll={checkVisibility}
        >
          {(item: TicketItem) => (
            <div
              key={item.key}
              data-item-key={item.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <Text>{item.id} — {item.title}</Text>
              <Tag color={statusColors[item.status]}>{item.status}</Tag>
            </div>
          )}
        </VirtualList>
      </div>
    </Card>
  );
}
