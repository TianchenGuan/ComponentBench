'use client';

/**
 * checkbox-mantine-T09: Select Project Orion row (table checkbox)
 *
 * Layout: table cell scene.
 * A card titled "Projects" contains a table with 4 rows. The first column is a checkbox used to select a project row.
 * Project names in the second column are: Project Apollo, Project Orion, Project Nova, Project Vega.
 * Initial state: all row-selection checkboxes are unchecked.
 * Task target: the checkbox for the row labeled "Project Orion".
 * No Save/Apply button exists; selecting a row updates immediately.
 * Clutter: additional numeric columns (e.g., "Owner", "Updated") are present but non-essential.
 */

import React, { useState } from 'react';
import { Card, Text, Table, Checkbox } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface ProjectRow {
  id: string;
  name: string;
  owner: string;
  updated: string;
  selected: boolean;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [projects, setProjects] = useState<ProjectRow[]>([
    { id: 'apollo', name: 'Project Apollo', owner: 'Alice', updated: '2024-01-15', selected: false },
    { id: 'orion', name: 'Project Orion', owner: 'Bob', updated: '2024-01-18', selected: false },
    { id: 'nova', name: 'Project Nova', owner: 'Charlie', updated: '2024-01-20', selected: false },
    { id: 'vega', name: 'Project Vega', owner: 'Diana', updated: '2024-01-22', selected: false },
  ]);

  const handleSelectionChange = (id: string, checked: boolean) => {
    setProjects(prev =>
      prev.map(proj => proj.id === id ? { ...proj, selected: checked } : proj)
    );

    // Success when Project Orion is selected
    if (id === 'orion' && checked) {
      onSuccess();
    }
  };

  const rows = projects.map((project) => (
    <Table.Tr key={project.id}>
      <Table.Td>
        <Checkbox
          checked={project.selected}
          onChange={(e) => handleSelectionChange(project.id, e.currentTarget.checked)}
          data-testid={`row-${project.id}-select-cb`}
        />
      </Table.Td>
      <Table.Td>{project.name}</Table.Td>
      <Table.Td>{project.owner}</Table.Td>
      <Table.Td>{project.updated}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={600} size="lg" mb="md">
        Projects
      </Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 50 }}>Select</Table.Th>
            <Table.Th>Project</Table.Th>
            <Table.Th>Owner</Table.Th>
            <Table.Th>Updated</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Card>
  );
}
