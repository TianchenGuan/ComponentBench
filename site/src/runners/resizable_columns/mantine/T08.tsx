'use client';

/**
 * Task ID: resizable_columns-mantine-T08
 * Task Name: Horizontal scroll: find Billing Address and set to 340px
 *
 * Setup Description:
 * Layout: isolated_card anchored to the bottom-right.
 * One Mantine-styled resizable table titled "Customers":
 * - Many columns; Billing Address starts off-screen (horizontal scroll).
 * - Width Monitor shows "Billing Address width: ###px".
 *
 * Initial state: Billing Address starts at 260px.
 *
 * Success Trigger: Billing Address column width is within ±6px of 340px.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: bottom_right
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Table, Text, ScrollArea, Tooltip } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const tableData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0100', city: 'New York', state: 'NY', zip: '10001', country: 'USA', shippingAddress: '123 Main St', billingAddress: '123 Main St, Apt 4B', notes: 'VIP' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0200', city: 'Los Angeles', state: 'CA', zip: '90210', country: 'USA', shippingAddress: '456 Oak Ave', billingAddress: '456 Oak Ave, Suite 100', notes: '' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<Column[]>([
    { key: 'name', label: 'Name', width: 120 },
    { key: 'email', label: 'Email', width: 160 },
    { key: 'phone', label: 'Phone', width: 100 },
    { key: 'city', label: 'City', width: 100 },
    { key: 'state', label: 'State', width: 60 },
    { key: 'zip', label: 'ZIP', width: 70 },
    { key: 'country', label: 'Country', width: 80 },
    { key: 'shippingAddress', label: 'Shipping Address', width: 200 },
    { key: 'billingAddress', label: 'Billing Address', width: 260 },
    { key: 'notes', label: 'Notes', width: 100 },
  ]);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const billingWidth = columns.find(c => c.key === 'billingAddress')?.width ?? 260;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(billingWidth, 340, 6)) {
      successFired.current = true;
      onSuccess();
    }
  }, [billingWidth, onSuccess]);

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

  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }} data-testid="rc-table-customers">
      <Text fw={500} size="lg" mb="xs">Customers</Text>
      <Text size="sm" c="dimmed" mb="md" data-testid="rc-width-billing">
        Billing Address width: {billingWidth}px
      </Text>
      
      <ScrollArea w="100%">
        <Table striped highlightOnHover withTableBorder style={{ width: totalWidth, minWidth: totalWidth }}>
          <Table.Thead>
            <Table.Tr>
              {columns.map(col => (
                <Table.Th
                  key={col.key}
                  style={{ width: col.width, minWidth: col.width, position: 'relative', userSelect: 'none' }}
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
                  <Table.Td key={col.key} style={{ width: col.width, minWidth: col.width }}>
                    {row[col.key as keyof typeof row]}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
