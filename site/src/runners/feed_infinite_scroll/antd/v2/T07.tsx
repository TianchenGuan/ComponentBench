'use client';

/**
 * feed_infinite_scroll-antd-v2-T07
 * Deployment events drawer: open target row and acknowledge selection
 *
 * Drawer flow, compact spacing. "View deployment events" opens a right AntD Drawer.
 * Feed with on-scroll loading, rows can expand inline. Target EVT-063.
 * Click "Acknowledge selected" to commit.
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, Drawer, Button, List, Spin, Typography, Tag, Space } from 'antd';
import { DeploymentUnitOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface EvtRow { id: string; title: string; ts: string; }

const EVT_TITLES: Record<number, string> = {
  1: 'Deploy initiated', 10: 'Health check passed', 15: 'Canary promoted',
  20: 'Traffic shifted 25%', 30: 'Traffic shifted 50%', 40: 'Metrics stable',
  50: 'Traffic shifted 100%', 63: 'Rollback requested', 70: 'Rollback completed',
  80: 'Post-mortem scheduled', 90: 'All-clear issued',
};

function genEvents(start: number, count: number): EvtRow[] {
  const out: EvtRow[] = [];
  for (let i = start; i < start + count; i++) {
    out.push({
      id: `EVT-${String(i).padStart(3, '0')}`,
      title: EVT_TITLES[i] || `Deployment event ${i}`,
      ts: `${(i * 4) % 60}m ago`,
    });
  }
  return out;
}

const TOTAL = 120;
const PAGE = 15;
const TARGET = 'EVT-063';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState<EvtRow[]>(() => genEvents(1, PAGE));
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const successRef = useRef(false);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && items.length < TOTAL) {
        setLoading(true);
        setTimeout(() => {
          setItems((prev) => [...prev, ...genEvents(prev.length + 1, PAGE)]);
          setLoading(false);
        }, 400);
      }
    },
    [loading, items.length],
  );

  const handleAcknowledge = () => {
    if (expandedId === TARGET && !successRef.current) {
      successRef.current = true;
      setDrawerOpen(false);
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ width: 380 }} title={<span><DeploymentUnitOutlined style={{ marginRight: 8 }} />Deployment summary</span>}>
        <Space direction="vertical" size="small">
          <Tag color="blue">v3.2.1</Tag>
          <Tag color="green">Canary: healthy</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>Last deploy: 35 min ago</Text>
          <Button type="primary" onClick={() => setDrawerOpen(true)}>
            View deployment events
          </Button>
        </Space>
      </Card>

      <Drawer
        title="Deployment events"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={460}
        extra={
          <Button
            type="primary"
            size="small"
            disabled={!expandedId}
            onClick={handleAcknowledge}
            data-testid="acknowledge-selected"
          >
            Acknowledge selected
          </Button>
        }
      >
        {expandedId && (
          <div style={{ marginBottom: 8, fontSize: 11, color: '#999' }}>
            Selected: <Tag color="blue" style={{ fontSize: 11 }}>{expandedId}</Tag>
          </div>
        )}
        <div data-testid="feed-deployment-events" style={{ height: 400, overflow: 'auto' }} onScroll={handleScroll}>
          <List
            size="small"
            dataSource={items}
            renderItem={(item) => {
              const isExp = expandedId === item.id;
              return (
                <List.Item
                  key={item.id}
                  data-item-id={item.id}
                  style={{
                    cursor: 'pointer',
                    background: isExp ? '#e6f4ff' : 'transparent',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '6px 10px',
                  }}
                  onClick={() => setExpandedId(isExp ? null : item.id)}
                >
                  <div style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: 12 }}>{item.id}</Text>
                    <Text style={{ fontSize: 12 }}> — {item.title}</Text>
                    <Text type="secondary" style={{ fontSize: 10, float: 'right' }}>{item.ts}</Text>
                  </div>
                  {isExp && (
                    <div style={{ marginTop: 4, padding: '4px 8px', background: '#f5f5f5', borderRadius: 4, fontSize: 11, width: '100%' }}>
                      Event {item.id}: {item.title}. Status: acknowledged pending review. Trace ID: {item.id.toLowerCase()}-trace.
                    </div>
                  )}
                </List.Item>
              );
            }}
          />
          {loading && <div style={{ textAlign: 'center', padding: 8 }}><Spin size="small" /></div>}
        </div>
        <div style={{ fontSize: 10, color: '#999', textAlign: 'center', marginTop: 4 }}>
          Loaded {items.length} / {TOTAL}
        </div>
      </Drawer>
    </div>
  );
}
