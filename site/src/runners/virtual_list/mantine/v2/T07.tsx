'use client';

/**
 * virtual_list-mantine-v2-T07
 * Reference chip panel: select the row matching the target card
 *
 * Split panel with a "Target card" showing a chip pair and a virtualized
 * "Candidate records" list. Agent must find REC-311 whose chips match,
 * select it, and click "Use selected record". High-contrast theme.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Button, Badge, Group, Box } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../../types';

const chipColors = ['pink', 'grape', 'violet', 'indigo', 'blue', 'teal', 'green', 'lime', 'yellow', 'orange', 'red'] as const;
const chipLabels = ['Core', 'Edge', 'Beta', 'GA', 'Legacy', 'Canary', 'Stable', 'Preview', 'LTS', 'Nightly', 'RC'];
const names = ['Query engine', 'Auth proxy', 'Cache layer', 'Worker pool', 'Stream relay', 'Config store', 'Log sink', 'Metric hub'];

interface RecordItem {
  key: string; code: string; name: string;
  chip1: { color: string; label: string; };
  chip2: { color: string; label: string; };
}

const REF_CHIP1 = { color: 'teal', label: 'Canary' };
const REF_CHIP2 = { color: 'red', label: 'RC' };

function buildRecords(): RecordItem[] {
  return Array.from({ length: 240 }, (_, i) => {
    const isTarget = i === 131;
    return {
      key: `rec-${i + 180}`,
      code: `REC-${i + 180}`,
      name: names[i % names.length],
      chip1: isTarget ? REF_CHIP1 : { color: chipColors[i % chipColors.length], label: chipLabels[i % chipLabels.length] },
      chip2: isTarget ? REF_CHIP2 : { color: chipColors[(i + 5) % chipColors.length], label: chipLabels[(i + 3) % chipLabels.length] },
    };
  });
}

const records = buildRecords();

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const successRef = useRef(false);

  const virtualizer = useVirtualizer({
    count: records.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 5,
  });

  useEffect(() => {
    if (successRef.current) return;
    if (saved && selected === 'rec-311') { successRef.current = true; onSuccess(); }
  }, [saved, selected, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, background: '#000', borderRadius: 8, minWidth: 700 }}>
      <Paper shadow="xs" p="sm" withBorder style={{ width: 200, flexShrink: 0, background: '#111' }}
        data-testid="target-card-rec311">
        <Text fw={600} size="xs" c="white" mb={6}>Target card</Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Badge color={REF_CHIP1.color}>{REF_CHIP1.label}</Badge>
          <Badge color={REF_CHIP2.color}>{REF_CHIP2.label}</Badge>
        </div>
        <Text size="xs" c="dimmed" mt={8}>Match both chips and ID REC-311</Text>
      </Paper>

      <Paper shadow="xs" p="sm" withBorder style={{ flex: 1, background: '#111' }}>
        <Text fw={600} size="xs" c="white" mb={4}>Candidate records</Text>
        <Box ref={parentRef} style={{ height: 320, overflow: 'auto', border: '1px solid #333', borderRadius: 4 }}>
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
            {virtualizer.getVirtualItems().map((vr: VirtualItem) => {
              const item = records[vr.index];
              return (
                <div
                  key={item.key}
                  data-item-key={item.key}
                  aria-selected={selected === item.key}
                  onClick={() => { setSelected(item.key); setSaved(false); }}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%',
                    height: `${vr.size}px`,
                    transform: `translateY(${vr.start}px)`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #222',
                    backgroundColor: selected === item.key ? 'rgba(56,139,255,0.15)' : 'transparent',
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: '#d9d9d9' }}>{item.code} — {item.name}</span>
                  <Group gap={4}>
                    <Badge size="xs" color={item.chip1.color}>{item.chip1.label}</Badge>
                    <Badge size="xs" color={item.chip2.color}>{item.chip2.label}</Badge>
                  </Group>
                </div>
              );
            })}
          </div>
        </Box>
        <Group justify="space-between" mt={6}>
          <Text size="xs" c="dimmed">Selected: {selected ?? 'none'}</Text>
          <Button size="xs" onClick={() => setSaved(true)} disabled={!selected}>Use selected record</Button>
        </Group>
      </Paper>
    </div>
  );
}
