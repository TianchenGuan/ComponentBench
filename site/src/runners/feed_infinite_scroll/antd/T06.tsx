'use client';

/**
 * feed_infinite_scroll-antd-T06: Audit Log modal: open AUD-072
 * 
 * Layout: modal_flow. The page shows a compact card titled "Security" with a primary button "View audit log".
 * Clicking "View audit log" opens an AntD Modal.
 * Inside the modal is an "Audit Log" infinite-scrolling List with fixed height.
 * Clicking an audit row expands a small details panel inside the modal.
 * 
 * Success: active_item_id equals AUD-072 and expanded is true
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Modal, List, Spin, Typography } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;

interface FeedItem {
  id: string;
  title: string;
  timestamp: string;
  details: string;
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'API key created',
    'User login',
    'Password changed',
    'Permission updated',
    'Settings modified',
    'Account locked',
    'Token refreshed',
    'Role assigned',
    'Access granted',
    'Config saved',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `AUD-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
      timestamp: `${Math.floor(Math.random() * 24) + 1}h ago`,
      details: `Audit entry ${id}: User performed action. IP: 192.168.1.${Math.floor(Math.random() * 255)}. Session ID: sess_${Math.random().toString(36).substr(2, 9)}`,
    });
  }
  return items;
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 20));
  const [loading, setLoading] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && activeItemId === 'AUD-072') {
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
        setItems(prev => [...prev, ...generateItems(prev.length + 1, 20)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  return (
    <>
      <Card title="Security" style={{ width: 300 }}>
        <Button
          type="primary"
          icon={<FileSearchOutlined />}
          onClick={() => setModalOpen(true)}
        >
          View audit log
        </Button>
      </Card>

      <Modal
        title="Audit Log"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
        data-testid="audit-modal"
      >
        <div
          ref={containerRef}
          data-testid="feed-Audit"
          data-active-item-id={activeItemId}
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
      </Modal>
    </>
  );
}
