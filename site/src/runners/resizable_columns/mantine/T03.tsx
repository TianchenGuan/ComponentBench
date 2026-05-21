'use client';

/**
 * Task ID: resizable_columns-mantine-T03
 * Task Name: Reset column widths to defaults (Mantine)
 *
 * Setup Description:
 * Layout: isolated_card, centered.
 * One resizable Mantine-styled table with an action row above it:
 * - Buttons: "Reset widths" (primary), "Download" (distractor).
 * - Table titled "Contacts".
 *
 * Default widths: Name 180px, Email 260px, Phone 140px, Company 200px.
 * Initial state (customized): Name 220px, Email 220px, Phone 140px, Company 200px.
 *
 * Success Trigger: All column widths equal the default layout exactly.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Table, Text, Button, Group, Notification } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { allWidthsExactMatch } from '../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const defaultWidths: Record<string, number> = {
  name: 180,
  email: 260,
  phone: 140,
  company: 200,
};

const tableData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0100', company: 'Acme Inc' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0200', company: 'TechCorp' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', phone: '555-0300', company: 'StartupXYZ' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<Column[]>([
    { key: 'name', label: 'Name', width: 220 },
    { key: 'email', label: 'Email', width: 220 },
    { key: 'phone', label: 'Phone', width: 140 },
    { key: 'company', label: 'Company', width: 200 },
  ]);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const successFired = useRef(false);

  const currentWidths: Record<string, number> = {};
  columns.forEach(c => { currentWidths[c.key] = c.width; });

  useEffect(() => {
    if (!successFired.current && allWidthsExactMatch(currentWidths, defaultWidths)) {
      successFired.current = true;
      onSuccess();
    }
  }, [currentWidths, onSuccess]);

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

  const handleReset = () => {
    setColumns(prev => prev.map(col => ({
      ...col,
      width: defaultWidths[col.key] ?? col.width,
    })));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 880 }} data-testid="rc-table-contacts">
      <Text fw={500} size="lg" mb="xs">Contacts</Text>
      
      <Group mb="md">
        <Button onClick={handleReset} data-testid="rc-reset-widths">
          Reset widths
        </Button>
        <Button variant="outline">Download</Button>
      </Group>
      
      <Text size="xs" c="dimmed" mb="sm">
        Default: Name 180px, Email 260px, Phone 140px, Company 200px
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

      {showToast && (
        <Notification
          icon={<IconCheck size={18} />}
          color="green"
          title="Success"
          onClose={() => setShowToast(false)}
          style={{ position: 'fixed', bottom: 20, right: 20 }}
        >
          Column widths reset to defaults
        </Notification>
      )}
    </Card>
  );
}
