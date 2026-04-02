'use client';

/**
 * data_grid_row_selection-mantine-T04: Scroll to a far audit log row and select it
 *
 * The card is anchored at the bottom-right of the viewport. It is titled "Audit log".
 * Inside the card, the table is placed within a fixed-height ScrollArea; the Mantine Table header is sticky
 * so column labels remain visible while scrolling.
 * Row selection is composed: each row begins with a Checkbox cell.
 * Spacing is comfortable and scale is default. The table contains 50 entries (AL-000 to AL-049) but only
 * ~12 are visible at a time.
 * Initial state: no rows selected. There are no other controls.
 * The target AL-049 is at the bottom and requires scrolling inside the ScrollArea to reveal and select it.
 *
 * Success: selected_row_ids equals ['audit_AL049']
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, Checkbox, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface AuditData {
  key: string;
  entryId: string;
  action: string;
  timestamp: string;
}

// Generate 50 audit entries
const auditData: AuditData[] = Array.from({ length: 50 }, (_, i) => {
  const num = String(i).padStart(3, '0');
  return {
    key: `audit_AL${num}`,
    entryId: `AL-${num}`,
    action: `Action ${i + 1}`,
    timestamp: `2024-02-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
  };
});

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const toggleRow = (key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Check success condition
  useEffect(() => {
    if (selectionEquals(Array.from(selectedKeys), ['audit_AL049'])) {
      onSuccess();
    }
  }, [selectedKeys, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={500} size="md" mb="md">Audit log</Text>
      <ScrollArea h={350} data-testid="audit-scroll-area">
        <Table
          highlightOnHover
          stickyHeader
          data-testid="audit-table"
          data-selected-row-ids={JSON.stringify(Array.from(selectedKeys))}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }} />
              <Table.Th>Entry ID</Table.Th>
              <Table.Th>Action</Table.Th>
              <Table.Th>Timestamp</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {auditData.map((row) => (
              <Table.Tr
                key={row.key}
                bg={selectedKeys.has(row.key) ? 'var(--mantine-color-blue-light)' : undefined}
                data-row-id={row.key}
                data-selected={selectedKeys.has(row.key)}
              >
                <Table.Td>
                  <Checkbox
                    checked={selectedKeys.has(row.key)}
                    onChange={() => toggleRow(row.key)}
                    aria-label={`Select ${row.entryId}`}
                  />
                </Table.Td>
                <Table.Td>{row.entryId}</Table.Td>
                <Table.Td>{row.action}</Table.Td>
                <Table.Td>{row.timestamp}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
