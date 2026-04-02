'use client';

/**
 * feed_infinite_scroll-antd-T05: Incident Feed: search and open INC-1088
 * 
 * Layout: form_section with two columns. Left column contains unrelated form fields.
 * Right column contains an "Incident Feed" card with a fixed-height scrollable List.
 * The feed header includes an AntD Input.Search.
 * Typing in the search box filters the feed.
 * Clicking a row expands inline details.
 * 
 * Success: active_item_id equals INC-1088 and expanded is true
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, List, Input, Select, Checkbox, Spin, Typography, Form } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;
const { Search } = Input;

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
  details: string;
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'VPN login failure',
    'Database connection timeout',
    'API rate limit exceeded',
    'SSL certificate expiring',
    'Memory usage critical',
    'Disk space warning',
    'Authentication failed',
    'Service unavailable',
    'Network latency high',
    'Backup failed',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `INC-${String(1000 + i).padStart(4, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
      details: `Incident details for ${id}: Investigation ongoing. Root cause analysis in progress. Affected systems have been identified and mitigation steps are being implemented.`,
    });
  }
  return items;
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [items] = useState<FeedItem[]>(() => generateItems(1, 100));
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  // Filter items based on search
  const filteredItems = searchQuery
    ? items.filter(item => 
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && activeItemId === 'INC-1088') {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeItemId, onSuccess]);

  const handleSearch = (value: string) => {
    setLoading(true);
    setSearchQuery(value);
    setActiveItemId(null);
    setTimeout(() => setLoading(false), 300);
  };

  const handleItemClick = (itemId: string) => {
    setActiveItemId(prev => prev === itemId ? null : itemId);
  };

  return (
    <div style={{ display: 'flex', gap: 24, width: 900 }}>
      {/* Left column - form fields (clutter) */}
      <div style={{ width: 300, flexShrink: 0 }}>
        <Card title="Rule Configuration">
          <Form layout="vertical">
            <Form.Item label="Rule name">
              <Input placeholder="Enter rule name" />
            </Form.Item>
            <Form.Item label="Severity">
              <Select placeholder="Select severity">
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="high">High</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Checkbox>Send email notification</Checkbox>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* Right column - Incident Feed */}
      <Card 
        title="Incident Feed"
        style={{ flex: 1 }}
        data-active-item-id={activeItemId}
      >
        <Search
          placeholder="Search incidents (ID or text)"
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
          data-testid="incident-search"
        />
        <div
          data-testid="feed-Incident"
          style={{
            height: 350,
            overflow: 'auto',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Spin />
            </div>
          ) : (
            <List
              dataSource={filteredItems}
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
          )}
        </div>
      </Card>
    </div>
  );
}
