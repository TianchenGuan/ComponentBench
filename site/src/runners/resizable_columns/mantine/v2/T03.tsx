'use client';

/**
 * Task ID: resizable_columns-mantine-v2-T03
 * Dark compact: Ticket 82, Team 184, Status 120 (each ±4).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Badge, Card, Group, Stack, Table, Text, Tooltip } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { allWidthsMatch } from '../../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const rows = [
  { id: '1', ticket: 'Q-104', team: 'Infra', status: 'Open', owner: 'A. Lee', updated: '09:12' },
  { id: '2', ticket: 'Q-105', team: 'Apps', status: 'Queued', owner: 'B. Kim', updated: '09:18' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<Column[]>([
    { key: 'ticket', label: 'Ticket', width: 108 },
    { key: 'team', label: 'Team', width: 150 },
    { key: 'status', label: 'Status', width: 146 },
    { key: 'owner', label: 'Owner', width: 110 },
    { key: 'updated', label: 'Updated', width: 90 },
  ]);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const ticketW = columns.find(c => c.key === 'ticket')?.width ?? 108;
  const teamW = columns.find(c => c.key === 'team')?.width ?? 150;
  const statusW = columns.find(c => c.key === 'status')?.width ?? 146;

  useEffect(() => {
    const ok = allWidthsMatch(
      { ticket: ticketW, team: teamW, status: statusW },
      { ticket: 82, team: 184, status: 120 },
      4
    );
    if (!successFired.current && ok) {
      successFired.current = true;
      onSuccess();
    }
  }, [ticketW, teamW, statusW, onSuccess]);

  const handleMouseDown = useCallback(
    (key: string, e: React.MouseEvent) => {
      e.preventDefault();
      const col = columns.find(c => c.key === key);
      if (col) {
        setResizing({ key, startX: e.clientX, startWidth: col.width });
        setTooltipWidth(col.width);
      }
    },
    [columns]
  );

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(50, resizing.startWidth + delta);
      setTooltipWidth(newWidth);
      setColumns(prev => prev.map(col => (col.key === resizing.key ? { ...col, width: newWidth } : col)));
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

  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      maw={640}
      data-testid="rc-mantine-v2-t03"
      style={{ background: '#1a1b1e' }}
    >
      <Stack gap="sm">
        <Group gap={6} wrap="wrap">
          <Badge size="xs" variant="light" color="gray">
            All
          </Badge>
          <Badge size="xs" variant="outline" color="gray">
            Mine
          </Badge>
          <Badge size="xs" variant="outline" color="gray">
            P1
          </Badge>
          <Badge size="xs" variant="outline" color="gray">
            Unassigned
          </Badge>
          <Text size="xs" c="dimmed" px={8} py={4} style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6 }}>
            List
          </Text>
        </Group>
        <Text fw={600} size="sm" c="gray.1">
          Queue (compact)
        </Text>
        <Text size="xs" c="dimmed" data-testid="rc-width-monitor-ticket-team-status">
          Ticket: {ticketW}px • Team: {teamW}px • Status: {statusW}px
        </Text>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              {columns.map(col => (
                <Table.Th
                  key={col.key}
                  style={{ width: col.width, position: 'relative', userSelect: 'none', padding: '4px 8px' }}
                >
                  <Text span size="xs" c="gray.2">
                    {col.label}
                  </Text>
                  <Tooltip
                    label={`${Math.round(tooltipWidth ?? col.width)}px`}
                    opened={resizing?.key === col.key}
                    position="top"
                    color="dark"
                  >
                    <div
                      data-testid={`rc-handle-${col.key}`}
                      onMouseDown={e => handleMouseDown(col.key, e)}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 10,
                        cursor: 'col-resize',
                        background:
                          resizing?.key === col.key ? 'rgba(34, 139, 230, 0.35)' : 'rgba(255,255,255,0.08)',
                        borderLeft: '1px solid rgba(255,255,255,0.12)',
                      }}
                    />
                  </Tooltip>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map(row => (
              <Table.Tr key={row.id}>
                {columns.map(col => (
                  <Table.Td key={col.key} style={{ width: col.width, padding: '4px 8px' }}>
                    <Text size="xs" c="gray.3">
                      {row[col.key as keyof typeof row]}
                    </Text>
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Card>
  );
}
