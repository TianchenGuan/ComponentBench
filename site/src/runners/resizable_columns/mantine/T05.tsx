'use client';

/**
 * Task ID: resizable_columns-mantine-T05
 * Task Name: Match widths to visual reference strip (Mantine)
 *
 * Setup Description:
 * Layout: isolated_card, centered.
 * One Mantine-styled resizable table with a visual reference strip above it:
 * - The strip has labeled segments "Name" and "Email" whose boundary should align with the table's column separator.
 * - No numeric pixel values are displayed.
 *
 * Table columns: Name, Email, Role.
 * Target widths: Name 180px, Email 260px.
 *
 * Success Trigger: Name ±6px of 180px, Email ±6px of 260px.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Table, Text, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const tableData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<Column[]>([
    { key: 'name', label: 'Name', width: 120 },
    { key: 'email', label: 'Email', width: 200 },
    { key: 'role', label: 'Role', width: 120 },
  ]);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const successFired = useRef(false);

  const nameWidth = columns.find(c => c.key === 'name')?.width ?? 160;
  const emailWidth = columns.find(c => c.key === 'email')?.width ?? 240;

  useEffect(() => {
    const nameOk = isWithinTolerance(nameWidth, 180, 6);
    const emailOk = isWithinTolerance(emailWidth, 260, 6);
    
    if (!successFired.current && nameOk && emailOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [nameWidth, emailWidth, onSuccess]);

  const handleMouseDown = useCallback((key: string, e: React.MouseEvent) => {
    e.preventDefault();
    const col = columns.find(c => c.key === key);
    if (col) {
      setResizing({ key, startX: e.clientX, startWidth: col.width });
    }
  }, [columns]);

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(60, resizing.startWidth + delta);
      setColumns(prev => prev.map(col =>
        col.key === resizing.key ? { ...col, width: newWidth } : col
      ));
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  const totalWidth = columns.reduce((sum, c) => sum + c.width, 0);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 620 }} data-testid="rc-table-members">
      <Text fw={500} size="lg" mb="md">Members</Text>
      
      {/* Visual reference strip — aligned to table */}
      <Box
        mb={4}
        style={{
          display: 'flex',
          gap: 0,
          borderRadius: 4,
          overflow: 'hidden',
        }}
        data-testid="rc-reference-strip"
      >
        <Box style={{ width: 180, background: '#e7f5ff', padding: '8px 12px', borderRight: '1px solid #74c0fc', border: '1px solid #a5d8ff', fontSize: 13 }}>
          Name
        </Box>
        <Box style={{ width: 260, background: '#d3f9d8', padding: '8px 12px', border: '1px solid #8ce99a', fontSize: 13 }}>
          Email
        </Box>
      </Box>

      
      <Table striped highlightOnHover withTableBorder style={{ tableLayout: 'fixed', width: totalWidth }}>
        <Table.Thead>
          <Table.Tr>
            {columns.map(col => (
              <Table.Th
                key={col.key}
                style={{ width: col.width, position: 'relative', userSelect: 'none' }}
              >
                {col.label}
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
