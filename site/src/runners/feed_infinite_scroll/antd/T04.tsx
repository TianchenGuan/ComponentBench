'use client';

/**
 * feed_infinite_scroll-antd-T04: News Feed: enable Unread only
 * 
 * Layout: isolated "News Feed" card centered on the page.
 * The feed header contains a labeled Switch: "Unread only". It is OFF by default.
 * List items include a small unread dot for unread entries.
 * When "Unread only" is turned on, the feed filters to show only unread items.
 * 
 * Success: filters.unread_only equals true
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Switch, Tag, Typography, Badge } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
  isUnread: boolean;
}

function generateItems(start: number, count: number): FeedItem[] {
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `ART-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: `News article ${i}`,
      timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
      isUnread: Math.random() < 0.4, // 40% unread
    });
  }
  return items;
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [items] = useState<FeedItem[]>(() => generateItems(1, 20));
  const [unreadOnly, setUnreadOnly] = useState(false);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && unreadOnly) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [unreadOnly, onSuccess]);

  const filteredItems = unreadOnly ? items.filter(item => item.isUnread) : items;

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>News Feed</span>
          {unreadOnly && <Tag color="blue">Filter: Unread</Tag>}
        </div>
      }
      extra={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text>Unread only</Text>
          <Switch
            checked={unreadOnly}
            onChange={setUnreadOnly}
            aria-label="Unread only"
          />
        </div>
      }
      style={{ width: 500 }}
      data-filters={JSON.stringify({ unread_only: unreadOnly })}
    >
      <div
        data-testid="feed-News"
        style={{
          height: 400,
          overflow: 'auto',
        }}
      >
        <List
          dataSource={filteredItems}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              data-item-id={item.id}
              style={{ padding: '12px 16px' }}
            >
              <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                {item.isUnread && (
                  <Badge status="processing" style={{ marginTop: 6 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div>
                    <Text strong>{item.id}</Text>
                    <Text> — {item.title}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.timestamp}
                  </Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
}
