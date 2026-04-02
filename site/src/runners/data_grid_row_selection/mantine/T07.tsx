'use client';

/**
 * data_grid_row_selection-mantine-T07: Select rows in the correct table instance (timesheet)
 *
 * The page is a form_section titled "Weekly timesheet". It contains two stacked sections, each with a
 * Mantine Table and checkbox-based row selection (composed):
 *   • "Billable hours" table
 *   • "Non-billable hours" table
 * Both tables use the same layout and similar entry IDs (B-04 vs NB-04), increasing the chance of selecting
 * the wrong instance.
 * Spacing is comfortable and scale is default. Light clutter includes two read-only summary fields above
 * (Total hours, Week).
 * Initial state: no rows selected in either table; selection is immediate (no Apply).
 * The target entries NB-04 and NB-07 exist only in the Non-billable hours table.
 *
 * Success: Non-billable selected_row_ids equals ['nb_NB04', 'nb_NB07'], Billable has []
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, Checkbox, TextInput, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface TimeEntryData {
  key: string;
  entryId: string;
  description: string;
  hours: number;
}

const billableData: TimeEntryData[] = [
  { key: 'bill_B01', entryId: 'B-01', description: 'Client meeting', hours: 2.0 },
  { key: 'bill_B02', entryId: 'B-02', description: 'Feature development', hours: 6.5 },
  { key: 'bill_B03', entryId: 'B-03', description: 'Code review', hours: 1.5 },
  { key: 'bill_B04', entryId: 'B-04', description: 'Bug fixes', hours: 3.0 },
  { key: 'bill_B05', entryId: 'B-05', description: 'Documentation', hours: 1.0 },
  { key: 'bill_B06', entryId: 'B-06', description: 'Testing', hours: 2.5 },
  { key: 'bill_B07', entryId: 'B-07', description: 'Deployment', hours: 1.0 },
];

const nonBillableData: TimeEntryData[] = [
  { key: 'nb_NB01', entryId: 'NB-01', description: 'Team standup', hours: 0.5 },
  { key: 'nb_NB02', entryId: 'NB-02', description: 'Training', hours: 2.0 },
  { key: 'nb_NB03', entryId: 'NB-03', description: '1:1 meeting', hours: 0.5 },
  { key: 'nb_NB04', entryId: 'NB-04', description: 'Internal tools', hours: 1.5 },
  { key: 'nb_NB05', entryId: 'NB-05', description: 'Tech planning', hours: 1.0 },
  { key: 'nb_NB06', entryId: 'NB-06', description: 'Code refactor', hours: 2.0 },
  { key: 'nb_NB07', entryId: 'NB-07', description: 'Admin tasks', hours: 0.5 },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [billableSelected, setBillableSelected] = useState<Set<string>>(new Set());
  const [nonBillableSelected, setNonBillableSelected] = useState<Set<string>>(new Set());

  const toggleBillable = (key: string) => {
    setBillableSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleNonBillable = (key: string) => {
    setNonBillableSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Check success condition
  useEffect(() => {
    if (
      selectionEquals(Array.from(nonBillableSelected), ['nb_NB04', 'nb_NB07']) &&
      selectionEquals(Array.from(billableSelected), [])
    ) {
      onSuccess();
    }
  }, [billableSelected, nonBillableSelected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={500} size="lg" mb="md">Weekly timesheet</Text>
      
      {/* Summary fields (light clutter) */}
      <Group mb="lg">
        <TextInput label="Week" value="Feb 5-9, 2024" readOnly size="sm" style={{ width: 150 }} />
        <TextInput label="Total hours" value="25.5" readOnly size="sm" style={{ width: 100 }} />
      </Group>

      <Stack gap="lg">
        {/* Billable hours table */}
        <div data-testid="billable-grid">
          <Text fw={500} size="sm" mb="sm">Billable hours</Text>
          <Table
            highlightOnHover
            data-testid="billable-table"
            data-selected-row-ids={JSON.stringify(Array.from(billableSelected))}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 40 }} />
                <Table.Th>Entry ID</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Hours</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {billableData.map((row) => (
                <Table.Tr
                  key={row.key}
                  bg={billableSelected.has(row.key) ? 'var(--mantine-color-blue-light)' : undefined}
                  data-row-id={row.key}
                  data-selected={billableSelected.has(row.key)}
                >
                  <Table.Td>
                    <Checkbox
                      checked={billableSelected.has(row.key)}
                      onChange={() => toggleBillable(row.key)}
                      aria-label={`Select ${row.entryId}`}
                    />
                  </Table.Td>
                  <Table.Td>{row.entryId}</Table.Td>
                  <Table.Td>{row.description}</Table.Td>
                  <Table.Td>{row.hours}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        {/* Non-billable hours table */}
        <div data-testid="nonbillable-grid">
          <Text fw={500} size="sm" mb="sm">Non-billable hours</Text>
          <Table
            highlightOnHover
            data-testid="nonbillable-table"
            data-selected-row-ids={JSON.stringify(Array.from(nonBillableSelected))}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 40 }} />
                <Table.Th>Entry ID</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Hours</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {nonBillableData.map((row) => (
                <Table.Tr
                  key={row.key}
                  bg={nonBillableSelected.has(row.key) ? 'var(--mantine-color-blue-light)' : undefined}
                  data-row-id={row.key}
                  data-selected={nonBillableSelected.has(row.key)}
                >
                  <Table.Td>
                    <Checkbox
                      checked={nonBillableSelected.has(row.key)}
                      onChange={() => toggleNonBillable(row.key)}
                      aria-label={`Select ${row.entryId}`}
                    />
                  </Table.Td>
                  <Table.Td>{row.entryId}</Table.Td>
                  <Table.Td>{row.description}</Table.Td>
                  <Table.Td>{row.hours}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </Stack>
    </Card>
  );
}
