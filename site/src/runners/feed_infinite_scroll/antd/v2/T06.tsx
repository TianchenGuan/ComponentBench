'use client';

/**
 * feed_infinite_scroll-antd-v2-T06
 * Build log feed: visibility-gated reveal in nested scroll
 *
 * Nested scroll layout, bottom_right placement, high clutter.
 * Page has a long deployment summary with page scroll. Right pane has
 * "Build log" feed (AntD List, on-scroll loading). Target LOG-184 must
 * be truly visible in the feed viewport (min_visible_ratio 0.5).
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, List, Spin, Typography, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Paragraph } = Typography;

interface LogRow { id: string; title: string; ts: string; }

const LOG_TITLES: Record<number, string> = {
  1: 'Build started', 10: 'Dependencies installed', 20: 'Lint passed',
  30: 'Unit tests passed', 50: 'Bundle created', 80: 'Integration tests running',
  100: 'Docker image built', 120: 'Security scan passed', 140: 'Staging deploy started',
  160: 'E2E tests passed', 184: 'Asset fingerprint complete', 200: 'Production deploy ready',
  220: 'Cache invalidated',
};

function genLogs(start: number, count: number): LogRow[] {
  const out: LogRow[] = [];
  for (let i = start; i < start + count; i++) {
    out.push({
      id: `LOG-${String(i).padStart(3, '0')}`,
      title: LOG_TITLES[i] || `Build step ${i}`,
      ts: `${i * 2}s`,
    });
  }
  return out;
}

const TOTAL = 220;
const PAGE = 20;
const TARGET = 'LOG-184';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<LogRow[]>(() => genLogs(1, PAGE));
  const [loading, setLoading] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const successRef = useRef(false);

  const checkVisibility = useCallback(() => {
    if (successRef.current || !feedRef.current) return;
    const el = feedRef.current.querySelector(`[data-item-id="${TARGET}"]`);
    if (!el) return;
    const cRect = feedRef.current.getBoundingClientRect();
    const tRect = el.getBoundingClientRect();
    const visTop = Math.max(cRect.top, tRect.top);
    const visBot = Math.min(cRect.bottom, tRect.bottom);
    const ratio = Math.max(0, visBot - visTop) / tRect.height;
    if (ratio >= 0.5) {
      successRef.current = true;
      onSuccess();
    }
  }, [onSuccess]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      checkVisibility();
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && items.length < TOTAL) {
        setLoading(true);
        setTimeout(() => {
          setItems((prev) => [...prev, ...genLogs(prev.length + 1, PAGE)]);
          setLoading(false);
        }, 400);
      }
    },
    [loading, items.length, checkVisibility],
  );

  useEffect(() => { checkVisibility(); }, [items, checkVisibility]);

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, minHeight: 500 }}>
      <div style={{ flex: 1, maxHeight: 500, overflow: 'auto' }}>
        <Card title="Deployment summary" size="small">
          <Tag color="blue">v2.14.0</Tag>
          <Tag color="green">Staging OK</Tag>
          <Paragraph style={{ fontSize: 12, marginTop: 8 }}>
            This deployment includes 47 changed files across 12 services.
            Performance regression tests completed with no regressions detected.
            Security audit passed with zero high-severity findings.
          </Paragraph>
          {Array.from({ length: 20 }, (_, i) => (
            <Paragraph key={i} style={{ fontSize: 11, color: '#888' }}>
              Service {i + 1}: {i % 3 === 0 ? 'Updated' : i % 3 === 1 ? 'No changes' : 'Config only'}.
              Deployment window scheduled. Rollback plan verified.
            </Paragraph>
          ))}
        </Card>
      </div>
      <Card
        title="Build log"
        size="small"
        style={{ width: 400, flexShrink: 0 }}
        styles={{ body: { padding: 0 } }}
      >
        <div
          ref={feedRef}
          data-testid="feed-build-log"
          style={{ height: 380, overflow: 'auto' }}
          onScroll={handleScroll}
        >
          <List
            size="small"
            dataSource={items}
            renderItem={(item) => (
              <List.Item key={item.id} data-item-id={item.id} style={{ padding: '4px 10px' }}>
                <Text strong style={{ fontSize: 12 }}>{item.id}</Text>
                <Text style={{ fontSize: 12, marginLeft: 6 }}> — {item.title}</Text>
                <Text type="secondary" style={{ fontSize: 10, marginLeft: 'auto' }}>{item.ts}</Text>
              </List.Item>
            )}
          />
          {loading && <div style={{ textAlign: 'center', padding: 8 }}><Spin size="small" /></div>}
        </div>
        <div style={{ padding: '4px 10px', fontSize: 10, color: '#999', borderTop: '1px solid #f0f0f0' }}>
          Loaded {items.length} / {TOTAL}
        </div>
      </Card>
    </div>
  );
}
