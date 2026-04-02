'use client';

/**
 * virtual_list-mantine-v2-T08
 * Four panes: enable Hold only in Secondary endpoints and save
 *
 * Dark dashboard with 2×2 grid of endpoint cards. Agent must scroll Secondary
 * endpoints to SVC-118, turn on its Hold toggle, and click "Save endpoint state".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Button, Switch, Group, Box } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../../types';

interface SvcItem { key: string; code: string; label: string; }

const svcLabels = [
  'Retry worker', 'Index rebuild', 'Cache warm', 'Log rotate', 'Snapshot export',
  'Metric flush', 'Queue drain', 'Token refresh', 'Cert renew', 'DNS sync',
];

function buildSvcs(prefix: string, count: number): SvcItem[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `${prefix.toLowerCase()}-${i}`,
    code: `${prefix}-${i}`,
    label: svcLabels[i % svcLabels.length],
  }));
}

const primarySvcs = buildSvcs('SVC', 300);
const secondarySvcs = buildSvcs('SVC', 300);
const archiveSvcs = buildSvcs('ARC', 200);
const watcherSvcs = buildSvcs('WCH', 200);

function EndpointPane({
  title, items, holds, onToggle, testId,
}: {
  title: string; items: SvcItem[]; holds: Set<string>;
  onToggle: (key: string) => void; testId: string;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 5,
  });

  return (
    <Paper shadow="xs" p="xs" withBorder style={{ flex: 1, background: '#1a1a2e' }} data-testid={testId}>
      <Text fw={600} size="xs" c="white" mb={4}>{title}</Text>
      <Box ref={parentRef} style={{ height: 180, overflow: 'auto', border: '1px solid #333', borderRadius: 4 }}>
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
          {virtualizer.getVirtualItems().map((vr: VirtualItem) => {
            const item = items[vr.index];
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
                  padding: '5px 10px',
                  borderBottom: '1px solid #222',
                  fontSize: 12,
                  color: '#d9d9d9',
                }}
              >
                <span>{item.code} — {item.label}</span>
                <Switch
                  size="xs"
                  checked={holds.has(item.key)}
                  onChange={() => onToggle(item.key)}
                  label={holds.has(item.key) ? 'Hold' : ''}
                />
              </div>
            );
          })}
        </div>
      </Box>
      <Text size="xs" c="dimmed" mt={4}>Held: {holds.size}</Text>
    </Paper>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryHolds, setPrimaryHolds] = useState<Set<string>>(new Set());
  const [secondaryHolds, setSecondaryHolds] = useState<Set<string>>(new Set());
  const [archiveHolds, setArchiveHolds] = useState<Set<string>>(new Set());
  const [watcherHolds, setWatcherHolds] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (saved && secondaryHolds.has('svc-118')) { successRef.current = true; onSuccess(); }
  }, [saved, secondaryHolds, onSuccess]);

  const makeToggler = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (key: string) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setSaved(false);
  };

  return (
    <div style={{ background: '#0d0d1a', padding: 16, borderRadius: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <EndpointPane title="Primary endpoints" items={primarySvcs} holds={primaryHolds}
          onToggle={makeToggler(setPrimaryHolds)} testId="primary-endpoints" />
        <EndpointPane title="Secondary endpoints" items={secondarySvcs} holds={secondaryHolds}
          onToggle={makeToggler(setSecondaryHolds)} testId="secondary-endpoints" />
        <EndpointPane title="Archive" items={archiveSvcs} holds={archiveHolds}
          onToggle={makeToggler(setArchiveHolds)} testId="archive" />
        <EndpointPane title="Watchers" items={watcherSvcs} holds={watcherHolds}
          onToggle={makeToggler(setWatcherHolds)} testId="watchers" />
      </div>
      <Button onClick={() => setSaved(true)}>Save endpoint state</Button>
    </div>
  );
}
