'use client';

/**
 * table_static-mantine-T04: Scroll to find a session row
 *
 * An isolated card anchored near the bottom-left of the viewport contains a read-only Sessions table (Mantine
 * Table) inside a ScrollArea. Columns: Session, User, Started. There are ~100 rows; only ~10 are visible at a time without
 * scrolling within the ScrollArea. Rows are single-select with highlight feedback. The target row "Session 42" is not visible
 * initially and requires scrolling inside the table's ScrollArea (not the whole page). No sorting/pagination is available.
 */

import React, { useState } from 'react';
import { Table, Card, Text, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface SessionData {
  key: string;
  session: string;
  user: string;
  started: string;
}

// Generate 100 session rows
const generateSessionData = (): SessionData[] => {
  const users = ['alice@corp.com', 'bob@corp.com', 'carol@corp.com', 'david@corp.com', 'eva@corp.com'];
  
  return Array.from({ length: 100 }, (_, i) => ({
    key: `Session ${i + 1}`,
    session: `Session ${i + 1}`,
    user: users[i % users.length],
    started: `Dec ${String(20 - Math.floor(i / 10)).padStart(2, '0')}, ${String(8 + (i % 12)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
  }));
};

const sessionData = generateSessionData();

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleRowClick = (record: SessionData) => {
    setSelectedRowKey(record.key);
    if (record.key === 'Session 42') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={500} size="md" mb="md">Sessions</Text>
      <ScrollArea h={350}>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Session</Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Started</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sessionData.map((row) => (
              <Table.Tr
                key={row.key}
                onClick={() => handleRowClick(row)}
                aria-selected={selectedRowKey === row.key}
                data-row-key={row.key}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedRowKey === row.key ? 'var(--mantine-color-blue-light)' : undefined,
                }}
              >
                <Table.Td>{row.session}</Table.Td>
                <Table.Td>{row.user}</Table.Td>
                <Table.Td>{row.started}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
