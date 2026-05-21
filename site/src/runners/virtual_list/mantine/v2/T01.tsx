'use client';

/**
 * virtual_list-mantine-v2-T01
 * Dataset drawer: exact duplicate owner and confirm
 *
 * Drawer with a ScrollArea-backed virtualized owner list. Two Diego Alvarez
 * rows exist. Agent must select OWN-0204 (Research) and click "Use owner".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Button, Group, Stack, Badge, Drawer, Box } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../../types';

interface OwnerItem { key: string; code: string; name: string; team: string; }

const teams = ['Research', 'Infra', 'Platform', 'Security', 'ML', 'DevOps', 'Analytics', 'Backend', 'Frontend', 'QA'];
const firstNames = ['Aisha', 'Ben', 'Carlos', 'Diana', 'Eli', 'Fiona', 'Gael', 'Hana', 'Ivan', 'Julia'];
const lastNames = ['Patel', 'Nguyen', 'Park', 'Müller', 'Santos', 'Chen', 'Kim', 'Alvarez', 'Singh', 'Lee'];

function buildOwners(): OwnerItem[] {
  const list: OwnerItem[] = [];
  for (let i = 0; i < 800; i++) {
    list.push({
      key: `own-${String(i).padStart(4, '0')}`,
      code: `OWN-${String(i).padStart(4, '0')}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}`,
      team: teams[i % teams.length],
    });
  }
  list[41] = { key: 'own-0041', code: 'OWN-0041', name: 'Diego Alvarez', team: 'Infra' };
  list[204] = { key: 'own-0204', code: 'OWN-0204', name: 'Diego Alvarez', team: 'Research' };
  return list;
}

const owners = buildOwners();

export default function T01({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const successRef = useRef(false);

  const virtualizer = useVirtualizer({
    count: owners.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 46,
    overscan: 5,
  });

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => virtualizer.measure());
      return () => cancelAnimationFrame(id);
    }
  }, [open, virtualizer]);

  useEffect(() => {
    if (successRef.current) return;
    if (savedKey === 'own-0204' && !open) { successRef.current = true; onSuccess(); }
  }, [savedKey, open, onSuccess]);

  const handleUse = () => {
    if (pendingKey) { setSavedKey(pendingKey); setOpen(false); }
  };

  return (
    <div style={{ padding: 16, maxWidth: 500 }}>
      <Paper shadow="xs" p="sm" mb="sm" withBorder>
        <Text fw={600} size="sm">Dataset summary</Text>
        <Group gap="xs" mt={4}>
          <Badge size="sm" color="blue">v2.1</Badge>
          <Badge size="sm" color="green">Published</Badge>
        </Group>
        <Text size="xs" c="dimmed" mt={4}>Permissions: read-only for external users</Text>
      </Paper>

      <Button onClick={() => { setOpen(true); setPendingKey(null); }}>Choose dataset owner</Button>
      {savedKey && <Text size="sm" ml="sm" span>Assigned: {owners.find(o => o.key === savedKey)?.code}</Text>}

      <Drawer opened={open} onClose={() => setOpen(false)} title="Choose dataset owner" position="right" size="md">
        <Box ref={parentRef} style={{ height: 420, overflow: 'auto', border: '1px solid #e9ecef', borderRadius: 4 }}>
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
            {virtualizer.getVirtualItems().map((vr: VirtualItem) => {
              const item = owners[vr.index];
              return (
                <div
                  key={item.key}
                  data-item-key={item.key}
                  aria-selected={pendingKey === item.key}
                  onClick={() => setPendingKey(item.key)}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%',
                    height: `${vr.size}px`,
                    transform: `translateY(${vr.start}px)`,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: pendingKey === item.key ? '#e7f5ff' : 'transparent',
                    fontSize: 13,
                  }}
                >
                  {item.code} — {item.name} ({item.team})
                </div>
              );
            })}
          </div>
        </Box>
        <Text size="xs" c="dimmed" mt="xs">Pending: {pendingKey ?? 'none'}</Text>
        <Button fullWidth mt="sm" disabled={!pendingKey} onClick={handleUse}>Use owner</Button>
      </Drawer>
    </div>
  );
}
