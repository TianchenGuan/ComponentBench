'use client';

/**
 * virtual_list-mantine-v2-T02
 * Live results: filter then activate result and apply
 *
 * Two side-by-side cards ("Live results" / "Fallback results"). Agent must
 * filter Live to RUN-7F2A Analytics, select it, and click "Apply result".
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Paper, Text, TextInput, Button, Group, Badge, Box } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../../types';

interface ListItem { key: string; code: string; label: string; }

const cats = ['Analytics', 'Platform', 'Billing', 'Security', 'Infra', 'DevOps', 'ML', 'QA'];

function buildItems(prefix: string, count: number): ListItem[] {
  return Array.from({ length: count }, (_, i) => {
    const hex = i.toString(16).toUpperCase().padStart(4, '0');
    return { key: `${prefix.toLowerCase()}-${hex.toLowerCase()}`, code: `${prefix}-${hex}`, label: cats[i % cats.length] };
  });
}

const liveItems = buildItems('RUN', 800);
liveItems.splice(523, 0, { key: 'run-7f2a', code: 'RUN-7F2A', label: 'Analytics' });
const fallbackItems = buildItems('FBK', 600);

function VList({ items, selected, onSelect, parentRef }: {
  items: ListItem[]; selected: string | null; onSelect?: (k: string) => void; parentRef: React.RefObject<HTMLDivElement>;
}) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  return (
    <Box ref={parentRef} style={{ height: 280, overflow: 'auto', border: '1px solid #e9ecef', borderRadius: 4 }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
        {virtualizer.getVirtualItems().map((vr: VirtualItem) => {
          const item = items[vr.index];
          return (
            <div
              key={item.key}
              data-item-key={item.key}
              aria-selected={selected === item.key}
              onClick={() => onSelect?.(item.key)}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%',
                height: `${vr.size}px`,
                transform: `translateY(${vr.start}px)`,
                padding: '8px 12px',
                cursor: onSelect ? 'pointer' : 'default',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: selected === item.key ? '#e7f5ff' : 'transparent',
                fontSize: 13,
              }}
            >
              {item.code} — {item.label}
            </div>
          );
        })}
      </div>
    </Box>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [liveFilter, setLiveFilter] = useState('');
  const [fbFilter, setFbFilter] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null!);
  const fbRef = useRef<HTMLDivElement>(null!);
  const successRef = useRef(false);

  const filteredLive = useMemo(
    () => liveFilter ? liveItems.filter(i => `${i.code} — ${i.label}`.toLowerCase().includes(liveFilter.toLowerCase())) : liveItems,
    [liveFilter],
  );
  const filteredFb = useMemo(
    () => fbFilter ? fallbackItems.filter(i => `${i.code} — ${i.label}`.toLowerCase().includes(fbFilter.toLowerCase())) : fallbackItems,
    [fbFilter],
  );

  useEffect(() => {
    if (successRef.current) return;
    if (saved && selected === 'run-7f2a') { successRef.current = true; onSuccess(); }
  }, [saved, selected, onSuccess]);

  return (
    <div style={{ padding: 16 }}>
      <Group gap="xs" mb="xs">
        <Badge size="sm">Region: us-east-1</Badge>
        <Badge size="sm" color="orange">Latency: 42ms</Badge>
      </Group>

      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <Paper shadow="xs" p="sm" withBorder style={{ flex: 1, maxWidth: 380 }} data-testid="live-card">
          <Text fw={600} size="sm" mb={4}>Live results</Text>
          <TextInput size="xs" placeholder="Filter live..." value={liveFilter}
            onChange={e => { setLiveFilter(e.target.value); setSaved(false); }} mb={6} data-testid="live-filter" />
          <VList items={filteredLive} selected={selected}
            onSelect={(k) => { setSelected(k); setSaved(false); }} parentRef={liveRef} />
          <Text size="xs" c="dimmed" mt={4}>Selected: {selected ?? 'none'}</Text>
        </Paper>

        <Paper shadow="xs" p="sm" withBorder style={{ flex: 1, maxWidth: 380 }} data-testid="fallback-card">
          <Text fw={600} size="sm" mb={4}>Fallback results</Text>
          <TextInput size="xs" placeholder="Filter fallback..." value={fbFilter}
            onChange={e => setFbFilter(e.target.value)} mb={6} data-testid="fallback-filter" />
          <VList items={filteredFb} selected={null} parentRef={fbRef} />
        </Paper>
      </div>

      <Button onClick={() => setSaved(true)} disabled={!selected}>Apply result</Button>
    </div>
  );
}
