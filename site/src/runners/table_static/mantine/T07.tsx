'use client';

/**
 * table_static-mantine-T07: Dark theme visual match in a dense table
 *
 * A centered isolated card shows a read-only Incidents table rendered with Mantine Table under a dark
 * theme. Columns: Incident, Service, Severity. Severity is shown as a colored badge (e.g., Critical red, High orange, Medium
 * yellow). Above the table, a reference badge is shown (visual cue only) indicating the severity to match. The table contains
 * many similar incident IDs (INC-2xx) and several rows share the same severity badge, but only one row also has a unique
 * Service label that differentiates it (making visual scanning necessary). Clicking a row selects/highlights it; initial
 * state: none selected.
 */

import React, { useState } from 'react';
import { Table, Card, Text, Badge, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface IncidentData {
  key: string;
  incident: string;
  service: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

const incidentsData: IncidentData[] = [
  { key: 'INC-231', incident: 'INC-231', service: 'api-gateway', severity: 'Critical' },
  { key: 'INC-232', incident: 'INC-232', service: 'auth-service', severity: 'Medium' },
  { key: 'INC-233', incident: 'INC-233', service: 'payment-api', severity: 'High' },
  { key: 'INC-234', incident: 'INC-234', service: 'search-service', severity: 'High' },
  { key: 'INC-235', incident: 'INC-235', service: 'notification-api', severity: 'Low' },
  { key: 'INC-236', incident: 'INC-236', service: 'user-service', severity: 'High' },
  { key: 'INC-237', incident: 'INC-237', service: 'data-pipeline', severity: 'High' }, // Target: High + data-pipeline
  { key: 'INC-238', incident: 'INC-238', service: 'cache-service', severity: 'Medium' },
  { key: 'INC-239', incident: 'INC-239', service: 'api-gateway', severity: 'High' },
  { key: 'INC-240', incident: 'INC-240', service: 'auth-service', severity: 'Critical' },
];

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'Critical': return 'red';
    case 'High': return 'orange';
    case 'Medium': return 'yellow';
    case 'Low': return 'green';
    default: return 'gray';
  }
};

// Reference severity badge is "High" - matches INC-237 (with data-pipeline service as unique identifier)
const referenceSeverity = 'High';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleRowClick = (record: IncidentData) => {
    setSelectedRowKey(record.key);
    if (record.key === 'INC-237') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      {/* Reference badge */}
      <Box
        mb="md"
        p="sm"
        style={{
          backgroundColor: 'var(--mantine-color-dark-6)',
          borderRadius: 6,
          border: '1px dashed var(--mantine-color-dark-4)',
        }}
        data-reference-id="ref-sev-badge"
      >
        <Text size="xs" c="dimmed" mb="xs">Reference: Match this severity + service "data-pipeline"</Text>
        <Badge color={getSeverityColor(referenceSeverity)} variant="filled">{referenceSeverity}</Badge>
      </Box>

      <Text fw={500} size="md" mb="md">Incidents</Text>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Incident</Table.Th>
            <Table.Th>Service</Table.Th>
            <Table.Th>Severity</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {incidentsData.map((row) => (
            <Table.Tr
              key={row.key}
              onClick={() => handleRowClick(row)}
              aria-selected={selectedRowKey === row.key}
              data-row-key={row.key}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedRowKey === row.key ? 'var(--mantine-color-blue-9)' : undefined,
              }}
            >
              <Table.Td>{row.incident}</Table.Td>
              <Table.Td>{row.service}</Table.Td>
              <Table.Td>
                <Badge color={getSeverityColor(row.severity)} variant="filled">{row.severity}</Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
