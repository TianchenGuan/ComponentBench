'use client';

/**
 * data_grid_row_selection-mantine-T09: Small-scale search then select in a long table
 *
 * The page is an isolated card centered in the viewport titled "Directory" rendered at a small scale
 * (smaller fonts and tighter controls).
 * Above the Mantine Table is a TextInput labeled "Search employees…" that filters the table rows as you
 * type (client-side filter).
 * The table uses a composed checkbox selection column. It contains 40 employee rows with columns: Employee
 * ID, Name, Location.
 * Initial state: no rows selected and the search input is empty.
 * There are confusable names such as "Mila Torres" and "Mila Torres-Gray"; the target is uniquely
 * identified by Employee ID EMP-22.
 *
 * Success: selected_row_ids equals ['emp_EMP22']
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Card, Text, Checkbox, TextInput, ScrollArea } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface EmployeeData {
  key: string;
  employeeId: string;
  name: string;
  location: string;
}

const names = [
  'Alice Chen', 'Bob Martinez', 'Carol Williams', 'David Kim', 'Eva Schmidt',
  'Frank Jones', 'Grace Liu', 'Henry Wilson', 'Iris Chang', 'Jack Brown',
  'Karen Lee', 'Leo Garcia', 'Mia Taylor', 'Noah Davis', 'Olivia Moore',
  'Peter Zhang', 'Quinn Adams', 'Rachel Green', 'Sam Wilson', 'Tina Baker',
];
const locations = ['New York', 'San Francisco', 'Chicago', 'Austin', 'Seattle', 'Boston', 'Denver', 'Miami'];

// Generate 40 employees
const employeesData: EmployeeData[] = Array.from({ length: 40 }, (_, i) => {
  const num = i + 1;
  // EMP-22 is Mila Torres (target), EMP-23 is Mila Torres-Gray (distractor)
  let name: string;
  if (num === 22) {
    name = 'Mila Torres';
  } else if (num === 23) {
    name = 'Mila Torres-Gray';
  } else {
    name = names[i % names.length];
  }
  return {
    key: `emp_EMP${num}`,
    employeeId: `EMP-${num}`,
    name,
    location: locations[i % locations.length],
  };
});

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

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

  const filteredData = useMemo(() => {
    if (!search) return employeesData;
    const s = search.toLowerCase();
    return employeesData.filter(
      d => d.employeeId.toLowerCase().includes(s) || d.name.toLowerCase().includes(s)
    );
  }, [search]);

  // Check success condition
  useEffect(() => {
    if (selectionEquals(Array.from(selectedKeys), ['emp_EMP22'])) {
      onSuccess();
    }
  }, [selectedKeys, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={500} size="sm" mb="sm">Directory</Text>
      <TextInput
        placeholder="Search employees…"
        leftSection={<IconSearch size={14} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb="sm"
        size="xs"
        data-testid="search-input"
      />
      <ScrollArea h={350}>
        <Table
          highlightOnHover
          data-testid="directory-table"
          data-selected-row-ids={JSON.stringify(Array.from(selectedKeys))}
          styles={{ table: { fontSize: 12 }, tr: { height: 32 } }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 32 }} />
              <Table.Th>Employee ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Location</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredData.map((row) => (
              <Table.Tr
                key={row.key}
                bg={selectedKeys.has(row.key) ? 'var(--mantine-color-blue-light)' : undefined}
                data-row-id={row.key}
                data-selected={selectedKeys.has(row.key)}
              >
                <Table.Td>
                  <Checkbox
                    size="xs"
                    checked={selectedKeys.has(row.key)}
                    onChange={() => toggleRow(row.key)}
                    aria-label={`Select ${row.name}`}
                  />
                </Table.Td>
                <Table.Td>{row.employeeId}</Table.Td>
                <Table.Td>{row.name}</Table.Td>
                <Table.Td>{row.location}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
