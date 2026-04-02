'use client';

/**
 * feed_infinite_scroll-antd-T02: News Feed: open ART-011 details
 * 
 * Layout: isolated "News Feed" card in the center.
 * Each List row is clickable; clicking a row expands an inline details section.
 * Only one item can be expanded at a time.
 * The feed starts at the top with items ART-001 … ART-020 loaded.
 * 
 * Success: active_item_id equals ART-011 and expanded is true
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, List, Spin, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
  details: string;
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
      details: `Details: This is the full content for ${id}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    });
  }
  return items;
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 20));
  const [loading, setLoading] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && activeItemId === 'ART-011') {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeItemId, onSuccess]);

  const handleItemClick = (itemId: string) => {
    setActiveItemId(prev => prev === itemId ? null : itemId);
  };

  // Infinite scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !loading && items.length < 100) {
      setLoading(true);
      setTimeout(() => {
        setItems(prev => [...prev, ...generateItems(prev.length + 1, 10)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  return (
    <Card 
      title="News Feed" 
      style={{ width: 500 }}
      data-active-item-id={activeItemId}
    >
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
            <div key={item.id}>
              <List.Item
                data-item-id={item.id}
                aria-expanded={activeItemId === item.id}
                onClick={() => handleItemClick(item.id)}
                style={{ 
                  padding: '12px 16px',
                  cursor: 'pointer',
                  background: activeItemId === item.id ? '#f0f5ff' : 'transparent',
                }}
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
              {activeItemId === item.id && (
                <div 
                  data-expanded-for={item.id}
                  style={{ 
                    padding: '12px 16px',
                    background: '#fafafa',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <Text strong style={{ fontSize: 12 }}>Details</Text>
                  <Paragraph style={{ margin: '8px 0 0', fontSize: 13 }}>
                    {item.details}
                  </Paragraph>
                </div>
              )}
            </div>
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
