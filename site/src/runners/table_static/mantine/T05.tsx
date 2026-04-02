'use client';

/**
 * table_static-mantine-T05: Select from the correct table (Servers vs Databases)
 *
 * The page is a light dashboard layout with two Mantine Table instances in separate cards: "Servers" and
 * "Databases". Both tables list resource-like names and statuses, and both contain items starting with similar prefixes
 * (e.g., srv-prod-01, db-prod-01). Rows are single-select within each table. Initial state: a server row is selected in
 * the Servers table; Databases table has no selection. No additional dashboard widgets are present beyond the two table
 * cards.
 */

import React, { useState } from 'react';
import { Table, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface ResourceData {
  key: string;
  name: string;
  status: string;
  region: string;
}

const serversData: ResourceData[] = [
  { key: 'srv-prod-01', name: 'srv-prod-01', status: 'Running', region: 'US East' },
  { key: 'srv-prod-02', name: 'srv-prod-02', status: 'Running', region: 'US West' },
  { key: 'srv-staging-01', name: 'srv-staging-01', status: 'Running', region: 'US East' },
  { key: 'srv-dev-01', name: 'srv-dev-01', status: 'Stopped', region: 'US East' },
];

const databasesData: ResourceData[] = [
  { key: 'db-prod-01', name: 'db-prod-01', status: 'Active', region: 'US East' },
  { key: 'db-prod-02', name: 'db-prod-02', status: 'Active', region: 'US West' },
  { key: 'db-staging-01', name: 'db-staging-01', status: 'Active', region: 'US East' },
  { key: 'db-dev-01', name: 'db-dev-01', status: 'Inactive', region: 'US East' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [serverSelectedKey, setServerSelectedKey] = useState<string | null>('srv-prod-01');
  const [databaseSelectedKey, setDatabaseSelectedKey] = useState<string | null>(null);

  const handleServerRowClick = (record: ResourceData) => {
    setServerSelectedKey(record.key);
  };

  const handleDatabaseRowClick = (record: ResourceData) => {
    setDatabaseSelectedKey(record.key);
    if (record.key === 'db-prod-02') {
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }} data-cb-instance="Servers">
        <Text fw={500} size="md" mb="md">Servers</Text>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Region</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {serversData.map((row) => (
              <Table.Tr
                key={row.key}
                onClick={() => handleServerRowClick(row)}
                aria-selected={serverSelectedKey === row.key}
                data-row-key={row.key}
                style={{
                  cursor: 'pointer',
                  backgroundColor: serverSelectedKey === row.key ? 'var(--mantine-color-blue-light)' : undefined,
                }}
              >
                <Table.Td>{row.name}</Table.Td>
                <Table.Td>{row.status}</Table.Td>
                <Table.Td>{row.region}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }} data-cb-instance="Databases">
        <Text fw={500} size="md" mb="md">Databases</Text>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Region</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {databasesData.map((row) => (
              <Table.Tr
                key={row.key}
                onClick={() => handleDatabaseRowClick(row)}
                aria-selected={databaseSelectedKey === row.key}
                data-row-key={row.key}
                style={{
                  cursor: 'pointer',
                  backgroundColor: databaseSelectedKey === row.key ? 'var(--mantine-color-blue-light)' : undefined,
                }}
              >
                <Table.Td>{row.name}</Table.Td>
                <Table.Td>{row.status}</Table.Td>
                <Table.Td>{row.region}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}
