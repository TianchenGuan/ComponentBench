'use client';

/**
 * feed_infinite_scroll-mantine-v2-T02
 * Timelines dashboard: open the target row only in Secondary timeline
 *
 * Dashboard with "Primary timeline" and "Secondary timeline" feeds.
 * Dark theme, compact. Target EVT-188 "Queue depth spike" in Secondary only.
 * EVT-188 also exists in Primary with a different title. Expand + "Save secondary timeline".
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, Text, Button, ScrollArea, Group, Stack, Badge, Loader, UnstyledButton, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

interface FeedRow { id: string; title: string; ts: string; }

function genRows(prefix: string, titles: Record<number, string>, count: number): FeedRow[] {
  const out: FeedRow[] = [];
  for (let i = 1; i <= count; i++) {
    out.push({ id: `${prefix}-${String(i).padStart(3, '0')}`, title: titles[i] || `Event ${i}`, ts: `${(i * 3) % 24}h ago` });
  }
  return out;
}

const PRIMARY_TITLES: Record<number, string> = { 1: 'Deploy started', 50: 'Config push', 100: 'Canary promoted', 150: 'Traffic shifted', 188: 'Service restarted', 200: 'Release tagged' };
const SECONDARY_TITLES: Record<number, string> = { 1: 'Alert fired', 50: 'Metric spike', 100: 'Threshold breached', 150: 'Escalation triggered', 188: 'Queue depth spike', 200: 'Recovery complete' };

const ALL_PRIMARY = genRows('EVT', PRIMARY_TITLES, 250);
const ALL_SECONDARY = genRows('EVT', SECONDARY_TITLES, 250);
const PAGE = 20;
const TARGET = 'EVT-188';

function TimelineFeed({
  allItems, testId, expandedId, onExpand,
}: {
  allItems: FeedRow[]; testId: string;
  expandedId: string | null; onExpand: (id: string | null) => void;
}) {
  const [count, setCount] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const items = allItems.slice(0, count);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (pos: { x: number; y: number }) => {
      const vp = viewportRef.current;
      if (!vp) return;
      if (vp.scrollHeight - pos.y - vp.clientHeight < 120 && !loading && count < allItems.length) {
        setLoading(true);
        setTimeout(() => {
          setCount((c) => Math.min(c + PAGE, allItems.length));
          setLoading(false);
        }, 400);
      }
    },
    [loading, count, allItems.length],
  );

  return (
    <ScrollArea h={300} viewportRef={viewportRef} onScrollPositionChange={handleScroll} data-testid={testId}>
      <Stack gap={0}>
        {items.map((item) => {
          const isExp = expandedId === item.id;
          return (
            <div key={item.id} data-item-id={item.id}>
              <UnstyledButton
                w="100%"
                py={4}
                px={8}
                onClick={() => onExpand(isExp ? null : item.id)}
                style={{ background: isExp ? 'rgba(34,139,230,0.15)' : 'transparent', borderRadius: 4 }}
              >
                <Group justify="space-between">
                  <div>
                    <Text span fw={600} size="xs">{item.id}</Text>
                    <Text span size="xs" c="dimmed"> — {item.title}</Text>
                  </div>
                  <Text size="xs" c="dimmed">{item.ts}</Text>
                </Group>
              </UnstyledButton>
              {isExp && (
                <div style={{ padding: '3px 8px 6px', fontSize: 11, color: '#aaa', background: 'rgba(255,255,255,0.04)', borderRadius: 4, margin: '0 4px 2px' }}>
                  Details for {item.id}: {item.title}. Recorded at {item.ts}.
                </div>
              )}
            </div>
          );
        })}
      </Stack>
      {loading && <div style={{ textAlign: 'center', padding: 6 }}><Loader size="xs" /></div>}
      <Text size="xs" c="dimmed" ta="center" py={4}>{items.length} / {allItems.length}</Text>
    </ScrollArea>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [primaryExp, setPrimaryExp] = useState<string | null>(null);
  const [secondaryExp, setSecondaryExp] = useState<string | null>(null);
  const successRef = useRef(false);

  const handleSave = () => {
    if (secondaryExp === TARGET && !successRef.current) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ background: '#1a1b1e', padding: 16, minHeight: 480 }}>
        <Group gap="xs" mb="sm">
          <Badge color="blue" variant="light">Uptime 99.8%</Badge>
          <Badge color="green" variant="light">0 critical</Badge>
          <Badge variant="light">Refresh</Badge>
        </Group>
        <Group align="flex-start" gap="md">
          <Card shadow="sm" padding="xs" radius="md" style={{ flex: 1, background: '#25262b' }}>
            <Text fw={600} size="sm" mb="xs">Primary timeline</Text>
            <TimelineFeed allItems={ALL_PRIMARY} testId="feed-primary-timeline" expandedId={primaryExp} onExpand={setPrimaryExp} />
          </Card>
          <Card shadow="sm" padding="xs" radius="md" style={{ flex: 1, background: '#25262b' }}>
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="sm">Secondary timeline</Text>
              <Button size="xs" onClick={handleSave} data-testid="save-secondary">
                Save secondary timeline
              </Button>
            </Group>
            <TimelineFeed allItems={ALL_SECONDARY} testId="feed-secondary-timeline" expandedId={secondaryExp} onExpand={setSecondaryExp} />
          </Card>
        </Group>
      </div>
    </MantineProvider>
  );
}
