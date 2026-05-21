'use client';

/**
 * feed_infinite_scroll-antd-T09: Dark feed: match reference icon and select POST-034
 * 
 * Theme: dark.
 * Layout: isolated card titled "Saved Posts" centered on the page.
 * At the top of the card is a "Reference icon" preview.
 * Feed rows are visually uniform and each row begins with a small icon badge.
 * The matching item is not in the first viewport and may require scrolling.
 * Selecting a row highlights it with an accent outline.
 * 
 * Success: matched_item_id equals POST-034 (which has the matching icon)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, List, Spin, Typography, Badge } from 'antd';
import {
  SafetyOutlined,
  StarOutlined,
  HeartOutlined,
  BellOutlined,
  BookOutlined,
  TagOutlined,
  FlagOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// Icon configurations
const ICONS = [
  { icon: <SafetyOutlined />, name: 'safety', color: '#1890ff' },
  { icon: <StarOutlined />, name: 'star', color: '#faad14' },
  { icon: <HeartOutlined />, name: 'heart', color: '#eb2f96' },
  { icon: <BellOutlined />, name: 'bell', color: '#52c41a' },
  { icon: <BookOutlined />, name: 'book', color: '#722ed1' },
  { icon: <TagOutlined />, name: 'tag', color: '#fa8c16' },
  { icon: <FlagOutlined />, name: 'flag', color: '#f5222d' },
  { icon: <TrophyOutlined />, name: 'trophy', color: '#13c2c2' },
];

// Target icon is safety-teal (index 0 with teal color override)
const TARGET_ICON = { icon: <SafetyOutlined />, name: 'safety', color: '#13c2c2' };

interface FeedItem {
  id: string;
  title: string;
  iconIndex: number;
  iconColor: string;
  isTarget: boolean;
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'Weekly update',
    'Monthly summary',
    'Team meeting',
    'Project notes',
    'Quick reminder',
    'Important memo',
    'Action items',
    'Status report',
    'Review notes',
    'Follow-up',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `POST-${String(i).padStart(3, '0')}`;
    const isTarget = i === 34; // POST-034 is the target
    
    // Assign random icon, but POST-034 gets the target icon
    const iconIndex = isTarget ? 0 : Math.floor(Math.random() * ICONS.length);
    const iconColor = isTarget ? TARGET_ICON.color : ICONS[iconIndex].color;
    
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      iconIndex,
      iconColor,
      isTarget,
    });
  }
  return items;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 20));
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && selectedId === 'POST-034') {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [selectedId, onSuccess]);

  // Infinite scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !loading && items.length < 60) {
      setLoading(true);
      setTimeout(() => {
        setItems(prev => [...prev, ...generateItems(prev.length + 1, 10)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  const getIconComponent = (iconIndex: number, color: string) => {
    const IconComponent = ICONS[iconIndex]?.icon || ICONS[0].icon;
    return React.cloneElement(IconComponent as React.ReactElement, {
      style: { color, fontSize: 16 }
    });
  };

  return (
    <Card 
      title="Saved Posts" 
      style={{ width: 500, background: '#1f1f1f' }}
      headStyle={{ background: '#1f1f1f', color: '#fff', borderBottom: '1px solid #303030' }}
      bodyStyle={{ background: '#1f1f1f', padding: 0 }}
    >
      {/* Reference icon */}
      <div 
        data-reference-id="REF-ICON-1"
        style={{ 
          padding: 16, 
          borderBottom: '1px solid #303030',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Text style={{ color: '#888', fontSize: 12 }}>Reference icon:</Text>
        <div 
          style={{ 
            width: 40, 
            height: 40, 
            background: '#303030',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SafetyOutlined style={{ color: TARGET_ICON.color, fontSize: 24 }} />
        </div>
      </div>

      <div
        ref={containerRef}
        data-testid="feed-SavedPosts"
        data-selected-item-id={selectedId}
        style={{
          height: 350,
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
              data-icon={`${ICONS[item.iconIndex]?.name || 'shield'}-${item.iconColor.replace('#', '')}`}
              onClick={() => setSelectedId(item.id)}
              style={{ 
                padding: '12px 16px',
                cursor: 'pointer',
                background: selectedId === item.id ? '#177ddc22' : 'transparent',
                border: selectedId === item.id ? '2px solid #177ddc' : '2px solid transparent',
                borderRadius: 4,
                margin: '0 8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                <div 
                  style={{ 
                    width: 32, 
                    height: 32, 
                    background: '#303030',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getIconComponent(item.iconIndex, item.iconColor)}
                </div>
                <div style={{ flex: 1 }}>
                  <Text style={{ color: '#fff' }} strong>{item.id}</Text>
                  <Text style={{ color: '#888' }}> — {item.title}</Text>
                </div>
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
