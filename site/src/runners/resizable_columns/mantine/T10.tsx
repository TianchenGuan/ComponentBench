'use client';

/**
 * Task ID: resizable_columns-mantine-T10
 * Task Name: Form section: set API Key column to 171px with tooltip-only feedback
 *
 * Setup Description:
 * Layout: form_section with medium clutter.
 * - A filter row above the table (Date range, Status dropdown, Search input) — distractors.
 * - Section heading "API logs" followed by a Mantine-styled resizable table.
 *
 * API logs table columns: Time, Method, Endpoint, API Key, Status.
 * No persistent width monitor — only a small tooltip during drag shows the width.
 *
 * Initial state: API Key starts at 220px. minWidth 140px.
 *
 * Success Trigger: API Key column width is within ±3px of 171px.
 *
 * Theme: light, Spacing: comfortable, Layout: form_section, Placement: center
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Table, Text, TextInput, Select, Group, Tooltip } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

interface Column {
  key: string;
  label: string;
  width: number;
  minWidth?: number;
}

const tableData = [
  { id: '1', time: '14:32:05', method: 'GET', endpoint: '/api/users', apiKey: 'sk_live_***abc', status: '200' },
  { id: '2', time: '14:31:48', method: 'POST', endpoint: '/api/orders', apiKey: 'sk_live_***def', status: '201' },
  { id: '3', time: '14:31:22', method: 'GET', endpoint: '/api/products', apiKey: 'sk_test_***xyz', status: '200' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<Column[]>([
    { key: 'time', label: 'Time', width: 100 },
    { key: 'method', label: 'Method', width: 80 },
    { key: 'endpoint', label: 'Endpoint', width: 160 },
    { key: 'apiKey', label: 'API Key', width: 220, minWidth: 140 },
    { key: 'status', label: 'Status', width: 80 },
  ]);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const apiKeyWidth = columns.find(c => c.key === 'apiKey')?.width ?? 220;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(apiKeyWidth, 171, 3)) {
      successFired.current = true;
      onSuccess();
    }
  }, [apiKeyWidth, onSuccess]);

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
      const col = columns.find(c => c.key === resizing.key);
      const minW = col?.minWidth ?? 60;
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(minW, resizing.startWidth + delta);
      setTooltipWidth(newWidth);
      setColumns(prev => prev.map(c =>
        c.key === resizing.key ? { ...c, width: newWidth } : c
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
  }, [resizing, columns]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 750 }} data-testid="rc-api-logs-form">
      {/* Filter row */}
      <Group mb="md">
        <Select
          label="Date range"
          placeholder="Select"
          data={['Today', 'Last 7 days', 'Last 30 days']}
          defaultValue="Today"
          style={{ width: 150 }}
        />
        <Select
          label="Status"
          placeholder="All"
          data={['All', '2xx', '4xx', '5xx']}
          defaultValue="All"
          style={{ width: 100 }}
        />
        <TextInput
          label="Search"
          placeholder="Search endpoints..."
          leftSection={<IconSearch size={16} />}
          style={{ width: 200 }}
        />
      </Group>

      <Text fw={500} size="lg" mb="sm">API logs</Text>
      
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
