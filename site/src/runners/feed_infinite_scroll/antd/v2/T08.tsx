'use client';

/**
 * feed_infinite_scroll-antd-v2-T08
 * Four feeds: bookmark only the payment row in the Payments feed
 *
 * Dashboard 2x2 grid: "Orders", "Payments", "Auth", "Ops". Dark theme,
 * compact, small scale. Each row has a trailing "Bookmarked" action.
 * Target PAY-244 in Payments. Click "Save feed state" to commit.
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, List, Spin, Typography, Button, Tag } from 'antd';
import { BookOutlined, BookFilled } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface FeedRow { id: string; title: string; }

function genFeed(prefix: string, count: number): FeedRow[] {
  const labels = ['Payment received', 'Refund issued', 'Card retry scheduled', 'Charge failed', 'Subscription renewed', 'Invoice sent', 'Payout initiated', 'Dispute opened'];
  const out: FeedRow[] = [];
  for (let i = 1; i <= count; i++) {
    out.push({ id: `${prefix}-${String(i).padStart(3, '0')}`, title: labels[i % labels.length] });
  }
  return out;
}

const FEEDS: { key: string; label: string; prefix: string; data: FeedRow[] }[] = [
  { key: 'orders', label: 'Orders', prefix: 'ORD', data: genFeed('ORD', 300) },
  { key: 'payments', label: 'Payments', prefix: 'PAY', data: genFeed('PAY', 300) },
  { key: 'auth', label: 'Auth', prefix: 'AUTH', data: genFeed('AUTH', 300) },
  { key: 'ops', label: 'Ops', prefix: 'OPS', data: genFeed('OPS', 300) },
];

const PAGE = 15;
const TARGET = 'PAY-244';

function CompactFeed({
  feed, testId, bookmarks, onToggle,
}: {
  feed: FeedRow[]; testId: string;
  bookmarks: Set<string>; onToggle: (id: string) => void;
}) {
  const [count, setCount] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const visible = feed.slice(0, count);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 80 && !loading && count < feed.length) {
        setLoading(true);
        setTimeout(() => {
          setCount((c) => Math.min(c + PAGE, feed.length));
          setLoading(false);
        }, 300);
      }
    },
    [loading, count, feed.length],
  );

  return (
    <div data-testid={testId} style={{ height: 200, overflow: 'auto' }} onScroll={handleScroll}>
      <List
        size="small"
        dataSource={visible}
        renderItem={(item) => (
          <List.Item key={item.id} data-item-id={item.id} style={{ padding: '3px 8px', display: 'flex', alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: '#d9d9d9', flex: 1 }}>
              <Text strong style={{ fontSize: 11, color: '#d9d9d9' }}>{item.id}</Text> — {item.title}
            </Text>
            <span
              onClick={(e) => { e.stopPropagation(); onToggle(item.id); }}
              style={{ cursor: 'pointer', marginLeft: 4 }}
              data-testid={`bookmark-${item.id}`}
              title="Bookmarked"
            >
              {bookmarks.has(item.id)
                ? <BookFilled style={{ color: '#faad14', fontSize: 13 }} />
                : <BookOutlined style={{ color: '#555', fontSize: 13 }} />}
            </span>
          </List.Item>
        )}
      />
      {loading && <div style={{ textAlign: 'center', padding: 4 }}><Spin size="small" /></div>}
      <div style={{ fontSize: 9, color: '#444', textAlign: 'center' }}>{visible.length}/{feed.length}</div>
    </div>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [bookmarks, setBookmarks] = useState<Record<string, Set<string>>>({
    orders: new Set(), payments: new Set(), auth: new Set(), ops: new Set(),
  });
  const successRef = useRef(false);

  const toggle = (feedKey: string, id: string) => {
    setBookmarks((prev) => {
      const next = { ...prev };
      const s = new Set(prev[feedKey]);
      s.has(id) ? s.delete(id) : s.add(id);
      next[feedKey] = s;
      return next;
    });
  };

  const handleSave = () => {
    if (successRef.current) return;
    const payBm = bookmarks.payments;
    if (
      payBm.has(TARGET) &&
      payBm.size === 1 &&
      bookmarks.orders.size === 0 &&
      bookmarks.auth.size === 0 &&
      bookmarks.ops.size === 0
    ) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ background: '#141414', padding: 12, minHeight: 480 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
        <Tag>Dashboard</Tag>
        <Button size="small" type="primary" onClick={handleSave} data-testid="save-feed-state">
          Save feed state
        </Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {FEEDS.map((f) => (
          <Card
            key={f.key}
            size="small"
            title={<span style={{ color: '#d9d9d9', fontSize: 12 }}>{f.label}</span>}
            style={{ background: '#1f1f1f', borderColor: '#303030' }}
            styles={{ body: { padding: 0 } }}
          >
            <CompactFeed
              feed={f.data}
              testId={`feed-${f.key}`}
              bookmarks={bookmarks[f.key]}
              onToggle={(id) => toggle(f.key, id)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
