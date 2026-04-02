'use client';

/**
 * virtual_list-mantine-v2-T03
 * Operations dashboard: choose the incident row and save only that pane
 *
 * Dark dashboard with three Mantine cards (Incidents/Jobs/Notes). Overlapping
 * suffixes. Agent must select INC-0923 and click "Save incidents pane".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Button, Badge, Group, Box } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../../types';

interface RowItem { key: string; code: string; label: string; }

const incLabels = ['Disk full', 'CPU spike', 'Memory leak', 'Password expired', 'Token revoked', 'Cert expiring', 'Rate limit', 'DNS failure'];
const jobLabels = ['Index build', 'Cache warm', 'Log rotate', 'Snapshot export', 'Queue drain', 'Token refresh', 'Cert renew', 'DNS sync'];
const noteLabels = ['Standup', 'Retro', 'Planning', 'Review', 'Demo', 'Sync', 'Brainstorm', 'Debrief'];

function buildRows(prefix: string, labels: string[], count: number): RowItem[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `${prefix.toLowerCase()}-${String(i).padStart(4, '0')}`,
    code: `${prefix}-${String(i).padStart(4, '0')}`,
    label: labels[i % labels.length],
  }));
}

const incidents = buildRows('INC', incLabels, 1200);
const jobs = buildRows('JOB', jobLabels, 1200);
const notes = buildRows('NOTE', noteLabels, 1200);

function DashPane({
  title, items, selected, onSelect, actionLabel, onAction, testId,
}: {
  title: string; items: RowItem[]; selected: string | null;
  onSelect: (k: string) => void; actionLabel: string; onAction: () => void; testId: string;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 38,
    overscan: 5,
  });

  return (
    <Paper shadow="xs" p="xs" withBorder style={{ flex: 1, minWidth: 260, background: '#1a1a2e' }} data-testid={testId}>
      <Text fw={600} size="xs" c="white" mb={4}>{title}</Text>
      <Box ref={parentRef} style={{ height: 240, overflow: 'auto', border: '1px solid #333', borderRadius: 4 }}>
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
          {virtualizer.getVirtualItems().map((vr: VirtualItem) => {
            const item = items[vr.index];
            return (
              <div
                key={item.key}
                data-item-key={item.key}
                aria-selected={selected === item.key}
                onClick={() => onSelect(item.key)}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '100%',
                  height: `${vr.size}px`,
                  transform: `translateY(${vr.start}px)`,
                  padding: '7px 10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #222',
                  backgroundColor: selected === item.key ? 'rgba(56,139,255,0.15)' : 'transparent',
                  color: '#d9d9d9',
                  fontSize: 12,
                }}
              >
                {item.code} — {item.label}
              </div>
            );
          })}
        </div>
      </Box>
      <Group justify="space-between" mt={4}>
        <Text size="xs" c="dimmed">Selected: {selected ?? 'none'}</Text>
        <Button size="xs" variant="filled" onClick={onAction} disabled={!selected}>{actionLabel}</Button>
      </Group>
    </Paper>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [incSel, setIncSel] = useState<string | null>(null);
  const [jobSel, setJobSel] = useState<string | null>(null);
  const [noteSel, setNoteSel] = useState<string | null>(null);
  const [incSaved, setIncSaved] = useState(false);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (incSaved && incSel === 'inc-0923') { successRef.current = true; onSuccess(); }
  }, [incSaved, incSel, onSuccess]);

  return (
    <div style={{ background: '#0d0d1a', padding: 16, borderRadius: 8, minWidth: 840 }}>
      <Group gap="xs" mb="sm">
        <Badge size="sm" color="green">Uptime 99.8%</Badge>
        <Badge size="sm">Active: 12 services</Badge>
      </Group>
      <div style={{ display: 'flex', gap: 12 }}>
        <DashPane title="Incidents" items={incidents} selected={incSel} onSelect={setIncSel}
          actionLabel="Save incidents pane" onAction={() => setIncSaved(true)} testId="incidents-pane" />
        <DashPane title="Jobs" items={jobs} selected={jobSel} onSelect={setJobSel}
          actionLabel="Save jobs pane" onAction={() => {}} testId="jobs-pane" />
        <DashPane title="Notes" items={notes} selected={noteSel} onSelect={setNoteSel}
          actionLabel="Save notes pane" onAction={() => {}} testId="notes-pane" />
      </div>
    </div>
  );
}
