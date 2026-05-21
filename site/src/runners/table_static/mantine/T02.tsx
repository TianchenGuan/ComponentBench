'use client';

/**
 * table_static-mantine-T02: Clear the current highlight (Mantine)
 *
 * A centered isolated card contains a read-only Environments table (Mantine Table) listing environments
 * like "dev", "staging", and "prod". The "staging" row starts selected/highlighted. A small text button labeled "Clear"
 * appears in the card header next to the title "Environments"; clicking it clears selection in the table. No other interactive
 * UI exists; the table has ~6 rows and is not sortable.
 */

import React, { useState } from 'react';
import { Table, Card, Text, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface EnvironmentData {
  key: string;
  name: string;
  status: string;
  region: string;
}

const environmentsData: EnvironmentData[] = [
  { key: 'dev', name: 'dev', status: 'Active', region: 'US East' },
  { key: 'staging', name: 'staging', status: 'Active', region: 'US East' },
  { key: 'prod', name: 'prod', status: 'Active', region: 'US East + EU West' },
  { key: 'qa', name: 'qa', status: 'Active', region: 'US East' },
  { key: 'demo', name: 'demo', status: 'Inactive', region: 'US West' },
  { key: 'sandbox', name: 'sandbox', status: 'Active', region: 'US East' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>('staging');

  const handleClearSelection = () => {
    setSelectedRowKey(null);
    onSuccess();
  };

  const handleRowClick = (record: EnvironmentData) => {
    setSelectedRowKey(record.key);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Group justify="space-between" mb="md">
        <Text fw={500} size="md">Environments</Text>
        <Button 
          variant="subtle" 
          size="xs" 
          onClick={handleClearSelection}
          data-testid="cb-clear-selection"
        >
          Clear
        </Button>
      </Group>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Region</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {environmentsData.map((row) => (
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
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.status}</Table.Td>
              <Table.Td>{row.region}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
