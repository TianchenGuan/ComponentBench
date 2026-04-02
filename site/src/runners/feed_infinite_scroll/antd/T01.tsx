'use client';

/**
 * feed_infinite_scroll-antd-T01: News Feed: scroll to ART-008
 * 
 * Layout: an isolated card centered on the page titled "News Feed".
 * The feed is an AntD List rendered inside a fixed-height scroll container.
 * The list starts with 20 items loaded (ART-001 … ART-020) and shows ~6 items at a time.
 * Each row shows a bold ID+title and a lighter subtitle with a timestamp.
 * Infinite-loading behavior exists but the target item is within the initial 20 items.
 * 
 * Success: ART-008 is visible within the feed viewport (min_visible_ratio: 0.5)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, List, Spin, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
}

const NEWS_TITLES: Record<number, string> = {
  1: 'Morning market opens',
  2: 'Tech stocks rally',
  3: 'New legislation proposed',
  4: 'Weather forecast update',
  5: 'Sports championship results',
  6: 'Healthcare reform bill',
  7: 'Economic indicators rise',
  8: 'City council approves new park',
  9: 'Innovation summit announced',
  10: 'Quarterly earnings report',
  11: 'Museum opens new exhibit',
  12: 'Infrastructure funding approved',
  13: 'Environmental study released',
  14: 'Community event scheduled',
  15: 'Research breakthrough',
  16: 'Market analysis report',
  17: 'Policy changes announced',
  18: 'Technology update released',
  19: 'Budget proposal submitted',
  20: 'Transportation plan unveiled',
};

function generateItems(start: number, count: number): FeedItem[] {
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `ART-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: NEWS_TITLES[i] || `News article ${i}`,
      timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
    });
  }
  return items;
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 20));
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check if target item is visible
  const checkVisibility = useCallback(() => {
    if (successCalledRef.current) return;
    
    const container = containerRef.current;
    if (!container) return;

    const targetElement = container.querySelector('[data-item-id="ART-008"]');
    if (!targetElement) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    // Calculate visibility ratio
    const visibleTop = Math.max(containerRect.top, targetRect.top);
    const visibleBottom = Math.min(containerRect.bottom, targetRect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visibilityRatio = visibleHeight / targetRect.height;

    if (visibilityRatio >= 0.5) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [onSuccess]);

  // Infinite scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Check visibility on scroll
    checkVisibility();
    
    // Load more when near bottom
    if (scrollHeight - scrollTop - clientHeight < 100 && !loading && items.length < 100) {
      setLoading(true);
      setTimeout(() => {
        setItems(prev => [...prev, ...generateItems(prev.length + 1, 10)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length, checkVisibility]);

  useEffect(() => {
    checkVisibility();
  }, [checkVisibility]);

  return (
    <Card title="News Feed" style={{ width: 500 }}>
      <div
        ref={containerRef}
        data-testid="feed-News"
        style={{
          height: 400,
          overflow: 'auto',
        }}
        onScroll={handleScroll}
      >
        <List
          dataSource={items}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              data-item-id={item.id}
              style={{ padding: '12px 16px' }}
            >
              <div style={{ width: '100%' }}>
                <div>
                  <Text strong>{item.id}</Text>
                  <Text> — {item.title}</Text>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.timestamp}
                </Text>
              </div>
            </List.Item>
          )}
        />
        {loading && (
          <div style={{ textAlign: 'center', padding: 12 }}>
            <Spin size="small" />
          </div>
        )}
      </div>
    </Card>
  );
}
