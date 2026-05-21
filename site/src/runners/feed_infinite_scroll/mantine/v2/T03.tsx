'use client';

/**
 * feed_infinite_scroll-mantine-v2-T03
 * Customer notes feed: filter, open the exact note, then save
 *
 * Settings panel layout. "Customer notes" card with Mantine TextInput search.
 * Typing refreshes the feed. Target NOTE-1088 "VPN login failure".
 * Open row (expand details), then click "Save note choice".
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, Text, Button, TextInput, ScrollArea, Group, Stack, Switch, Loader, UnstyledButton } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

interface NoteRow { id: string; title: string; ts: string; }

const ALL_NOTES: NoteRow[] = (() => {
  const titles = ['VPN login failure', 'Account locked', 'Password reset', 'VPN tunnel dropped', 'Permission denied', 'VPN config error', 'Session expired', 'VPN login failure', 'Auth timeout', 'Cert mismatch'];
  const out: NoteRow[] = [];
  for (let i = 1; i <= 1200; i++) {
    out.push({
      id: `NOTE-${String(i).padStart(4, '0')}`,
      title: titles[i % titles.length],
      ts: `${(i * 5) % 48}h ago`,
    });
  }
  return out;
})();

const TARGET = 'NOTE-1088';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [query, setQuery] = useState('');
  const [displayed, setDisplayed] = useState<NoteRow[]>(() => ALL_NOTES.slice(0, 30));
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const successRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setExpandedId(null);
    if (!value.trim()) { setDisplayed(ALL_NOTES.slice(0, 30)); return; }
    setLoading(true);
    setTimeout(() => {
      const lower = value.toLowerCase();
      const filtered = ALL_NOTES.filter(
        (r) => r.id.toLowerCase().includes(lower) || r.title.toLowerCase().includes(lower),
      );
      setDisplayed(filtered.slice(0, 50));
      setLoading(false);
    }, 500);
  }, []);

  const handleScroll = useCallback(
    (pos: { x: number; y: number }) => {
      if (query) return;
      const vp = viewportRef.current;
      if (!vp) return;
      if (vp.scrollHeight - pos.y - vp.clientHeight < 120 && !loading && displayed.length < ALL_NOTES.length) {
        setLoading(true);
        setTimeout(() => {
          setDisplayed((prev) => [...prev, ...ALL_NOTES.slice(prev.length, prev.length + 20)]);
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
    <Group align="flex-start" gap="md" p="md">
      <Stack w={180} gap="xs">
        <Text size="xs" c="dimmed">Preferences</Text>
        <Switch size="xs" label="Auto-sync" defaultChecked />
        <Switch size="xs" label="Notifications" />
        <Switch size="xs" label="Dark mode" />
      </Stack>
      <Card shadow="sm" padding="md" radius="md" style={{ flex: 1, maxWidth: 520 }}>
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Customer notes</Text>
          <Button size="xs" onClick={handleSave} data-testid="save-note">
            Save note choice
          </Button>
        </Group>
        <TextInput
          size="xs"
          placeholder="Search notes…"
          leftSection={<IconSearch size={14} />}
          value={query}
          onChange={(e) => handleSearch(e.currentTarget.value)}
          mb="xs"
          data-testid="note-search"
        />
        <ScrollArea h={360} viewportRef={viewportRef} onScrollPositionChange={handleScroll} data-testid="feed-customer-notes">
          {loading && displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24 }}><Loader /></div>
          ) : (
            <Stack gap={0}>
              {displayed.map((item) => {
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
                        Note {item.id}: {item.title}. Customer ticket linked. Priority: medium.
                      </div>
                    )}
                  </div>
                );
              })}
            </Stack>
          )}
          {loading && displayed.length > 0 && (
            <div style={{ textAlign: 'center', padding: 6 }}><Loader size="xs" /></div>
          )}
        </ScrollArea>
      </Card>
    </Group>
  );
}
