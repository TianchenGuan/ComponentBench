'use client';

/**
 * checkbox_tristate-mantine-T09: Table header: set Archived filter to Partial
 *
 * Layout: table_cell context in the top-right of the viewport.
 * A compact data table ("Projects") is visible with a sticky header row.
 * In the header cell for the "Archived" column there is a small Mantine tri-state checkbox
 * labeled "Archived filter" (label appears as a tooltip on hover and as an aria-label for accessibility).
 * The checkbox is rendered in a small size and the table uses compact spacing.
 *
 * Initial state: Unchecked.
 * Clutter: medium. The table header also includes sort icons, a search field above the table,
 * and other column filter chips.
 * 
 * Success: checkbox is Indeterminate.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Text, Table, TextInput, Badge, Group, Tooltip } from '@mantine/core';
import { IconSearch, IconArrowsSort } from '@tabler/icons-react';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('unchecked');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'indeterminate') {
      onSuccess();
    }
  };

  const rows = [
    { name: 'Project Alpha', status: 'Active', archived: false },
    { name: 'Project Beta', status: 'Pending', archived: true },
    { name: 'Project Gamma', status: 'Active', archived: false },
  ];

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 500 }}>
      {/* Search and filter chips */}
      <Group justify="space-between" mb="sm">
        <TextInput
          placeholder="Search projects..."
          leftSection={<IconSearch size={14} />}
          size="xs"
          style={{ width: 180 }}
        />
        <Group gap="xs">
          <Badge size="sm" variant="light">Status: All</Badge>
          <Badge size="sm" variant="light">Type: All</Badge>
        </Group>
      </Group>

      {/* Data table */}
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Group gap={4}>
                Name
                <IconArrowsSort size={12} style={{ opacity: 0.5 }} />
              </Group>
            </Table.Th>
            <Table.Th>
              <Group gap={4}>
                Status
                <IconArrowsSort size={12} style={{ opacity: 0.5 }} />
              </Group>
            </Table.Th>
            <Table.Th>
              <Tooltip label="Archived filter">
                <div onClick={handleClick} style={{ cursor: 'pointer', display: 'inline-block' }}>
                  <Checkbox
                    checked={state === 'checked'}
                    indeterminate={state === 'indeterminate'}
                    size="xs"
                    aria-label="Archived filter"
                    data-testid="archived-filter-checkbox"
                    readOnly
                  />
                </div>
              </Tooltip>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row, index) => (
            <Table.Tr key={index}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.status}</Table.Td>
              <Table.Td>{row.archived ? 'Yes' : 'No'}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
