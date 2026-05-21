'use client';

/**
 * Task ID: resizable_columns-mantine-T06
 * Task Name: Top-left placement: set Qty into 70–90px range
 *
 * Setup Description:
 * Layout: isolated_card anchored to the top-left of the viewport.
 * One Mantine-styled resizable table titled "Stock check":
 * - Columns: Item, Qty, Unit.
 * - A compact readout above the table shows "Qty width: ###px".
 *
 * Initial state: Qty starts at 130px (too wide).
 *
 * Success Trigger: Qty column width is between 70px and 90px (inclusive).
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: top_left
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Table, Text, Tooltip } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isInRange } from '../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const tableData = [
  { id: '1', item: 'Bolts', qty: 500, unit: 'pcs' },
  { id: '2', item: 'Washers', qty: 1200, unit: 'pcs' },
  { id: '3', item: 'Screws', qty: 800, unit: 'pcs' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<Column[]>([
    { key: 'item', label: 'Item', width: 160 },
    { key: 'qty', label: 'Qty', width: 130 },
    { key: 'unit', label: 'Unit', width: 100 },
  ]);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const qtyWidth = columns.find(c => c.key === 'qty')?.width ?? 130;

  useEffect(() => {
    if (!successFired.current && isInRange(qtyWidth, 70, 90)) {
      successFired.current = true;
      onSuccess();
    }
  }, [qtyWidth, onSuccess]);

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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }} data-testid="rc-table-stock-check">
      <Text fw={500} size="lg" mb="xs">Stock check</Text>
      <Text size="sm" c="dimmed" mb="md" data-testid="rc-width-qty">
        Qty width: {qtyWidth}px
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
