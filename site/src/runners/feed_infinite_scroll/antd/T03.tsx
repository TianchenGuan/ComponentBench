'use client';

/**
 * feed_infinite_scroll-antd-T03: News Feed: back to top
 * 
 * Layout: isolated card titled "News Feed" centered on the page.
 * Initial state: the feed is pre-scrolled to the middle (around ART-040).
 * A small "Back to top" button floats at the bottom-right corner of the feed container.
 * Clicking "Back to top" scrolls the feed container back to the top.
 * 
 * Success: scroll_top_px is 0 (within tolerance of 5px) and ART-001 is visible
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, List, Button, Typography } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
}

function generateItems(start: number, count: number): FeedItem[] {
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `ART-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: `News article ${i}`,
      timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
    });
  }
  return items;
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [items] = useState<FeedItem[]>(() => generateItems(1, 60));
  const [scrollTop, setScrollTop] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);
  const initialScrollDoneRef = useRef(false);

  // Pre-scroll to middle on mount
  useEffect(() => {
    if (containerRef.current && !initialScrollDoneRef.current) {
      containerRef.current.scrollTop = 1500; // Scroll to around ART-040
      setScrollTop(1500);
      initialScrollDoneRef.current = true;
    }
  }, []);

  // Check for success condition
  const checkSuccess = useCallback(() => {
    if (successCalledRef.current) return;
    
    const container = containerRef.current;
    if (!container) return;

    const currentScrollTop = container.scrollTop;
    
    if (currentScrollTop <= 5) {
      // Check if ART-001 is visible
      const firstItem = container.querySelector('[data-item-id="ART-001"]');
      if (firstItem) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = firstItem.getBoundingClientRect();
        if (itemRect.top >= containerRect.top && itemRect.top < containerRect.bottom) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    }
  }, [onSuccess]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    setScrollTop(currentScrollTop);
    setShowBackToTop(currentScrollTop > 50);
    checkSuccess();
  }, [checkSuccess]);

  const handleBackToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Card title="News Feed" style={{ width: 500, position: 'relative' }}>
      <div
        ref={containerRef}
        data-testid="feed-News"
        data-scroll-top={scrollTop}
        data-first-visible-item-id={scrollTop <= 5 ? 'ART-001' : undefined}
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
      </div>
      
      {showBackToTop && (
        <Button
          type="primary"
          size="small"
          icon={<ArrowUpOutlined />}
          onClick={handleBackToTop}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
          }}
        >
          Back to top
        </Button>
      )}
    </Card>
  );
}
