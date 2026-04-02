'use client';

/**
 * feed_infinite_scroll-mantine-v2-T06
 * Changelog panel: visibility-gated reveal in nested ScrollArea
 *
 * Nested scroll layout, bottom_right placement, high clutter.
 * Page has release notes and metrics with page scroll. Right panel has
 * "Changelog" feed (Mantine ScrollArea, on-scroll loading).
 * Target CHG-184 must be truly visible (min_visible_ratio 0.5).
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, Text, ScrollArea, Stack, Badge, Loader, Group } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

interface LogRow { id: string; title: string; ts: string; }

const CHG_TITLES: Record<number, string> = {
  1: 'Initial commit', 10: 'Deps updated', 20: 'Lint fixes',
  30: 'Test coverage improved', 50: 'Feature flag added', 80: 'API rate limit changed',
  100: 'DB migration applied', 120: 'Cert rotated', 140: 'CDN rules updated',
  160: 'E2E suite expanded', 184: 'Cache refresh complete', 200: 'Docs published',
  220: 'Hotfix deployed',
};

function genChangelog(start: number, count: number): LogRow[] {
  const out: LogRow[] = [];
  for (let i = start; i < start + count; i++) {
    out.push({
      id: `CHG-${String(i).padStart(3, '0')}`,
      title: CHG_TITLES[i] || `Changelog entry ${i}`,
      ts: `${i * 2}s`,
    });
  }
  return out;
}

const TOTAL = 220;
const PAGE = 20;
const TARGET = 'CHG-184';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<LogRow[]>(() => genChangelog(1, PAGE));
  const [loading, setLoading] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const successRef = useRef(false);

  const checkVisibility = useCallback(() => {
    if (successRef.current) return;
    const vp = viewportRef.current;
    if (!vp) return;
    const el = vp.querySelector(`[data-item-id="${TARGET}"]`);
    if (!el) return;
    const cRect = vp.getBoundingClientRect();
    const tRect = (el as HTMLElement).getBoundingClientRect();
    const visTop = Math.max(cRect.top, tRect.top);
    const visBot = Math.min(cRect.bottom, tRect.bottom);
    const ratio = Math.max(0, visBot - visTop) / tRect.height;
    if (ratio >= 0.5) {
      successRef.current = true;
      onSuccess();
    }
  }, [onSuccess]);

  const handleScroll = useCallback(
    (pos: { x: number; y: number }) => {
      checkVisibility();
      const vp = viewportRef.current;
      if (!vp) return;
      if (vp.scrollHeight - pos.y - vp.clientHeight < 120 && !loading && items.length < TOTAL) {
        setLoading(true);
        setTimeout(() => {
          setItems((prev) => [...prev, ...genChangelog(prev.length + 1, PAGE)]);
          setLoading(false);
        }, 400);
      }
    },
    [loading, items.length, checkVisibility],
  );

  useEffect(() => { checkVisibility(); }, [items, checkVisibility]);

  return (
    <Group align="flex-start" gap="md" p="md" style={{ minHeight: 500 }}>
      <div style={{ flex: 1, maxHeight: 500, overflow: 'auto' }}>
        <Card shadow="sm" padding="md" radius="md">
          <Text fw={600} mb="xs">Release notes</Text>
          <Group gap="xs" mb="sm">
            <Badge color="blue">v5.1.0</Badge>
            <Badge color="green">Stable</Badge>
          </Group>
          {Array.from({ length: 20 }, (_, i) => (
            <Text key={i} size="xs" c="dimmed" mb={4}>
              Entry {i + 1}: System component updated. Backwards compatible changes applied.
              Migration guide available in the documentation portal.
            </Text>
          ))}
        </Card>
      </div>
      <Card shadow="sm" padding="xs" radius="md" w={400} style={{ flexShrink: 0 }}>
        <Text fw={600} size="sm" mb="xs">Changelog</Text>
        <ScrollArea
          h={380}
          viewportRef={viewportRef}
          onScrollPositionChange={handleScroll}
          data-testid="feed-changelog"
        >
          <Stack gap={0}>
            {items.map((item) => (
              <Group key={item.id} data-item-id={item.id} justify="space-between" py={3} px={8}>
                <div>
                  <Text span fw={600} size="xs">{item.id}</Text>
                  <Text span size="xs"> — {item.title}</Text>
                </div>
                <Text size="xs" c="dimmed">{item.ts}</Text>
              </Group>
            ))}
          </Stack>
          {loading && <div style={{ textAlign: 'center', padding: 6 }}><Loader size="xs" /></div>}
        </ScrollArea>
        <Text size="xs" c="dimmed" ta="center" py={4} style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          Loaded {items.length} / {TOTAL}
        </Text>
      </Card>
    </Group>
  );
}
