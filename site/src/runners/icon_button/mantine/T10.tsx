'use client';

/**
 * icon_button-mantine-T10: Archive Report — Q4 (table row ActionIcon)
 *
 * Layout: table_cell centered in the viewport.
 * A table titled "Reports" contains four rows. Each row has an archive ActionIcon.
 * 
 * Success: The archive ActionIcon in the row "Report — Q4" has aria-pressed="true".
 */

import React, { useState } from 'react';
import { Card, Text, ActionIcon, Table, Badge, Group } from '@mantine/core';
import { IconArchive, IconArchiveFilled } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

interface ReportRow {
  id: string;
  name: string;
  lastUpdated: string;
  owner: string;
}

const reports: ReportRow[] = [
  { id: 'q3', name: 'Report — Q3', lastUpdated: '2024-01-10', owner: 'Alice' },
  { id: 'q4', name: 'Report — Q4', lastUpdated: '2024-01-15', owner: 'Bob' },
  { id: 'q5', name: 'Report — Q5', lastUpdated: '2024-01-18', owner: 'Charlie' },
  { id: 'q6', name: 'Report — Q6', lastUpdated: '2024-01-20', owner: 'Diana' },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [archived, setArchived] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setArchived(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (id === 'q4') {
          onSuccess();
        }
      }
      return next;
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={500} size="lg" mb="md">
        Reports
      </Text>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Report</Table.Th>
            <Table.Th>Last Updated</Table.Th>
            <Table.Th>Owner</Table.Th>
            <Table.Th style={{ textAlign: 'right' }}>Archive</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {reports.map((report) => {
            const isArchived = archived.has(report.id);
            return (
              <Table.Tr key={report.id}>
                <Table.Td>
                  <Group gap="xs">
                    {report.name}
                    {isArchived && (
                      <Badge size="xs" color="blue">Archived</Badge>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">{report.lastUpdated}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">{report.owner}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <ActionIcon
                    variant={isArchived ? 'filled' : 'subtle'}
                    color={isArchived ? 'blue' : undefined}
                    onClick={() => handleToggle(report.id)}
                    aria-label={`Archive ${report.name}`}
                    aria-pressed={isArchived}
                    data-testid={`mantine-action-icon-archive-${report.id}`}
                  >
                    {isArchived ? <IconArchiveFilled size={18} /> : <IconArchive size={18} />}
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
