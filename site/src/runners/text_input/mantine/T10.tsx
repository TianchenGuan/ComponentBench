'use client';

/**
 * text_input-mantine-T10: Edit tag in table (top-left placement)
 * 
 * Scene is a table_cell layout anchored near the top-left of the viewport (not centered) with high clutter
 * from a toolbar and table controls. A Mantine Table lists three projects: "Alpha", "Beta", and "Gamma". In
 * the "Tag" column, each row contains an always-visible Mantine TextInput (instances=3) pre-filled with a
 * short tag. A toolbar above the table includes buttons and filters (non-text) as distractors. No modal and
 * no save button are required; edits are 'live'.
 * 
 * Success: In the Projects table row labeled "Gamma", the TextInput in the "Tag" column has value "priority" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Table, TextInput, Button, Group, Text, Select } from '@mantine/core';
import { IconPlus, IconFilter } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface ProjectRow {
  id: string;
  name: string;
  tag: string;
  status: string;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<ProjectRow[]>([
    { id: 'alpha', name: 'Alpha', tag: 'urgent', status: 'Active' },
    { id: 'beta', name: 'Beta', tag: 'review', status: 'Pending' },
    { id: 'gamma', name: 'Gamma', tag: 'backlog', status: 'Active' },
  ]);

  useEffect(() => {
    const gammaRow = data.find(row => row.name === 'Gamma');
    if (gammaRow && gammaRow.tag.trim() === 'priority') {
      onSuccess();
    }
  }, [data, onSuccess]);

  const handleTagChange = (id: string, value: string) => {
    setData(prev => prev.map(row =>
      row.id === id ? { ...row, tag: value } : row
    ));
  };

  return (
    <div style={{ width: 600 }}>
      {/* Toolbar */}
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Projects</Text>
        <Group gap="sm">
          <Select
            placeholder="Filter by status"
            size="sm"
            data={['All', 'Active', 'Pending']}
            style={{ width: 140 }}
          />
          <Button leftSection={<IconFilter size={16} />} variant="outline" size="sm">
            Filter
          </Button>
          <Button leftSection={<IconPlus size={16} />} size="sm">
            Add project
          </Button>
        </Group>
      </Group>

      {/* Table */}
      <Table striped highlightOnHover withTableBorder withColumnBorders data-testid="projects-table">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Tag</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((row) => (
            <Table.Tr key={row.id} data-rowid={row.id}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>
                <TextInput
                  size="sm"
                  value={row.tag}
                  onChange={(e) => handleTagChange(row.id, e.target.value)}
                  data-testid={`tag-input-${row.id}`}
                  style={{ width: 120 }}
                />
              </Table.Td>
              <Table.Td>{row.status}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
