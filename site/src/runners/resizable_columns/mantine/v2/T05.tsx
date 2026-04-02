'use client';

/**
 * Task ID: resizable_columns-mantine-v2-T05
 * Overrides table only: Owner width in [144, 152] inclusive; Defaults unchanged.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Stack, Table, Text, Tooltip } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { isInRange } from '../../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const DEFAULTS_INITIAL_OWNER = 170;
const rows = [
  { id: '1', rule: 'R1', owner: 'ops-bot', status: 'On', updated: 'Mon' },
  { id: '2', rule: 'R2', owner: 'sre', status: 'Warn', updated: 'Tue' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [defaultsCols, setDefaultsCols] = useState<Column[]>([
    { key: 'rule', label: 'Rule', width: 90 },
    { key: 'owner', label: 'Owner', width: DEFAULTS_INITIAL_OWNER },
    { key: 'status', label: 'Status', width: 100 },
    { key: 'updated', label: 'Updated', width: 100 },
  ]);
  const [overridesCols, setOverridesCols] = useState<Column[]>([
    { key: 'rule', label: 'Rule', width: 90 },
    { key: 'owner', label: 'Owner', width: 182 },
    { key: 'status', label: 'Status', width: 100 },
    { key: 'updated', label: 'Updated', width: 100 },
  ]);
  const [resizing, setResizing] = useState<{
    table: 'defaults' | 'overrides';
    key: string;
    startX: number;
    startWidth: number;
  } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const defOwner = defaultsCols.find(c => c.key === 'owner')?.width ?? DEFAULTS_INITIAL_OWNER;
  const ovOwner = overridesCols.find(c => c.key === 'owner')?.width ?? 182;

  useEffect(() => {
    const rangeOk = isInRange(ovOwner, 144, 152);
    const defaultsPristine = defOwner === DEFAULTS_INITIAL_OWNER;
    if (!successFired.current && rangeOk && defaultsPristine) {
      successFired.current = true;
      onSuccess();
    }
  }, [defOwner, ovOwner, onSuccess]);

  const handleMouseDown = useCallback(
    (table: 'defaults' | 'overrides', key: string, e: React.MouseEvent) => {
      e.preventDefault();
      const cols = table === 'defaults' ? defaultsCols : overridesCols;
      const col = cols.find(c => c.key === key);
      if (col) {
        setResizing({ table, key, startX: e.clientX, startWidth: col.width });
        setTooltipWidth(col.width);
      }
    },
    [defaultsCols, overridesCols]
  );

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(60, resizing.startWidth + delta);
      setTooltipWidth(newWidth);
      if (resizing.table === 'defaults') {
        setDefaultsCols(prev => prev.map(col => (col.key === resizing.key ? { ...col, width: newWidth } : col)));
      } else {
        setOverridesCols(prev => prev.map(col => (col.key === resizing.key ? { ...col, width: newWidth } : col)));
      }
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

  const renderTable = (
    label: string,
    testId: string,
    cols: Column[],
    table: 'defaults' | 'overrides',
    showOwnerMonitor: boolean
  ) => (
    <div data-testid={testId}>
      <Text fw={600} size="sm" mb="xs">
        {label}
      </Text>
      {showOwnerMonitor && (
        <Text size="xs" c="dimmed" mb="xs" data-testid="rc-width-owner-overrides">
          Owner width: {cols.find(c => c.key === 'owner')?.width}px
        </Text>
      )}
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {cols.map(col => (
              <Table.Th
                key={col.key}
                style={{ width: col.width, position: 'relative', userSelect: 'none', padding: '6px 8px' }}
              >
                {col.label}
                <Tooltip
                  label={`${Math.round(tooltipWidth ?? col.width)}px`}
                  opened={resizing?.table === table && resizing?.key === col.key}
                  position="top"
                >
                  <div
                    data-testid={`rc-handle-${table}-${col.key}`}
                    onMouseDown={e => handleMouseDown(table, col.key, e)}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: 10,
                      cursor: 'col-resize',
                      background:
                        resizing?.table === table && resizing?.key === col.key
                          ? 'rgba(34, 139, 230, 0.25)'
                          : 'rgba(0,0,0,0.04)',
                      borderLeft: '1px solid var(--mantine-color-gray-4)',
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
              {cols.map(col => (
                <Table.Td key={col.key} style={{ width: col.width, padding: '6px 8px' }}>
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
    <Card padding="sm" withBorder radius="md" maw={560} data-testid="rc-mantine-v2-t05">
      <Text size="xs" c="dimmed" mb="md">
        Routing defaults · Overrides · Schedules · Contact policies · Rate limits · Webhooks · Retries · Idempotency
        keys · Circuit breakers · Bulk edits · Import jobs · Audit exports.
      </Text>
      <Stack gap="lg">
        {renderTable('Defaults', 'rc-table-defaults', defaultsCols, 'defaults', false)}
        {renderTable('Overrides', 'rc-table-overrides', overridesCols, 'overrides', true)}
      </Stack>
    </Card>
  );
}
