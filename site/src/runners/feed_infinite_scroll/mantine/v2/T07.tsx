'use client';

/**
 * feed_infinite_scroll-mantine-v2-T07
 * Approvals feed: open the target row and save the decision
 *
 * Settings panel, compact, off-center. "Approvals" card with ScrollArea feed
 * and inline expansion. Target APR-063. Click "Save approval decision".
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, Text, Button, ScrollArea, Group, Stack, Switch, Badge, Loader, UnstyledButton, Chip } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

interface AprRow { id: string; title: string; ts: string; }

const APR_TITLES: Record<number, string> = {
  1: 'Budget approval', 10: 'Vendor contract', 20: 'Hiring request',
  30: 'Travel expense', 40: 'Equipment purchase', 50: 'Policy exception',
  63: 'Rollback requested', 70: 'Access grant', 80: 'License renewal', 90: 'Project closure',
};

function genApprovals(start: number, count: number): AprRow[] {
  const out: AprRow[] = [];
  for (let i = start; i < start + count; i++) {
    out.push({
      id: `APR-${String(i).padStart(3, '0')}`,
      title: APR_TITLES[i] || `Approval ${i}`,
      ts: `${(i * 4) % 60}m ago`,
    });
  }
  return out;
}

const TOTAL = 120;
const PAGE = 15;
const TARGET = 'APR-063';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<AprRow[]>(() => genApprovals(1, PAGE));
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const successRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (pos: { x: number; y: number }) => {
      const vp = viewportRef.current;
      if (!vp) return;
      if (vp.scrollHeight - pos.y - vp.clientHeight < 120 && !loading && items.length < TOTAL) {
        setLoading(true);
        setTimeout(() => {
          setItems((prev) => [...prev, ...genApprovals(prev.length + 1, PAGE)]);
          setLoading(false);
        }, 400);
      }
    },
    [loading, items.length],
  );

  const handleSave = () => {
    if (expandedId === TARGET && !successRef.current) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <Group align="flex-start" gap="md" p="md">
      <Stack w={180} gap="xs">
        <Text size="xs" c="dimmed">Controls</Text>
        <Switch size="xs" label="Auto-approve" defaultChecked />
        <Switch size="xs" label="Notifications" />
        <Text size="xs" c="dimmed" mt="md">Status</Text>
        <Stack gap={4}>
          <Badge color="green" size="xs">P1: 0</Badge>
          <Badge color="orange" size="xs">P2: 5</Badge>
        </Stack>
      </Stack>
      <Card shadow="sm" padding="md" radius="md" style={{ flex: 1, maxWidth: 480 }}>
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Approvals</Text>
          <Button size="xs" onClick={handleSave} data-testid="save-approval">
            Save approval decision
          </Button>
        </Group>
        {expandedId && (
          <Badge color="blue" size="xs" mb="xs">Selected: {expandedId}</Badge>
        )}
        <ScrollArea h={380} viewportRef={viewportRef} onScrollPositionChange={handleScroll} data-testid="feed-approvals">
          <Stack gap={0}>
            {items.map((item) => {
              const isExp = expandedId === item.id;
              return (
                <div key={item.id} data-item-id={item.id}>
                  <UnstyledButton
                    w="100%"
                    py={4}
                    px={8}
                    onClick={() => setExpandedId(isExp ? null : item.id)}
                    style={{ background: isExp ? 'var(--mantine-color-blue-light)' : 'transparent', borderRadius: 4 }}
                  >
                    <Group justify="space-between">
                      <div>
                        <Text span fw={600} size="xs">{item.id}</Text>
                        <Text span size="xs"> — {item.title}</Text>
                      </div>
                      <Text size="xs" c="dimmed">{item.ts}</Text>
                    </Group>
                  </UnstyledButton>
                  {isExp && (
                    <div style={{ padding: '3px 8px 6px', fontSize: 11, color: '#666', background: 'var(--mantine-color-gray-0)', borderRadius: 4, margin: '0 4px 2px' }}>
                      Approval {item.id}: {item.title}. Status: pending manager review. SLA: 4h remaining.
                    </div>
                  )}
                </div>
              );
            })}
          </Stack>
          {loading && <div style={{ textAlign: 'center', padding: 6 }}><Loader size="xs" /></div>}
        </ScrollArea>
        <Text size="xs" c="dimmed" ta="center" pt={4}>
          Loaded {items.length} / {TOTAL}
        </Text>
      </Card>
    </Group>
  );
}
