'use client';

/**
 * Task ID: resizable_columns-mantine-v2-T02
 * Drawer accordion: Notes 260px ±5 in Secondary — Support view, then Save changes (require_confirm).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Accordion,
  Button,
  Card,
  Drawer,
  Group,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const PREVIEW_DATA: Record<string, Record<string, string>[]> = {
  primary: [
    { id: '1', deal: 'DEAL-1', stage: 'High', notes: 'Renewal call', owner: 'Sam' },
    { id: '2', deal: 'DEAL-2', stage: 'Med', notes: 'Pricing', owner: 'Lee' },
  ],
  secondary: [
    { id: '1', ticket: 'INC-77', priority: 'P1', notes: 'Customer blocked', updated: 'Now' },
    { id: '2', ticket: 'INC-78', priority: 'P2', notes: 'Login loop', updated: 'Soon' },
  ],
  archived: [
    { id: '1', ref: 'RO-10', prio: 'Low', notes: 'FYI only', closed: '2024-06-01' },
    { id: '2', ref: 'RO-11', prio: 'Low', notes: 'Docs request', closed: '2024-06-02' },
  ],
};

function colsPrimary(): Column[] {
  return [
    { key: 'deal', label: 'Deal', width: 100 },
    { key: 'stage', label: 'Stage', width: 90 },
    { key: 'notes', label: 'Notes', width: 160 },
    { key: 'owner', label: 'Owner', width: 100 },
  ];
}

function colsArchived(): Column[] {
  return [
    { key: 'ref', label: 'Ref', width: 90 },
    { key: 'prio', label: 'Priority', width: 80 },
    { key: 'notes', label: 'Notes', width: 150 },
    { key: 'closed', label: 'Closed', width: 100 },
  ];
}

function colsSecondary(notesW: number): Column[] {
  return [
    { key: 'ticket', label: 'Ticket', width: 100 },
    { key: 'priority', label: 'Priority', width: 90 },
    { key: 'notes', label: 'Notes', width: notesW },
    { key: 'updated', label: 'Updated', width: 100 },
  ];
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draftSecondaryNotes, setDraftSecondaryNotes] = useState(182);
  const [committedNotes, setCommittedNotes] = useState(182);
  const [saveCount, setSaveCount] = useState(0);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const primaryCols = colsPrimary();
  const archivedCols = colsArchived();
  const secondaryCols = colsSecondary(draftSecondaryNotes);

  useEffect(() => {
    if (!successFired.current && saveCount > 0 && isWithinTolerance(committedNotes, 260, 5)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saveCount, committedNotes, onSuccess]);

  const handleMouseDown = useCallback(
    (key: string, e: React.MouseEvent) => {
      if (!drawerOpen || key !== 'notes') return;
      e.preventDefault();
      const col = secondaryCols.find(c => c.key === 'notes');
      if (col) {
        setResizing({ key: 'notes', startX: e.clientX, startWidth: col.width });
        setTooltipWidth(col.width);
      }
    },
    [drawerOpen, secondaryCols]
  );

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(60, resizing.startWidth + delta);
      setTooltipWidth(newWidth);
      setDraftSecondaryNotes(newWidth);
    };

    const handleMouseUp = () => {
      setResizing(null);
      setTooltipWidth(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  const openDrawer = () => setDrawerOpen(true);

  const handleCancel = () => {
    setDraftSecondaryNotes(committedNotes);
    setDrawerOpen(false);
  };

  const handleSave = () => {
    setCommittedNotes(draftSecondaryNotes);
    setSaveCount(c => c + 1);
    setDrawerOpen(false);
  };

  const renderPreview = (
    value: string,
    title: string,
    cols: Column[],
    dataKey: 'primary' | 'secondary' | 'archived',
    showNotesMonitor: boolean
  ) => {
    const notesW = cols.find(c => c.key === 'notes')?.width ?? 0;
    return (
      <Accordion.Item value={value}>
        <Accordion.Control>{title}</Accordion.Control>
        <Accordion.Panel>
          {showNotesMonitor && (
            <Text size="xs" c="dimmed" mb="xs" data-testid="rc-width-notes-secondary">
              Notes width: {notesW}px
            </Text>
          )}
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                {cols.map(col => (
                  <Table.Th
                    key={col.key}
                    style={{ width: col.width, position: 'relative', userSelect: 'none', padding: '6px 8px' }}
                  >
                    {col.label}
                    {dataKey === 'secondary' && drawerOpen && col.key === 'notes' ? (
                      <Tooltip
                        label={`${Math.round(tooltipWidth ?? col.width)}px`}
                        opened={resizing?.key === 'notes'}
                        position="top"
                      >
                        <div
                          data-testid="rc-handle-secondary-notes"
                          onMouseDown={e => handleMouseDown('notes', e)}
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: 10,
                            cursor: 'col-resize',
                            background:
                              resizing?.key === 'notes' ? 'rgba(34, 139, 230, 0.25)' : 'rgba(0,0,0,0.04)',
                            borderLeft: '1px solid var(--mantine-color-gray-4)',
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: 10,
                          cursor: dataKey === 'secondary' ? 'default' : 'col-resize',
                          background: 'rgba(0,0,0,0.04)',
                          borderLeft: '1px solid var(--mantine-color-gray-4)',
                        }}
                      />
                    )}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {PREVIEW_DATA[dataKey].map(row => (
                <Table.Tr key={row.id}>
                  {cols.map(col => (
                    <Table.Td key={col.key} style={{ width: col.width, padding: '6px 8px' }}>
                      {row[col.key] ?? '—'}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Accordion.Panel>
      </Accordion.Item>
    );
  };

  return (
    <Stack gap="md" maw={520} data-testid="rc-mantine-v2-t02">
      <Card withBorder padding="sm" radius="md">
        <Text size="sm" fw={600} mb="xs">
          Column presets
        </Text>
        <Text size="xs" c="dimmed" mb="sm">
          Tune how support views render in lists and exports. Draft changes apply after you save.
        </Text>
        <Button size="xs" onClick={openDrawer}>
          Customize columns
        </Button>
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={handleCancel}
        title="Customize columns"
        position="right"
        size="lg"
        padding="md"
      >
        <Accordion multiple defaultValue={[]}>
          {renderPreview('primary', 'Primary — Sales view', primaryCols, 'primary', false)}
          {renderPreview('secondary', 'Secondary — Support view', secondaryCols, 'secondary', true)}
          {renderPreview('archived', 'Archived — Read only', archivedCols, 'archived', false)}
        </Accordion>
        <Group justify="flex-end" mt="lg" gap="sm">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </Group>
      </Drawer>
    </Stack>
  );
}
