'use client';

/**
 * Task ID: resizable_columns-mantine-v2-T01
 * ScrollArea table: find Escalation note and resize it (328px ±5).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, ScrollArea, Stack, Table, Text, Tooltip } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

interface Column {
  key: string;
  label: string;
  width: number;
}

const rows = [
  { id: '1', ticket: 'CS-901', customer: 'Acme', country: 'US', escalation: 'VIP follow-up', followup: 'Mon' },
  { id: '2', ticket: 'CS-902', customer: 'Globex', country: 'CA', escalation: 'Legal hold', followup: 'Tue' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<Column[]>([
    { key: 'ticket', label: 'Ticket', width: 100 },
    { key: 'customer', label: 'Customer', width: 120 },
    { key: 'country', label: 'Country', width: 100 },
    { key: 'escalation_note', label: 'Escalation note', width: 248 },
    { key: 'followup', label: 'Follow-up', width: 120 },
  ]);
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);
  const successFired = useRef(false);

  const escalationWidth = columns.find(c => c.key === 'escalation_note')?.width ?? 248;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(escalationWidth, 328, 5)) {
      successFired.current = true;
      onSuccess();
    }
  }, [escalationWidth, onSuccess]);

  const handleMouseDown = useCallback(
    (key: string, e: React.MouseEvent) => {
      e.preventDefault();
      const col = columns.find(c => c.key === key);
      if (col) {
        setResizing({ key, startX: e.clientX, startWidth: col.width });
        setTooltipWidth(col.width);
      }
    },
    [columns]
  );

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(60, resizing.startWidth + delta);
      setTooltipWidth(newWidth);
      setColumns(prev => prev.map(col => (col.key === resizing.key ? { ...col, width: newWidth } : col)));
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

  const tableMinWidth = columns.reduce((s, c) => s + c.width, 0);

  return (
    <Stack gap="md" maw={560} data-testid="rc-mantine-v2-t01">
      <Text size="xs" c="dimmed" style={{ maxHeight: 120, overflow: 'auto' }}>
        Support queue summary · SLA watch · Queue depth · Assignment rules · Priority tiers · Routing hints ·
        Escalation policy · After-hours coverage · Customer health scores · Repeat contact flags · Channel mix ·
        Satisfaction snapshots · Backlog aging · Team capacity · Holiday calendar · Knowledge base links · Macros
        · Tags · Saved views · Export schedules · Audit trail · Integration status · Webhook retries · API rate
        limits · Sandbox toggles · Feature flags · Notification digests · Training mode · Coaching notes · QA
        samples · Compliance reminders · Data retention · PII handling · Security attestations · Vendor contacts ·
        Maintenance windows.
      </Text>
      <Card shadow="sm" padding="sm" radius="md" withBorder>
        <Text fw={600} size="sm" mb="xs">
          Customer issues
        </Text>
        <Text size="xs" c="dimmed" mb="sm" data-testid="rc-width-escalation-note">
          Escalation note width: {escalationWidth}px
        </Text>
        <ScrollArea type="always" scrollbars="x" offsetScrollbars style={{ width: '100%' }} mah={260}>
          <Table striped highlightOnHover withTableBorder style={{ minWidth: tableMinWidth }}>
            <Table.Thead>
              <Table.Tr>
                {columns.map(col => (
                  <Table.Th
                    key={col.key}
                    style={{ width: col.width, position: 'relative', userSelect: 'none', padding: '6px 10px' }}
                  >
                    {col.label}
                    <Tooltip
                      label={`${Math.round(tooltipWidth ?? col.width)}px`}
                      opened={resizing?.key === col.key}
                      position="top"
                    >
                      <div
                        data-testid={`rc-handle-${col.key}`}
                        onMouseDown={e => handleMouseDown(col.key, e)}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: 10,
                          cursor: 'col-resize',
                          background:
                            resizing?.key === col.key ? 'rgba(34, 139, 230, 0.25)' : 'rgba(0,0,0,0.04)',
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
                  {columns.map(col => (
                    <Table.Td key={col.key} style={{ width: col.width, padding: '6px 10px' }}>
                      {row[col.key as keyof typeof row]}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </Stack>
  );
}
