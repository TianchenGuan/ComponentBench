'use client';

/**
 * feed_infinite_scroll-antd-v2-T02
 * System alerts card: select the right feed item, not the team feed twin
 *
 * Dashboard with two adjacent feeds: "Team activity" and "System alerts".
 * Dark theme, compact spacing. Target ALERT-188 in System alerts only.
 * ACT-188 exists in Team activity as a decoy. Expand + "Save alerts card".
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, List, Spin, Typography, Button, Space, Tag } from 'antd';
import { AlertOutlined, TeamOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface FeedRow { id: string; title: string; ts: string; }

const ALERT_TITLES: Record<number, string> = {
  1: 'CPU threshold exceeded', 10: 'Memory spike detected', 20: 'Disk usage warning',
  30: 'Network latency high', 50: 'Connection pool exhausted', 80: 'Request timeout surge',
  88: 'Queue depth spike', 100: 'Health check failed', 120: 'SSL cert expiring',
  150: 'Rate limit triggered', 170: 'Error budget consumed', 188: 'Queue depth spike',
};

const ACT_TITLES: Record<number, string> = {
  1: 'User onboarded', 10: 'Sprint started', 20: 'PR merged', 50: 'Deploy completed',
  80: 'Feature flagged', 100: 'Incident resolved', 150: 'Retro scheduled',
  188: 'Queue depth spike', 200: 'Release tagged',
};

function genRows(prefix: string, titles: Record<number, string>, start: number, count: number): FeedRow[] {
  const out: FeedRow[] = [];
  for (let i = start; i < start + count; i++) {
    out.push({ id: `${prefix}-${String(i).padStart(3, '0')}`, title: titles[i] || `Event ${i}`, ts: `${(i * 3) % 24}h ago` });
  }
  return out;
}

const TOTAL = 250;
const PAGE = 20;

function InfiniteFeed({
  prefix, titles, testId, expandedId, onExpand,
}: {
  prefix: string; titles: Record<number, string>; testId: string;
  expandedId: string | null; onExpand: (id: string | null) => void;
}) {
  const [items, setItems] = useState<FeedRow[]>(() => genRows(prefix, titles, 1, PAGE));
  const [loading, setLoading] = useState(false);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && items.length < TOTAL) {
        setLoading(true);
        setTimeout(() => {
          setItems((prev) => [...prev, ...genRows(prefix, titles, prev.length + 1, PAGE)]);
          setLoading(false);
        }, 400);
      }
    },
    [loading, items.length, prefix, titles],
  );

  return (
    <div data-testid={testId} style={{ height: 320, overflow: 'auto' }} onScroll={handleScroll}>
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
                background: isExp ? 'rgba(24,144,255,0.15)' : 'transparent',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '6px 10px',
              }}
              onClick={() => onExpand(isExp ? null : item.id)}
            >
              <div style={{ width: '100%' }}>
                <Text strong style={{ fontSize: 12, color: '#d9d9d9' }}>{item.id}</Text>
                <Text style={{ fontSize: 12, color: '#bbb' }}> — {item.title}</Text>
                <Text style={{ fontSize: 10, color: '#666', float: 'right' }}>{item.ts}</Text>
              </div>
              {isExp && (
                <div style={{ marginTop: 4, padding: '4px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 4, fontSize: 11, color: '#aaa', width: '100%' }}>
                  Details for {item.id}: {item.title}. Occurred at {item.ts}.
                </div>
              )}
            </List.Item>
          );
        }}
      />
      {loading && <div style={{ textAlign: 'center', padding: 8 }}><Spin size="small" /></div>}
      <div style={{ fontSize: 10, color: '#555', textAlign: 'center', padding: 4 }}>
        Loaded {items.length} / {TOTAL}
      </div>
    </div>
  );
}

const TARGET = 'ALERT-188';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [alertExpanded, setAlertExpanded] = useState<string | null>(null);
  const [teamExpanded, setTeamExpanded] = useState<string | null>(null);
  const successRef = useRef(false);

  const handleSave = () => {
    if (alertExpanded === TARGET && !successRef.current) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ background: '#141414', padding: 16, minHeight: 480 }}>
      <Space style={{ marginBottom: 12 }}>
        <Tag color="blue">Uptime 99.7%</Tag>
        <Tag color="green">0 critical</Tag>
        <Tag>Last sync: 2 min ago</Tag>
      </Space>
      <div style={{ display: 'flex', gap: 12 }}>
        <Card
          size="small"
          title={<span style={{ color: '#d9d9d9' }}><TeamOutlined style={{ marginRight: 6 }} />Team activity</span>}
          style={{ flex: 1, background: '#1f1f1f', borderColor: '#303030' }}
          styles={{ body: { padding: 0 } }}
        >
          <InfiniteFeed prefix="ACT" titles={ACT_TITLES} testId="feed-team-activity" expandedId={teamExpanded} onExpand={setTeamExpanded} />
        </Card>
        <Card
          size="small"
          title={<span style={{ color: '#d9d9d9' }}><AlertOutlined style={{ marginRight: 6 }} />System alerts</span>}
          style={{ flex: 1, background: '#1f1f1f', borderColor: '#303030' }}
          styles={{ body: { padding: 0 } }}
          extra={
            <Button size="small" type="primary" onClick={handleSave} data-testid="save-alerts">
              Save alerts card
            </Button>
          }
        >
          <InfiniteFeed prefix="ALERT" titles={ALERT_TITLES} testId="feed-system-alerts" expandedId={alertExpanded} onExpand={setAlertExpanded} />
        </Card>
      </div>
    </div>
  );
}
