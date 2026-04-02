'use client';

/**
 * feed_infinite_scroll-mantine-v2-T01
 * Release notes drawer: reveal the target row, open it, and apply
 *
 * Drawer flow, compact spacing. "Open release notes" button -> Mantine Drawer.
 * Feed in ScrollArea with on-scroll loading. Target NOTE-142.
 * Expand inline details, click "Use selected note".
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, Text, Button, Drawer, ScrollArea, Group, Stack, Badge, Loader, UnstyledButton } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

interface NoteRow { id: string; title: string; ts: string; }

const NOTE_TITLES: Record<number, string> = {
  1: 'Initial release', 10: 'Bug fix batch', 20: 'Feature flag added',
  30: 'Performance improvement', 50: 'Security patch', 80: 'API versioning',
  100: 'Deprecation notice', 120: 'Migration guide', 142: 'Token rotation scheduled',
  160: 'SDK update', 180: 'Breaking change notice',
};

function genNotes(start: number, count: number): NoteRow[] {
  const out: NoteRow[] = [];
  for (let i = start; i < start + count; i++) {
    out.push({
      id: `NOTE-${String(i).padStart(3, '0')}`,
      title: NOTE_TITLES[i] || `Release note ${i}`,
      ts: `${(i * 3) % 24}h ago`,
    });
  }
  return out;
}

const TOTAL = 180;
const PAGE = 20;
const TARGET = 'NOTE-142';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState<NoteRow[]>(() => genNotes(1, PAGE));
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const successRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (pos: { x: number; y: number }) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const { scrollHeight, clientHeight } = vp;
      if (scrollHeight - pos.y - clientHeight < 120 && !loading && items.length < TOTAL) {
        setLoading(true);
        setTimeout(() => {
          setItems((prev) => [...prev, ...genNotes(prev.length + 1, PAGE)]);
          setLoading(false);
        }, 400);
      }
    },
    [loading, items.length],
  );

  const handleUse = () => {
    if (expandedId === TARGET && !successRef.current) {
      successRef.current = true;
      setDrawerOpen(false);
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 24 }}>
      <Card shadow="sm" padding="lg" radius="md" w={380}>
        <Text fw={600} size="lg" mb="xs">Release summary</Text>
        <Group gap="xs" mb="md">
          <Badge color="blue">v4.2.0</Badge>
          <Badge color="green">Stable</Badge>
        </Group>
        <Button onClick={() => setDrawerOpen(true)}>Open release notes</Button>
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Release notes"
        position="right"
        size="lg"
      >
        <Group justify="space-between" mb="xs">
          <Text size="xs" c="dimmed">Loaded {items.length} / {TOTAL}</Text>
          <Button
            size="xs"
            disabled={!expandedId}
            onClick={handleUse}
            data-testid="use-selected-note"
          >
            Use selected note
          </Button>
        </Group>
        <ScrollArea
          h={400}
          viewportRef={viewportRef}
          onScrollPositionChange={handleScroll}
          data-testid="feed-release-notes"
        >
          <Stack gap={0}>
            {items.map((item) => {
              const isExp = expandedId === item.id;
              return (
                <div key={item.id} data-item-id={item.id}>
                  <UnstyledButton
                    w="100%"
                    py={6}
                    px={10}
                    onClick={() => setExpandedId(isExp ? null : item.id)}
                    style={{
                      background: isExp ? 'var(--mantine-color-blue-light)' : 'transparent',
                      borderRadius: 4,
                    }}
                  >
                    <Group justify="space-between">
                      <div>
                        <Text span fw={600} size="sm">{item.id}</Text>
                        <Text span size="sm"> — {item.title}</Text>
                      </div>
                      <Text size="xs" c="dimmed">{item.ts}</Text>
                    </Group>
                  </UnstyledButton>
                  {isExp && (
                    <div style={{ padding: '4px 10px 8px', fontSize: 12, color: '#666', background: 'var(--mantine-color-gray-0)', borderRadius: 4, margin: '0 4px 4px' }}>
                      Details for {item.id}: {item.title}. Full changelog and migration notes are available in the docs portal.
                    </div>
                  )}
                </div>
              );
            })}
          </Stack>
          {loading && (
            <div style={{ textAlign: 'center', padding: 8 }}>
              <Loader size="sm" />
            </div>
          )}
        </ScrollArea>
      </Drawer>
    </div>
  );
}
