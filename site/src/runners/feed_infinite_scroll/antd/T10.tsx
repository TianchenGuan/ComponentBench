'use client';

/**
 * feed_infinite_scroll-antd-T10: Virtualized Logs: reach end and open LOG-200
 * 
 * Layout: dashboard with a left sidebar and a main content area.
 * Main content shows a card titled "Logs" with some filter chips.
 * The log feed is a virtualized List with endless loading.
 * The feed has a finite dataset of 200 items (LOG-001 … LOG-200).
 * A reference tag (orange "Archive") is displayed next to the feed title.
 * 
 * Success: end_reached is true and active_item_id equals LOG-200 and expanded is true
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, List, Spin, Typography, Menu, Tag } from 'antd';
import {
  HomeOutlined,
  SettingOutlined,
  FileTextOutlined,
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
  hasArchiveTag: boolean;
  details: string;
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'Service started',
    'Connection established',
    'Data synced',
    'Cache cleared',
    'Config updated',
    'Session created',
    'Job completed',
    'Request processed',
    'Event logged',
    'Backup completed',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count && i <= 200; i++) {
    const id = `LOG-${String(i).padStart(3, '0')}`;
    // LOG-200 has the Archive tag
    const hasArchiveTag = i === 200;
    
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      timestamp: `${Math.floor(Math.random() * 60) + 1}m ago`,
      hasArchiveTag,
      details: `Log entry ${id}: Operation completed successfully. Duration: ${Math.floor(Math.random() * 1000)}ms. Status: OK.`,
    });
  }
  return items;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 20));
  const [loading, setLoading] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [endReached, setEndReached] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && endReached && activeItemId === 'LOG-200') {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [endReached, activeItemId, onSuccess]);

  const handleItemClick = (itemId: string) => {
    setActiveItemId(prev => prev === itemId ? null : itemId);
  };

  // Infinite scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !loading && items.length < 200) {
      setLoading(true);
      setTimeout(() => {
        const newItems = generateItems(items.length + 1, 20);
        setItems(prev => [...prev, ...newItems]);
        if (items.length + newItems.length >= 200) {
          setEndReached(true);
        }
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  return (
    <div style={{ display: 'flex', width: 900, height: 500 }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: '#fafafa', borderRight: '1px solid #f0f0f0' }}>
        <Menu
          mode="vertical"
          defaultSelectedKeys={['logs']}
          items={[
            { key: 'home', icon: <HomeOutlined />, label: 'Home' },
            { key: 'logs', icon: <FileTextOutlined />, label: 'Logs' },
            { key: 'users', icon: <UserOutlined />, label: 'Users' },
            { key: 'notifications', icon: <BellOutlined />, label: 'Notifications' },
            { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
          ]}
        />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: 16 }}>
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>Logs</span>
              <Tag color="orange">Archive</Tag>
            </div>
          }
          extra={
            <Text type="secondary" style={{ fontSize: 12 }}>
              Loaded {items.length} / 200
            </Text>
          }
        >
          {/* Filter chips (clutter) */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <Tag>All</Tag>
            <Tag>Info</Tag>
            <Tag>Warning</Tag>
            <Tag>Error</Tag>
          </div>

          <div
            ref={containerRef}
            data-testid="feed-Logs"
            data-active-item-id={activeItemId}
            data-end-reached={endReached}
            style={{
              height: 350,
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
                      padding: '10px 12px',
                      cursor: 'pointer',
                      background: activeItemId === item.id ? '#f0f5ff' : 'transparent',
                    }}
                  >
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text strong style={{ fontSize: 13 }}>{item.id}</Text>
                        <Text style={{ fontSize: 13 }}> — {item.title}</Text>
                        {item.hasArchiveTag && <Tag color="orange" style={{ fontSize: 10 }}>Archive</Tag>}
                      </div>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {item.timestamp}
                      </Text>
                    </div>
                  </List.Item>
                  {activeItemId === item.id && (
                    <div 
                      data-expanded-for={item.id}
                      style={{ 
                        padding: '10px 12px',
                        background: '#fafafa',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <Text strong style={{ fontSize: 11 }}>Details</Text>
                      <Paragraph style={{ margin: '6px 0 0', fontSize: 12 }}>
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
            {endReached && (
              <div style={{ textAlign: 'center', padding: 12, color: '#999', fontSize: 12 }}>
                End of logs
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
