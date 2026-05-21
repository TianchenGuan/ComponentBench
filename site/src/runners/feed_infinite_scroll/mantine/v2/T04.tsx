'use client';

/**
 * feed_infinite_scroll-mantine-v2-T04
 * Triage feed: exact four-alert selection and apply
 *
 * Dashboard with "Triage feed" and "Escalated feed". Dark theme, checkbox rows.
 * Select exactly ALT-021, ALT-024, ALT-027, ALT-031 in Triage feed.
 * Click "Apply triage selection".
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, Text, Button, Checkbox, ScrollArea, Group, Stack, Badge, Loader, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

interface QueueRow { id: string; title: string; }

function genQueue(prefix: string, count: number): QueueRow[] {
  const labels = ['Needs triage', 'Pending review', 'Awaiting input', 'Escalated', 'In progress', 'Deferred', 'Reopened', 'Blocked'];
  const out: QueueRow[] = [];
  for (let i = 1; i <= count; i++) {
    out.push({ id: `${prefix}-${String(i).padStart(3, '0')}`, title: labels[i % labels.length] });
  }
  return out;
}

const ALL_TRIAGE = genQueue('ALT', 200);
const ALL_ESCALATED = genQueue('ESC', 200);
const PAGE = 20;
const TARGET_IDS = new Set(['ALT-021', 'ALT-024', 'ALT-027', 'ALT-031']);

function CheckboxFeed({
  allItems, testId, checked, onToggle,
}: {
  allItems: QueueRow[]; testId: string;
  checked: Set<string>; onToggle: (id: string) => void;
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
        }, 350);
      }
    },
    [loading, count, allItems.length],
  );

  return (
    <ScrollArea h={280} viewportRef={viewportRef} onScrollPositionChange={handleScroll} data-testid={testId}>
      <Stack gap={0}>
        {items.map((item) => (
          <Group key={item.id} data-item-id={item.id} gap="xs" py={3} px={8}>
            <Checkbox
              size="xs"
              checked={checked.has(item.id)}
              onChange={() => onToggle(item.id)}
            />
            <Text fw={600} size="xs">{item.id}</Text>
            <Text size="xs" c="dimmed">{item.title}</Text>
          </Group>
        ))}
      </Stack>
      {loading && <div style={{ textAlign: 'center', padding: 6 }}><Loader size="xs" /></div>}
      <Text size="xs" c="dimmed" ta="center" py={4}>{items.length} / {allItems.length}</Text>
    </ScrollArea>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [triageChecked, setTriageChecked] = useState<Set<string>>(new Set());
  const [escChecked, setEscChecked] = useState<Set<string>>(new Set());
  const successRef = useRef(false);

  const toggleTriage = (id: string) => {
    setTriageChecked((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };
  const toggleEsc = (id: string) => {
    setEscChecked((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const handleApply = () => {
    if (successRef.current) return;
    if (triageChecked.size === TARGET_IDS.size && Array.from(TARGET_IDS).every((id) => triageChecked.has(id))) {
      successRef.current = true;
      onSuccess();
    }
  };

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ background: '#1a1b1e', padding: 16, minHeight: 440, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Group gap="xs" mb="sm">
          <Badge variant="light">Open: 34</Badge>
          <Badge color="red" variant="light">Critical: 4</Badge>
        </Group>
        <Card shadow="sm" padding="xs" radius="md" mb="sm" style={{ width: 420, background: '#25262b' }}>
          <Group justify="space-between" mb="xs">
            <Text fw={600} size="sm">Triage feed</Text>
            <Button size="xs" onClick={handleApply} data-testid="apply-triage">
              Apply triage selection
            </Button>
          </Group>
          <CheckboxFeed allItems={ALL_TRIAGE} testId="feed-triage" checked={triageChecked} onToggle={toggleTriage} />
          <Text size="xs" c="dimmed" px="xs">Pending: {triageChecked.size} selected</Text>
        </Card>
        <Card shadow="sm" padding="xs" radius="md" style={{ width: 420, background: '#25262b' }}>
          <Text fw={600} size="sm" mb="xs">Escalated feed</Text>
          <CheckboxFeed allItems={ALL_ESCALATED} testId="feed-escalated" checked={escChecked} onToggle={toggleEsc} />
        </Card>
      </div>
    </MantineProvider>
  );
}
