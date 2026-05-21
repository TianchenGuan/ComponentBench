'use client';

/**
 * virtual_list-mantine-v2-T06
 * Jobs table: row-scoped approver picker and row save
 *
 * Dark table with row-anchored popovers. Agent must open Job 21's "Pick approver"
 * popover, select APR-0204 (Morgan Lee), and click "Save row".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Button, Table, Badge, Popover, Box } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../../types';

interface ApproverItem { key: string; code: string; name: string; }

const firstNames = ['Aisha', 'Ben', 'Carlos', 'Diana', 'Eli', 'Fiona', 'Gael', 'Hana', 'Ivan', 'Julia',
  'Kai', 'Lena', 'Mason', 'Nora', 'Oscar', 'Priya', 'Quinn', 'Riley', 'Sam', 'Morgan'];
const lastNames = ['Patel', 'Nguyen', 'Park', 'Lee', 'Santos', 'Chen', 'Kim', 'Alvarez', 'Singh', 'Rivera'];

function buildApprovers(): ApproverItem[] {
  const list: ApproverItem[] = [];
  for (let i = 0; i < 400; i++) {
    list.push({
      key: `apr-${String(i).padStart(4, '0')}`,
      code: `APR-${String(i).padStart(4, '0')}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}`,
    });
  }
  list[41] = { key: 'apr-0041', code: 'APR-0041', name: 'Morgan Lee' };
  list[204] = { key: 'apr-0204', code: 'APR-0204', name: 'Morgan Lee' };
  return list;
}

const approvers = buildApprovers();

interface JobRow { id: number; name: string; status: string; }
const jobRows: JobRow[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1, name: `Job ${i + 1}`,
  status: ['Running', 'Idle', 'Failed', 'Queued'][i % 4],
}));

function PickerPopover({ onSave }: { onSave: (key: string) => void }) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: approvers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 38,
    overscan: 5,
  });

  useEffect(() => {
    if (opened) {
      const id = requestAnimationFrame(() => virtualizer.measure());
      return () => cancelAnimationFrame(id);
    }
  }, [opened, virtualizer]);

  return (
    <Popover opened={opened} onChange={setOpened} position="left" withArrow>
      <Popover.Target>
        <Button size="xs" variant="subtle" onClick={() => setOpened(true)}>Pick approver</Button>
      </Popover.Target>
      <Popover.Dropdown p="xs" style={{ width: 300 }}>
        <Box ref={parentRef} style={{ height: 240, overflow: 'auto', border: '1px solid #333', borderRadius: 4 }}>
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
            {virtualizer.getVirtualItems().map((vr: VirtualItem) => {
              const item = approvers[vr.index];
              return (
                <div
                  key={item.key}
                  data-item-key={item.key}
                  aria-selected={selected === item.key}
                  onClick={() => setSelected(item.key)}
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
                  {item.code} — {item.name}
                </div>
              );
            })}
          </div>
        </Box>
        <Button size="xs" fullWidth mt={6} disabled={!selected}
          onClick={() => { if (selected) { onSave(selected); setOpened(false); } }}>
          Save row
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [savedRows, setSavedRows] = useState<Record<number, string>>({});
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (savedRows[21] === 'apr-0204') { successRef.current = true; onSuccess(); }
  }, [savedRows, onSuccess]);

  const rows = jobRows.map(row => (
    <Table.Tr key={row.id}>
      <Table.Td><Text size="xs" c="white">{row.name}</Text></Table.Td>
      <Table.Td>
        <Badge size="xs" color={row.status === 'Failed' ? 'red' : row.status === 'Running' ? 'blue' : 'gray'}>
          {row.status}
        </Badge>
      </Table.Td>
      <Table.Td><Text size="xs" c="dimmed">{savedRows[row.id] ?? '—'}</Text></Table.Td>
      <Table.Td>
        <PickerPopover onSave={(key) => setSavedRows(prev => ({ ...prev, [row.id]: key }))} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div style={{ background: '#0d0d1a', padding: 16, borderRadius: 8, minWidth: 640 }}>
      <Paper shadow="xs" withBorder style={{ background: '#1a1a2e', overflow: 'auto' }}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th><Text size="xs" c="white">Job</Text></Table.Th>
              <Table.Th><Text size="xs" c="white">Status</Text></Table.Th>
              <Table.Th><Text size="xs" c="white">Approver</Text></Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}
