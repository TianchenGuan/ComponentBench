'use client';

/**
 * feed_infinite_scroll-antd-v2-T03
 * Incident feed search: filter, open the right result, then save
 *
 * Settings panel layout. "Incident feed" card with Input.Search.
 * Typing a query refreshes the feed. Target INC-1088 — "VPN login failure".
 * Open that row (expand), then click "Save incident choice".
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, Input, List, Spin, Typography, Button, Switch, Space } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;
const { Search } = Input;

interface IncidentRow { id: string; title: string; ts: string; }

const ALL_INCIDENTS: IncidentRow[] = (() => {
  const titles = [
    'VPN login failure', 'DNS resolution timeout', 'SSL handshake error',
    'VPN tunnel dropped', 'Auth service 503', 'VPN config mismatch',
    'Firewall rule conflict', 'VPN login failure', 'Cert expiry warning',
    'Gateway timeout', 'VPN session limit', 'Port scan detected',
  ];
  const out: IncidentRow[] = [];
  for (let i = 1; i <= 1200; i++) {
    out.push({
      id: `INC-${String(i).padStart(4, '0')}`,
      title: titles[i % titles.length],
      ts: `${(i * 5) % 48}h ago`,
    });
  }
  return out;
})();

const TARGET = 'INC-1088';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [query, setQuery] = useState('');
  const [displayed, setDisplayed] = useState<IncidentRow[]>(() => ALL_INCIDENTS.slice(0, 30));
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const successRef = useRef(false);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setExpandedId(null);
    if (!value.trim()) {
      setDisplayed(ALL_INCIDENTS.slice(0, 30));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const lower = value.toLowerCase();
      const filtered = ALL_INCIDENTS.filter(
        (r) => r.id.toLowerCase().includes(lower) || r.title.toLowerCase().includes(lower),
      );
      setDisplayed(filtered.slice(0, 50));
      setLoading(false);
    }, 500);
  }, []);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (query) return;
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && displayed.length < ALL_INCIDENTS.length) {
        setLoading(true);
        setTimeout(() => {
          setDisplayed((prev) => [...prev, ...ALL_INCIDENTS.slice(prev.length, prev.length + 20)]);
          setLoading(false);
        }, 400);
      }
    },
    [loading, displayed.length, query],
  );

  const handleSave = () => {
    if (expandedId === TARGET && !successRef.current) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16 }}>
      <div style={{ width: 180 }}>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Notifications</Text>
        <Switch size="small" defaultChecked /> <Text style={{ fontSize: 12 }}>Email</Text>
        <br />
        <Switch size="small" /> <Text style={{ fontSize: 12 }}>Slack</Text>
        <br />
        <Switch size="small" /> <Text style={{ fontSize: 12 }}>SMS</Text>
      </div>
      <Card
        title="Incident feed"
        style={{ flex: 1, maxWidth: 520 }}
        extra={
          <Button size="small" type="primary" onClick={handleSave} data-testid="save-incident">
            Save incident choice
          </Button>
        }
      >
        <Search
          placeholder="Search incidents…"
          onSearch={handleSearch}
          onChange={(e) => { if (!e.target.value) handleSearch(''); }}
          allowClear
          style={{ marginBottom: 8 }}
          data-testid="incident-search"
        />
        <div data-testid="feed-incidents" style={{ height: 360, overflow: 'auto' }} onScroll={handleScroll}>
          {loading && displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24 }}><Spin /></div>
          ) : (
            <List
              size="small"
              dataSource={displayed}
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
                        Incident {item.id}: {item.title}. Severity medium. Assigned to on-call.
                      </div>
                    )}
                  </List.Item>
                );
              }}
            />
          )}
          {loading && displayed.length > 0 && (
            <div style={{ textAlign: 'center', padding: 8 }}><Spin size="small" /></div>
          )}
        </div>
      </Card>
    </div>
  );
}
