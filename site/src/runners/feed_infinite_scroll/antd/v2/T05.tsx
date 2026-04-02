'use client';

/**
 * feed_infinite_scroll-antd-v2-T05
 * Saved posts feed: visual icon match (reference card)
 *
 * Inline surface, dark theme. "Reference icon" badge above "Saved posts" feed.
 * Rows have a leading icon badge, ID, title, and status pill.
 * The unique row matching the reference icon must be found by scrolling; click "Use post" to commit.
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, List, Spin, Typography, Button, Tag } from 'antd';
import {
  StarOutlined, HeartOutlined, FireOutlined, ThunderboltOutlined,
  CrownOutlined, RocketOutlined, BulbOutlined, TrophyOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const ICONS = [StarOutlined, HeartOutlined, FireOutlined, ThunderboltOutlined, CrownOutlined, RocketOutlined, BulbOutlined, TrophyOutlined];
const ICON_COLORS = ['#faad14', '#ff4d4f', '#ff7a45', '#1890ff', '#722ed1', '#13c2c2', '#52c41a', '#eb2f96'];
const STATUSES = ['Active', 'Draft', 'Archived', 'Pinned', 'Pending'];
const STATUS_COLORS = ['green', 'blue', 'default', 'purple', 'orange'];

interface PostRow { id: string; title: string; iconIdx: number; statusIdx: number; }

const REFERENCE_ICON_IDX = 2;

function genPosts(count: number): PostRow[] {
  const out: PostRow[] = [];
  for (let i = 1; i <= count; i++) {
    out.push({
      id: `POST-${String(i).padStart(3, '0')}`,
      title: `Saved post item ${i}`,
      iconIdx: i === 34 ? REFERENCE_ICON_IDX : (i * 3 + i) % ICONS.length,
      statusIdx: i % STATUSES.length,
    });
  }
  return out;
}

const ALL_POSTS = genPosts(200);
const PAGE = 20;
const TARGET = 'POST-034';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<PostRow[]>(() => ALL_POSTS.slice(0, PAGE));
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successRef = useRef(false);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && items.length < ALL_POSTS.length) {
        setLoading(true);
        setTimeout(() => {
          setItems((prev) => ALL_POSTS.slice(0, prev.length + PAGE));
          setLoading(false);
        }, 350);
      }
    },
    [loading, items.length],
  );

  const handleUse = () => {
    if (activeId === TARGET && !successRef.current) {
      successRef.current = true;
      onSuccess();
    }
  };

  const RefIcon = ICONS[REFERENCE_ICON_IDX];

  return (
    <div style={{ background: '#141414', padding: 16, minHeight: 480 }}>
      <Card
        size="small"
        style={{ width: 120, background: '#1f1f1f', borderColor: '#303030', marginBottom: 12, textAlign: 'center' }}
        styles={{ body: { padding: 12 } }}
      >
        <RefIcon style={{ fontSize: 28, color: ICON_COLORS[REFERENCE_ICON_IDX] }} />
        <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>Reference icon</div>
      </Card>

      <Card
        size="small"
        title={<span style={{ color: '#d9d9d9' }}>Saved posts</span>}
        style={{ width: 440, background: '#1f1f1f', borderColor: '#303030' }}
        extra={
          <Button size="small" type="primary" onClick={handleUse} data-testid="use-post">
            Use post
          </Button>
        }
        styles={{ body: { padding: 0 } }}
      >
        <div data-testid="feed-saved-posts" style={{ height: 340, overflow: 'auto' }} onScroll={handleScroll}>
          <List
            size="small"
            dataSource={items}
            renderItem={(item) => {
              const Icon = ICONS[item.iconIdx];
              const isActive = activeId === item.id;
              return (
                <List.Item
                  key={item.id}
                  data-item-id={item.id}
                  style={{
                    cursor: 'pointer',
                    background: isActive ? 'rgba(24,144,255,0.15)' : 'transparent',
                    padding: '6px 10px',
                  }}
                  onClick={() => setActiveId(item.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                    <Icon style={{ fontSize: 18, color: ICON_COLORS[item.iconIdx] }} />
                    <Text strong style={{ fontSize: 12, color: '#d9d9d9' }}>{item.id}</Text>
                    <Text style={{ fontSize: 12, color: '#888', flex: 1 }}>{item.title}</Text>
                    <Tag color={STATUS_COLORS[item.statusIdx]} style={{ fontSize: 10 }}>
                      {STATUSES[item.statusIdx]}
                    </Tag>
                  </div>
                </List.Item>
              );
            }}
          />
          {loading && <div style={{ textAlign: 'center', padding: 8 }}><Spin size="small" /></div>}
        </div>
      </Card>
    </div>
  );
}
