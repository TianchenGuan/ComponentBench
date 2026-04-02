'use client';

/**
 * feed_infinite_scroll-mantine-v2-T05
 * Pinned notes feed: reference marker match plus exact ID
 *
 * Inline surface, dark theme. "Reference note" card above "Pinned notes" feed.
 * Rows have marker ring, status chip, ID, title. Target PIN-034
 * must match reference marker ring + status chip. Click "Use note".
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, Text, Button, ScrollArea, Group, Stack, Badge, Loader, UnstyledButton, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const RING_COLORS = ['red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal'];
const STATUS_LABELS = ['Active', 'Draft', 'Archived', 'Pinned', 'Pending'];
const STATUS_COLORS = ['green', 'blue', 'gray', 'violet', 'orange'];

const REFERENCE_RING_IDX = 4;
const REFERENCE_STATUS_IDX = 3;

interface PinRow { id: string; title: string; ringIdx: number; statusIdx: number; }

function genPins(count: number): PinRow[] {
  const out: PinRow[] = [];
  for (let i = 1; i <= count; i++) {
    out.push({
      id: `PIN-${String(i).padStart(3, '0')}`,
      title: `Note item ${i}`,
      ringIdx: i === 34 ? REFERENCE_RING_IDX : (i * 3 + i) % RING_COLORS.length,
      statusIdx: i === 34 ? REFERENCE_STATUS_IDX : i % STATUS_LABELS.length,
    });
  }
  return out;
}

const ALL_PINS = genPins(200);
const PAGE = 20;
const TARGET = 'PIN-034';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<PinRow[]>(() => ALL_PINS.slice(0, PAGE));
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const successRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (pos: { x: number; y: number }) => {
      const vp = viewportRef.current;
      if (!vp) return;
      if (vp.scrollHeight - pos.y - vp.clientHeight < 120 && !loading && items.length < ALL_PINS.length) {
        setLoading(true);
        setTimeout(() => {
          setItems(ALL_PINS.slice(0, items.length + PAGE));
          setLoading(false);
        }, 350);
      }
    },
    [loading, items.length],
  );

  const handleUse = () => {
    if (activeId === TARGET && !successRef.current) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ background: '#1a1b1e', padding: 16, minHeight: 480 }}>
        <Card shadow="sm" padding="sm" radius="md" w={160} mb="sm" style={{ background: '#25262b', textAlign: 'center' }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: `3px solid var(--mantine-color-${RING_COLORS[REFERENCE_RING_IDX]}-6)`,
              margin: '0 auto 6px',
            }}
          />
          <Badge color={STATUS_COLORS[REFERENCE_STATUS_IDX]} size="xs">
            {STATUS_LABELS[REFERENCE_STATUS_IDX]}
          </Badge>
          <Text size="xs" c="dimmed" mt={4}>Reference note</Text>
        </Card>

        <Card shadow="sm" padding="xs" radius="md" w={440} style={{ background: '#25262b' }}>
          <Group justify="space-between" mb="xs">
            <Text fw={600} size="sm">Pinned notes</Text>
            <Button size="xs" onClick={handleUse} data-testid="use-note">
              Use note
            </Button>
          </Group>
          <ScrollArea h={340} viewportRef={viewportRef} onScrollPositionChange={handleScroll} data-testid="feed-pinned-notes">
            <Stack gap={0}>
              {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <UnstyledButton
                    key={item.id}
                    data-item-id={item.id}
                    w="100%"
                    py={4}
                    px={8}
                    onClick={() => setActiveId(item.id)}
                    style={{ background: isActive ? 'rgba(34,139,230,0.15)' : 'transparent', borderRadius: 4 }}
                  >
                    <Group gap="xs">
                      <div
                        style={{
                          width: 18, height: 18, borderRadius: '50%',
                          border: `2px solid var(--mantine-color-${RING_COLORS[item.ringIdx]}-6)`,
                          flexShrink: 0,
                        }}
                      />
                      <Badge color={STATUS_COLORS[item.statusIdx]} size="xs" variant="light">
                        {STATUS_LABELS[item.statusIdx]}
                      </Badge>
                      <Text fw={600} size="xs">{item.id}</Text>
                      <Text size="xs" c="dimmed" style={{ flex: 1 }}>{item.title}</Text>
                    </Group>
                  </UnstyledButton>
                );
              })}
            </Stack>
            {loading && <div style={{ textAlign: 'center', padding: 6 }}><Loader size="xs" /></div>}
          </ScrollArea>
        </Card>
      </div>
    </MantineProvider>
  );
}
