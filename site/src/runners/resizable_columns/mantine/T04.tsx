'use client';

/**
 * Task ID: resizable_columns-mantine-T04
 * Task Name: Two tables: resize Warehouse in Primary inventory
 *
 * Setup Description:
 * Layout: isolated_card, centered, containing two Mantine-styled resizable tables.
 * - "Primary (Inventory)" — target instance: Columns SKU, Item, Warehouse, On hand.
 * - "Secondary (Backorders)" — distractor: Columns SKU, Item, Warehouse, ETA.
 *
 * Initial state: Primary.Warehouse starts at 140px.
 *
 * Success Trigger: In Primary (Inventory), Warehouse width is within ±8px of 180px.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Table, Text, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const primaryData = [
  { id: '1', sku: 'SKU-001', item: 'Widget A', warehouse: 'Seattle', onHand: 150 },
  { id: '2', sku: 'SKU-002', item: 'Widget B', warehouse: 'Austin', onHand: 75 },
];

const secondaryData = [
  { id: '1', sku: 'SKU-003', item: 'Gadget X', warehouse: 'Denver', eta: '2024-02-01' },
  { id: '2', sku: 'SKU-004', item: 'Gadget Y', warehouse: 'Miami', eta: '2024-02-15' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [primaryColumns, setPrimaryColumns] = useState<Column[]>([
    { key: 'sku', label: 'SKU', width: 100 },
    { key: 'item', label: 'Item', width: 140 },
    { key: 'warehouse', label: 'Warehouse', width: 140 },
    { key: 'onHand', label: 'On hand', width: 100 },
  ]);
  const [secondaryColumns, setSecondaryColumns] = useState<Column[]>([
    { key: 'sku', label: 'SKU', width: 100 },
    { key: 'item', label: 'Item', width: 140 },
    { key: 'warehouse', label: 'Warehouse', width: 140 },
    { key: 'eta', label: 'ETA', width: 120 },
  ]);
  const [resizing, setResizing] = useState<{ table: 'primary' | 'secondary'; key: string; startX: number; startWidth: number } | null>(null);
  const successFired = useRef(false);

  const warehouseWidth = primaryColumns.find(c => c.key === 'warehouse')?.width ?? 140;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(warehouseWidth, 180, 8)) {
      successFired.current = true;
      onSuccess();
    }
  }, [warehouseWidth, onSuccess]);

  const handleMouseDown = useCallback((table: 'primary' | 'secondary', key: string, e: React.MouseEvent) => {
    e.preventDefault();
    const cols = table === 'primary' ? primaryColumns : secondaryColumns;
    const col = cols.find(c => c.key === key);
    if (col) {
      setResizing({ table, key, startX: e.clientX, startWidth: col.width });
    }
  }, [primaryColumns, secondaryColumns]);

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(60, resizing.startWidth + delta);
      
      if (resizing.table === 'primary') {
        setPrimaryColumns(prev => prev.map(col =>
          col.key === resizing.key ? { ...col, width: newWidth } : col
        ));
      } else {
        setSecondaryColumns(prev => prev.map(col =>
          col.key === resizing.key ? { ...col, width: newWidth } : col
        ));
      }
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

  const renderTable = (
    title: string,
    testId: string,
    columns: Column[],
    data: typeof primaryData | typeof secondaryData,
    table: 'primary' | 'secondary'
  ) => (
    <div data-testid={testId}>
      <Text fw={500} mb="xs">{title}</Text>
      {table === 'primary' && (
        <Text size="sm" c="dimmed" mb="sm" data-testid="rc-width-warehouse">
          Warehouse width: {warehouseWidth}px
        </Text>
      )}
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
                  data-testid={`rc-handle-${table}-${col.key}`}
                  onMouseDown={(e) => handleMouseDown(table, col.key, e)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 8,
                    cursor: 'col-resize',
                    background: resizing?.table === table && resizing?.key === col.key ? 'rgba(34, 139, 230, 0.3)' : 'transparent',
                  }}
                />
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map(row => (
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
    </div>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }} data-testid="rc-container">
      <Stack gap="xl">
        {renderTable('Primary (Inventory)', 'rc-table-inventory-primary', primaryColumns, primaryData, 'primary')}
        {renderTable('Secondary (Backorders)', 'rc-table-inventory-secondary', secondaryColumns, secondaryData, 'secondary')}
      </Stack>
    </Card>
  );
}
