'use client';

/**
 * virtual_list-mantine-v2-T05
 * Package browser: scroll the inner viewport, star the exact row, then save
 *
 * Nested scroll. Page scrolls; the inner "Package browser" has its own
 * ScrollArea-backed virtualized list with per-row "Starred" actions. Agent must
 * star PKG-318 and click "Save stars".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Button, Badge, Group, Box, ActionIcon } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../../types';

interface PkgItem { key: string; code: string; label: string; }

const pkgLabels = [
  'Session replay', 'Auth proxy', 'Cache layer', 'Worker pool', 'Stream relay',
  'Config store', 'Log sink', 'Metric hub', 'Asset CDN', 'Gateway',
];

function buildPackages(): PkgItem[] {
  return Array.from({ length: 500 }, (_, i) => ({
    key: `pkg-${i}`,
    code: `PKG-${i}`,
    label: pkgLabels[i % pkgLabels.length],
  }));
}

const packages = buildPackages();

export default function T05({ onSuccess }: TaskComponentProps) {
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const successRef = useRef(false);

  const virtualizer = useVirtualizer({
    count: packages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 42,
    overscan: 5,
  });

  useEffect(() => {
    if (successRef.current) return;
    if (saved && starred.has('pkg-318')) { successRef.current = true; onSuccess(); }
  }, [saved, starred, onSuccess]);

  const toggleStar = (key: string) => {
    setStarred(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setSaved(false);
  };

  return (
    <div style={{ height: 600, overflow: 'auto', padding: 16 }}>
      <Paper shadow="xs" p="sm" mb="sm" withBorder>
        <Text fw={600} size="sm">Deployment notes</Text>
        <Text size="xs" c="dimmed">Last deploy: 12 min ago. 3 packages updated.</Text>
      </Paper>

      <Paper shadow="xs" p="sm" mb="sm" withBorder>
        <Group gap="xs">
          <Badge size="sm">Packages: 500</Badge>
          <Badge size="sm" color="blue">Registry: npm</Badge>
        </Group>
      </Paper>

      <Paper shadow="xs" p="sm" withBorder data-testid="package-browser">
        <Text fw={600} size="sm" mb={4}>Package browser</Text>
        <Box ref={parentRef} style={{ height: 300, overflow: 'auto', border: '1px solid #e9ecef', borderRadius: 4 }}>
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
            {virtualizer.getVirtualItems().map((vr: VirtualItem) => {
              const item = packages[vr.index];
              return (
                <div
                  key={item.key}
                  data-item-key={item.key}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%',
                    height: `${vr.size}px`,
                    transform: `translateY(${vr.start}px)`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderBottom: '1px solid #f0f0f0',
                    fontSize: 13,
                  }}
                >
                  <span>{item.code} — {item.label}</span>
                  <ActionIcon
                    size="sm"
                    variant={starred.has(item.key) ? 'filled' : 'subtle'}
                    color={starred.has(item.key) ? 'yellow' : 'gray'}
                    onClick={() => toggleStar(item.key)}
                    aria-label={starred.has(item.key) ? 'Unstar' : 'Star'}
                  >
                    ★
                  </ActionIcon>
                </div>
              );
            })}
          </div>
        </Box>
        <Group justify="space-between" mt={6}>
          <Text size="xs" c="dimmed">Starred: {starred.size}</Text>
          <Button size="xs" onClick={() => setSaved(true)}>Save stars</Button>
        </Group>
      </Paper>

      <div style={{ height: 400 }} />
    </div>
  );
}
