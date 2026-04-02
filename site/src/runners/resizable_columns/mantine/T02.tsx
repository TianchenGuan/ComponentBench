'use client';

/**
 * Task ID: resizable_columns-mantine-T02
 * Task Name: Dark theme: set Price column to 120px
 *
 * Setup Description:
 * Layout: isolated_card, centered, dark theme.
 * One Mantine-styled "Products" table with resizable headers:
 * - Headers: Product, Category, Price, Stock.
 * - A "Price width: ###px" monitor is shown under the table title.
 *
 * Initial state: Price starts at 160px.
 *
 * Success Trigger: Price column width is within ±12px of 120px.
 *
 * Theme: dark, Spacing: comfortable, Layout: isolated_card, Placement: center
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
  { id: '1', product: 'Widget A', category: 'Electronics', price: '$99.99', stock: 150 },
  { id: '2', product: 'Widget B', category: 'Electronics', price: '$149.99', stock: 75 },
  { id: '3', product: 'Gadget X', category: 'Accessories', price: '$49.99', stock: 200 },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<Column[]>([
    { key: 'product', label: 'Product', width: 160 },
    { key: 'category', label: 'Category', width: 140 },
    { key: 'price', label: 'Price', width: 160 },
    { key: 'stock', label: 'Stock', width: 100 },
  ]);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const priceWidth = columns.find(c => c.key === 'price')?.width ?? 160;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(priceWidth, 120, 12)) {
      successFired.current = true;
      onSuccess();
    }
  }, [priceWidth, onSuccess]);

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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 660, background: '#1a1b1e' }} data-testid="rc-table-products">
      <Text fw={500} size="lg" mb="xs" c="white">Products</Text>
      <Text size="sm" c="dimmed" mb="md" data-testid="rc-width-price">
        Price width: {priceWidth}px
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
                      background: resizing?.key === col.key ? 'rgba(34, 139, 230, 0.3)' : 'rgba(255,255,255,0.1)',
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
