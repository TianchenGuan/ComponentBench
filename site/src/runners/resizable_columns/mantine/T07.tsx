'use client';

/**
 * Task ID: resizable_columns-mantine-T07
 * Task Name: Compact small: set 3 widths precisely (Mantine)
 *
 * Setup Description:
 * Layout: isolated_card, centered. Spacing is compact and scale is small.
 * One Mantine-styled table titled "Orders (compact)":
 * - Columns: ID, Customer, Status, Updated.
 * - Resize grips are thinner in compact mode.
 * - Width Monitor: "ID: ###px • Customer: ###px • Status: ###px".
 *
 * Initial state: ID 110px, Customer 170px, Status 160px.
 *
 * Success Trigger: ID ±4px of 80px, Customer ±4px of 200px, Status ±4px of 120px.
 *
 * Theme: light, Spacing: compact, Layout: isolated_card, Placement: center, Scale: small
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
  { id: 'ORD-001', customer: 'John Doe', status: 'Processing', updated: '2024-01-15' },
  { id: 'ORD-002', customer: 'Jane Smith', status: 'Shipped', updated: '2024-01-14' },
  { id: 'ORD-003', customer: 'Bob Wilson', status: 'Delivered', updated: '2024-01-13' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<Column[]>([
    { key: 'id', label: 'ID', width: 110 },
    { key: 'customer', label: 'Customer', width: 170 },
    { key: 'status', label: 'Status', width: 160 },
    { key: 'updated', label: 'Updated', width: 120 },
  ]);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const idWidth = columns.find(c => c.key === 'id')?.width ?? 110;
  const customerWidth = columns.find(c => c.key === 'customer')?.width ?? 170;
  const statusWidth = columns.find(c => c.key === 'status')?.width ?? 160;

  useEffect(() => {
    const idOk = isWithinTolerance(idWidth, 80, 4);
    const customerOk = isWithinTolerance(customerWidth, 200, 4);
    const statusOk = isWithinTolerance(statusWidth, 120, 4);
    
    if (!successFired.current && idOk && customerOk && statusOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [idWidth, customerWidth, statusWidth, onSuccess]);

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
      const newWidth = Math.max(50, resizing.startWidth + delta);
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
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 620 }} data-testid="rc-table-orders-compact">
      <Text fw={500} size="md" mb="xs">Orders (compact)</Text>
      <Text size="xs" c="dimmed" mb="sm" data-testid="rc-width-monitor">
        ID: {idWidth}px • Customer: {customerWidth}px • Status: {statusWidth}px
      </Text>
      
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {columns.map(col => (
              <Table.Th
                key={col.key}
                style={{ width: col.width, position: 'relative', userSelect: 'none', padding: '4px 8px' }}
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
                      width: 6,
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
          {tableData.map((row, idx) => (
            <Table.Tr key={idx}>
              {columns.map(col => (
                <Table.Td key={col.key} style={{ width: col.width, padding: '4px 8px', fontSize: 13 }}>
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
