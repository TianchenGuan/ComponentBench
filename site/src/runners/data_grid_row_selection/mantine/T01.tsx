'use client';

/**
 * data_grid_row_selection-mantine-T01: Select a single employee row (composed table)
 *
 * The page is a centered isolated card titled "Employees". It contains a Mantine Table where the first
 * column is a Checkbox used to select each row (composed row-selection pattern).
 * Spacing is comfortable and scale is default. The table has 9 visible rows and columns: Employee ID,
 * Name, Department.
 * Initial state: no rows are selected. There is no pagination, no search, and no additional widgets (no
 * clutter).
 * Selecting a row immediately checks the checkbox and highlights the row background (local state update, no
 * Apply/OK).
 *
 * Success: selected_row_ids equals ['emp_E03']
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, Checkbox } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface EmployeeData {
  key: string;
  employeeId: string;
  name: string;
  department: string;
}

const employeesData: EmployeeData[] = [
  { key: 'emp_E01', employeeId: 'E-01', name: 'Alice Chen', department: 'Engineering' },
  { key: 'emp_E02', employeeId: 'E-02', name: 'Bob Martinez', department: 'Design' },
  { key: 'emp_E03', employeeId: 'E-03', name: 'Rita Singh', department: 'Product' },
  { key: 'emp_E04', employeeId: 'E-04', name: 'David Kim', department: 'Engineering' },
  { key: 'emp_E05', employeeId: 'E-05', name: 'Eva Schmidt', department: 'Marketing' },
  { key: 'emp_E06', employeeId: 'E-06', name: 'Frank Jones', department: 'Sales' },
  { key: 'emp_E07', employeeId: 'E-07', name: 'Grace Liu', department: 'Engineering' },
  { key: 'emp_E08', employeeId: 'E-08', name: 'Henry Wilson', department: 'Design' },
  { key: 'emp_E09', employeeId: 'E-09', name: 'Iris Chang', department: 'Product' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
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
    if (selectionEquals(Array.from(selectedKeys), ['emp_E03'])) {
      onSuccess();
    }
  }, [selectedKeys, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={500} size="md" mb="md">Employees</Text>
      <Table
        highlightOnHover
        data-testid="employees-table"
        data-selected-row-ids={JSON.stringify(Array.from(selectedKeys))}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }} />
            <Table.Th>Employee ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Department</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {employeesData.map((row) => (
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
                  aria-label={`Select ${row.name}`}
                />
              </Table.Td>
              <Table.Td>{row.employeeId}</Table.Td>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.department}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
