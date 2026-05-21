'use client';

/**
 * feed_infinite_scroll-antd-v2-T04
 * Primary queue feed: exact four-ticket selection and apply
 *
 * Dashboard with "Primary queue" and "Secondary queue" feeds.
 * Checkbox rows, dark theme. Select exactly TCK-021, TCK-024, TCK-027, TCK-031
 * in Primary queue, then click "Apply selection".
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, List, Spin, Typography, Button, Checkbox, Space, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface QueueRow { id: string; title: string; }

function genQueue(prefix: string, count: number): QueueRow[] {
  const labels = ['Review pending', 'Needs triage', 'Awaiting response', 'Escalated', 'In progress', 'Blocked', 'Reopened', 'Deferred'];
  const out: QueueRow[] = [];
  for (let i = 1; i <= count; i++) {
    out.push({ id: `${prefix}-${String(i).padStart(3, '0')}`, title: labels[i % labels.length] });
  }
  return out;
}

const ALL_PRIMARY = genQueue('TCK', 200);
const ALL_SECONDARY = genQueue('SEC', 200);
const PAGE = 20;
const TARGET_IDS = new Set(['TCK-021', 'TCK-024', 'TCK-027', 'TCK-031']);

function CheckboxFeed({
  allItems, testId, checked, onToggle,
}: {
  allItems: QueueRow[]; testId: string;
  checked: Set<string>; onToggle: (id: string) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const items = allItems.slice(0, visibleCount);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && visibleCount < allItems.length) {
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((c) => Math.min(c + PAGE, allItems.length));
          setLoading(false);
        }, 350);
      }
    },
    [loading, visibleCount, allItems.length],
  );

  return (
    <div data-testid={testId} style={{ height: 280, overflow: 'auto' }} onScroll={handleScroll}>
      <List
        size="small"
        dataSource={items}
        renderItem={(item) => (
          <List.Item key={item.id} data-item-id={item.id} style={{ padding: '4px 10px' }}>
            <Checkbox
              checked={checked.has(item.id)}
              onChange={() => onToggle(item.id)}
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 12, color: '#d9d9d9' }}>{item.id}</Text>
            <Text style={{ fontSize: 11, color: '#888', marginLeft: 6 }}>{item.title}</Text>
          </List.Item>
        )}
      />
      {loading && <div style={{ textAlign: 'center', padding: 6 }}><Spin size="small" /></div>}
      <div style={{ fontSize: 10, color: '#555', textAlign: 'center', padding: 4 }}>
        {items.length} / {allItems.length}
      </div>
    </div>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [primaryChecked, setPrimaryChecked] = useState<Set<string>>(new Set());
  const [secondaryChecked, setSecondaryChecked] = useState<Set<string>>(new Set());
  const successRef = useRef(false);

  const togglePrimary = (id: string) => {
    setPrimaryChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSecondary = (id: string) => {
    setSecondaryChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleApply = () => {
    if (successRef.current) return;
    if (
      primaryChecked.size === TARGET_IDS.size &&
      Array.from(TARGET_IDS).every((id) => primaryChecked.has(id))
    ) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ background: '#141414', padding: 16, minHeight: 440, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Space style={{ marginBottom: 10 }}>
        <Tag>Open: 42</Tag>
        <Tag color="red">Critical: 3</Tag>
      </Space>
      <Card
        size="small"
        title={<span style={{ color: '#d9d9d9' }}>Primary queue</span>}
        style={{ width: 420, background: '#1f1f1f', borderColor: '#303030', marginBottom: 10 }}
        styles={{ body: { padding: 0 } }}
        extra={
          <Button size="small" type="primary" onClick={handleApply} data-testid="apply-primary">
            Apply selection
          </Button>
        }
      >
        <CheckboxFeed allItems={ALL_PRIMARY} testId="feed-primary-queue" checked={primaryChecked} onToggle={togglePrimary} />
        <div style={{ padding: '4px 10px', fontSize: 10, color: '#666' }}>
          Pending: {primaryChecked.size} selected
        </div>
      </Card>
      <Card
        size="small"
        title={<span style={{ color: '#d9d9d9' }}>Secondary queue</span>}
        style={{ width: 420, background: '#1f1f1f', borderColor: '#303030' }}
        styles={{ body: { padding: 0 } }}
      >
        <CheckboxFeed allItems={ALL_SECONDARY} testId="feed-secondary-queue" checked={secondaryChecked} onToggle={toggleSecondary} />
      </Card>
    </div>
  );
}
