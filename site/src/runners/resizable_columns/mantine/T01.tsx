'use client';

/**
 * Task ID: resizable_columns-mantine-T01
 * Task Name: Resize Name column to 200px (Mantine table)
 *
 * Setup Description:
 * Layout: isolated_card, centered.
 * One Mantine-styled table with resizable columns:
 * - Headers: Name, Email, Team, Role.
 * - Each header cell has a visible grab handle on the right edge.
 * - A "Width Monitor" line under the card title shows "Name width: ###px".
 *
 * Initial state: Name starts at 160px.
 *
 * Success Trigger: Name column width is within ±12px of 200px.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Table, Text, Tooltip } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const tableData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', team: 'Engineering', role: 'Developer' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', team: 'Design', role: 'Designer' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', team: 'Product', role: 'Manager' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<Column[]>([
    { key: 'name', label: 'Name', width: 160 },
    { key: 'email', label: 'Email', width: 200 },
    { key: 'team', label: 'Team', width: 120 },
    { key: 'role', label: 'Role', width: 120 },
  ]);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const nameWidth = columns.find(c => c.key === 'name')?.width ?? 160;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(nameWidth, 200, 12)) {
      successFired.current = true;
      onSuccess();
    }
  }, [nameWidth, onSuccess]);

  const handleMouseDown = useCallback((key: string, e: React.MouseEvent) => {
    e.preventDefault();
    const col = columns.find(c => c.key === key);
    if (col) {
      setResizing({ key, startX: e.clientX, startWidth: col.width });
      setTooltipWidth(col.width);
    }
  }, [columns]);

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(60, resizing.startWidth + delta);
      setTooltipWidth(newWidth);
      setColumns(prev => prev.map(col =>
        col.key === resizing.key ? { ...col, width: newWidth } : col
      ));
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }} data-testid="rc-table-team-members">
      <Text fw={500} size="lg" mb="xs">Team members</Text>
      <Text size="sm" c="dimmed" mb="md" data-testid="rc-width-name">
        Name width: {nameWidth}px
      </Text>
      
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {columns.map(col => (
              <Table.Th
                key={col.key}
                style={{ width: col.width, position: 'relative', userSelect: 'none' }}
              >
                {col.label}
                <Tooltip
                  label={`${Math.round(tooltipWidth ?? col.width)}px`}
                  opened={resizing?.key === col.key}
                  position="top"
                >
                  <div
                    data-testid={`rc-handle-${col.key}`}
                    onMouseDown={(e) => handleMouseDown(col.key, e)}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: 8,
                      cursor: 'col-resize',
                      background: resizing?.key === col.key ? 'rgba(34, 139, 230, 0.3)' : 'transparent',
                    }}
                  />
                </Tooltip>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tableData.map(row => (
            <Table.Tr key={row.id}>
              {columns.map(col => (
                <Table.Td key={col.key} style={{ width: col.width }}>
                  {row[col.key as keyof typeof row]}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
