'use client';

/**
 * virtual_list-antd-v2-T02
 * Primary reviewers: filter then activate result and apply
 *
 * Two side-by-side cards ("Primary reviewers" / "Watchers"), each with its own
 * filter + virtualized list. Agent must filter Primary to KEY-7F2A, select it,
 * and click "Apply reviewers" without changing Watchers.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, Input, Button, Tag, Typography, Space } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;
const { Search } = Input;

interface ListItem {
  key: string;
  code: string;
  label: string;
}

const categories = ['Analytics', 'Platform', 'Billing', 'Security', 'Infra', 'DevOps', 'ML', 'QA'];

function buildItems(prefix: string, count: number): ListItem[] {
  const items: ListItem[] = [];
  for (let i = 0; i < count; i++) {
    const hex = i.toString(16).toUpperCase().padStart(4, '0');
    items.push({
      key: `${prefix.toLowerCase()}-${hex.toLowerCase()}`,
      code: `${prefix}-${hex}`,
      label: categories[i % categories.length],
    });
  }
  return items;
}

const primaryItems = buildItems('KEY', 800);
primaryItems.splice(523, 0, { key: 'key-7f2a', code: 'KEY-7F2A', label: 'Analytics' });
const watcherItems = buildItems('WCH', 600);

export default function T02({ onSuccess }: TaskComponentProps) {
  const [primaryFilter, setPrimaryFilter] = useState('');
  const [watcherFilter, setWatcherFilter] = useState('');
  const [primarySelected, setPrimarySelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successRef = useRef(false);

  const filteredPrimary = useMemo(
    () => primaryFilter
      ? primaryItems.filter(i => `${i.code} — ${i.label}`.toLowerCase().includes(primaryFilter.toLowerCase()))
      : primaryItems,
    [primaryFilter],
  );
  const filteredWatcher = useMemo(
    () => watcherFilter
      ? watcherItems.filter(i => `${i.code} — ${i.label}`.toLowerCase().includes(watcherFilter.toLowerCase()))
      : watcherItems,
    [watcherFilter],
  );

  useEffect(() => {
    if (successRef.current) return;
    if (saved && primarySelected === 'key-7f2a') {
      successRef.current = true;
      onSuccess();
    }
  }, [saved, primarySelected, onSuccess]);

  const handleApply = () => {
    if (primarySelected) setSaved(true);
  };

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ marginBottom: 8 }}>
        <Tag>Severity: Medium</Tag>
        <Tag color="blue">Rollout 0.4%</Tag>
      </Space>

      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <Card size="small" title="Primary reviewers" style={{ flex: 1, maxWidth: 380 }} data-testid="primary-card">
          <Search
            placeholder="Filter primary..."
            size="small"
            onChange={e => { setPrimaryFilter(e.target.value); setSaved(false); }}
            style={{ marginBottom: 8 }}
            data-testid="primary-filter"
          />
          <div style={{ border: '1px solid #f0f0f0', borderRadius: 4 }}>
            <VirtualList data={filteredPrimary} height={300} itemHeight={42} itemKey="key">
              {(item: ListItem) => (
                <div
                  key={item.key}
                  data-item-key={item.key}
                  aria-selected={primarySelected === item.key}
                  onClick={() => { setPrimarySelected(item.key); setSaved(false); }}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f5f5f5',
                    backgroundColor: primarySelected === item.key ? '#e6f4ff' : 'transparent',
                    fontSize: 13,
                  }}
                >
                  {item.code} — {item.label}
                </div>
              )}
            </VirtualList>
          </div>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
            Selected: {primarySelected ?? 'none'}
          </Text>
        </Card>

        <Card size="small" title="Watchers" style={{ flex: 1, maxWidth: 380 }} data-testid="watcher-card">
          <Search
            placeholder="Filter watchers..."
            size="small"
            onChange={e => setWatcherFilter(e.target.value)}
            style={{ marginBottom: 8 }}
            data-testid="watcher-filter"
          />
          <div style={{ border: '1px solid #f0f0f0', borderRadius: 4 }}>
            <VirtualList data={filteredWatcher} height={300} itemHeight={42} itemKey="key">
              {(item: ListItem) => (
                <div key={item.key} style={{ padding: '8px 12px', borderBottom: '1px solid #f5f5f5', fontSize: 13 }}>
                  {item.code} — {item.label}
                </div>
              )}
            </VirtualList>
          </div>
        </Card>
      </div>

      <Button type="primary" onClick={handleApply} disabled={!primarySelected}>
        Apply reviewers
      </Button>
    </div>
  );
}
