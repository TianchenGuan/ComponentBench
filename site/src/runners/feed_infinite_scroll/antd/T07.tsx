'use client';

/**
 * feed_infinite_scroll-antd-T07: Dashboard: find ALERT-042 in System alerts
 * 
 * Layout: dashboard with two side-by-side cards, each containing its own scrollable infinite List.
 * Left card: "Team activity" feed (ACT-xxx items). Right card: "System alerts" feed (ALERT-xxx items).
 * Both feeds look similar. The target ALERT-042 requires scrolling and lazy-loading.
 * The task must be completed in the "System alerts" feed.
 * 
 * Success: ALERT-042 is visible within the System alerts feed viewport (min_visible_ratio: 0.5)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, List, Spin, Typography, Row, Col, Statistic } from 'antd';
import { TeamOutlined, AlertOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
}

function generateActivityItems(start: number, count: number): FeedItem[] {
  const titles = [
    'User joined team',
    'Document updated',
    'Comment added',
    'File uploaded',
    'Meeting scheduled',
    'Task completed',
    'Project created',
    'Review submitted',
    'Feedback received',
    'Report generated',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `ACT-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      timestamp: `${Math.floor(Math.random() * 24) + 1}h ago`,
    });
  }
  return items;
}

function generateAlertItems(start: number, count: number): FeedItem[] {
  const titles = [
    'High memory usage',
    'CPU spike detected',
    'Disk space low',
    'Network latency',
    'API error rate high',
    'Service degraded',
    'Connection timeout',
    'Cache miss rate',
    'Queue backlog',
    'Health check failed',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `ALERT-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      timestamp: `${Math.floor(Math.random() * 60) + 1}m ago`,
    });
  }
  return items;
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [activityItems, setActivityItems] = useState<FeedItem[]>(() => generateActivityItems(1, 20));
  const [alertItems, setAlertItems] = useState<FeedItem[]>(() => generateAlertItems(1, 20));
  const [activityLoading, setActivityLoading] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);
  const alertContainerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check if target item is visible
  const checkVisibility = useCallback(() => {
    if (successCalledRef.current) return;
    
    const container = alertContainerRef.current;
    if (!container) return;

    const targetElement = container.querySelector('[data-item-id="ALERT-042"]');
    if (!targetElement) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    const visibleTop = Math.max(containerRect.top, targetRect.top);
    const visibleBottom = Math.min(containerRect.bottom, targetRect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visibilityRatio = visibleHeight / targetRect.height;

    if (visibilityRatio >= 0.5) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [onSuccess]);

  // Activity scroll handler
  const handleActivityScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !activityLoading && activityItems.length < 100) {
      setActivityLoading(true);
      setTimeout(() => {
        setActivityItems(prev => [...prev, ...generateActivityItems(prev.length + 1, 10)]);
        setActivityLoading(false);
      }, 500);
    }
  }, [activityLoading, activityItems.length]);

  // Alert scroll handler
  const handleAlertScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    checkVisibility();
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !alertLoading && alertItems.length < 100) {
      setAlertLoading(true);
      setTimeout(() => {
        setAlertItems(prev => [...prev, ...generateAlertItems(prev.length + 1, 10)]);
        setAlertLoading(false);
      }, 500);
    }
  }, [alertLoading, alertItems.length, checkVisibility]);

  useEffect(() => {
    checkVisibility();
  }, [checkVisibility, alertItems]);

  return (
    <div style={{ width: 900 }}>
      {/* Dashboard header */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
        <Statistic title="Active Users" value={1234} prefix={<TeamOutlined />} />
        <Statistic title="Open Alerts" value={42} prefix={<AlertOutlined />} />
        <ReloadOutlined style={{ fontSize: 18, color: '#999', cursor: 'pointer' }} />
      </div>
      
      <Row gutter={16}>
        {/* Team Activity Feed */}
        <Col span={12}>
          <Card title="Team activity" size="small">
            <div
              data-testid="feed-TeamActivity"
              style={{
                height: 350,
                overflow: 'auto',
              }}
              onScroll={handleActivityScroll}
            >
              <List
                size="small"
                dataSource={activityItems}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    data-item-id={item.id}
                    style={{ padding: '8px 12px' }}
                  >
                    <div style={{ width: '100%' }}>
                      <Text strong style={{ fontSize: 13 }}>{item.id}</Text>
                      <Text style={{ fontSize: 13 }}> — {item.title}</Text>
                      <div>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {item.timestamp}
                        </Text>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
              {activityLoading && (
                <div style={{ textAlign: 'center', padding: 8 }}>
                  <Spin size="small" />
                </div>
              )}
            </div>
          </Card>
        </Col>
        
        {/* System Alerts Feed */}
        <Col span={12}>
          <Card title="System alerts" size="small">
            <div
              ref={alertContainerRef}
              data-testid="feed-SystemAlerts"
              style={{
                height: 350,
                overflow: 'auto',
              }}
              onScroll={handleAlertScroll}
            >
              <List
                size="small"
                dataSource={alertItems}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    data-item-id={item.id}
                    style={{ padding: '8px 12px' }}
                  >
                    <div style={{ width: '100%' }}>
                      <Text strong style={{ fontSize: 13 }}>{item.id}</Text>
                      <Text style={{ fontSize: 13 }}> — {item.title}</Text>
                      <div>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {item.timestamp}
                        </Text>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
              {alertLoading && (
                <div style={{ textAlign: 'center', padding: 8 }}>
                  <Spin size="small" />
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
