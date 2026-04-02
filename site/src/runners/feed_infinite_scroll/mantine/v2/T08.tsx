'use client';

/**
 * feed_infinite_scroll-mantine-v2-T08
 * Four feeds: pin only the payments row in the Payments feed and save
 *
 * Dashboard 2x2 grid: "Orders", "Payments", "Auth", "Ops". Dark theme,
 * compact, small scale. Each row has trailing "Pinned" action.
 * Target PAY-244 in Payments. Click "Save feed panes".
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, Text, Button, ScrollArea, Group, Stack, Badge, Loader, ActionIcon, MantineProvider } from '@mantine/core';
import { IconPin, IconPinnedFilled } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

interface FeedRow { id: string; title: string; }

function genFeed(prefix: string, count: number): FeedRow[] {
  const labels = ['Payment received', 'Refund issued', 'Card retry scheduled', 'Charge failed', 'Subscription renewed', 'Invoice sent', 'Payout initiated', 'Dispute opened'];
  const out: FeedRow[] = [];
  for (let i = 1; i <= count; i++) {
    out.push({ id: `${prefix}-${String(i).padStart(3, '0')}`, title: labels[i % labels.length] });
  }
  return out;
}

const FEEDS: { key: string; label: string; data: FeedRow[] }[] = [
  { key: 'orders', label: 'Orders', data: genFeed('ORD', 300) },
  { key: 'payments', label: 'Payments', data: genFeed('PAY', 300) },
  { key: 'auth', label: 'Auth', data: genFeed('AUTH', 300) },
  { key: 'ops', label: 'Ops', data: genFeed('OPS', 300) },
];

const PAGE = 15;
const TARGET = 'PAY-244';

function CompactFeed({
  feed, testId, pins, onToggle,
}: {
  feed: FeedRow[]; testId: string;
  pins: Set<string>; onToggle: (id: string) => void;
}) {
  const [count, setCount] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const visible = feed.slice(0, count);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (pos: { x: number; y: number }) => {
      const vp = viewportRef.current;
      if (!vp) return;
      if (vp.scrollHeight - pos.y - vp.clientHeight < 80 && !loading && count < feed.length) {
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
    <ScrollArea h={200} viewportRef={viewportRef} onScrollPositionChange={handleScroll} data-testid={testId}>
      <Stack gap={0}>
        {visible.map((item) => (
          <Group key={item.id} data-item-id={item.id} justify="space-between" py={2} px={6} wrap="nowrap">
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <Text span fw={600} size="xs">{item.id}</Text>
              <Text span size="xs" c="dimmed" ml={4}>{item.title}</Text>
            </div>
            <ActionIcon
              variant="subtle"
              size="xs"
              onClick={() => onToggle(item.id)}
              data-testid={`pin-${item.id}`}
              title="Pinned"
            >
              {pins.has(item.id)
                ? <IconPinnedFilled size={13} color="var(--mantine-color-yellow-6)" />
                : <IconPin size={13} color="#666" />}
            </ActionIcon>
          </Group>
        ))}
      </Stack>
      {loading && <div style={{ textAlign: 'center', padding: 4 }}><Loader size="xs" /></div>}
      <Text size="xs" c="dimmed" ta="center" style={{ fontSize: 9 }}>{visible.length}/{feed.length}</Text>
    </ScrollArea>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [pins, setPins] = useState<Record<string, Set<string>>>({
    orders: new Set(), payments: new Set(), auth: new Set(), ops: new Set(),
  });
  const successRef = useRef(false);

  const toggle = (feedKey: string, id: string) => {
    setPins((prev) => {
      const next = { ...prev };
      const s = new Set(prev[feedKey]);
      s.has(id) ? s.delete(id) : s.add(id);
      next[feedKey] = s;
      return next;
    });
  };

  const handleSave = () => {
    if (successRef.current) return;
    const payPins = pins.payments;
    if (
      payPins.has(TARGET) &&
      payPins.size === 1 &&
      pins.orders.size === 0 &&
      pins.auth.size === 0 &&
      pins.ops.size === 0
    ) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ background: '#1a1b1e', padding: 12, minHeight: 480 }}>
        <Group justify="space-between" mb="xs">
          <Badge variant="light">Dashboard</Badge>
          <Button size="xs" onClick={handleSave} data-testid="save-feed-panes">
            Save feed panes
          </Button>
        </Group>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {FEEDS.map((f) => (
            <Card key={f.key} shadow="sm" padding="xs" radius="md" style={{ background: '#25262b' }}>
              <Text fw={600} size="xs" mb={4}>{f.label}</Text>
              <CompactFeed
                feed={f.data}
                testId={`feed-${f.key}`}
                pins={pins[f.key]}
                onToggle={(id) => toggle(f.key, id)}
              />
            </Card>
          ))}
        </div>
      </div>
    </MantineProvider>
  );
}
