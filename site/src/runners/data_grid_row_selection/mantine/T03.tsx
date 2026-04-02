'use client';

/**
 * data_grid_row_selection-mantine-T03: Clear all selected rows in a composed table
 *
 * A centered isolated card titled "Devices" contains a Mantine Table with row selection composed from a
 * Checkbox column.
 * Above the table header, a small action row shows "3 selected" and a subtle button labeled "Clear".
 * Spacing is comfortable and scale is default. The table has 10 visible rows with columns: Device ID,
 * Name, Owner.
 * Initial state: three devices are pre-selected (dev_D02, dev_D05, dev_D09). Clicking Clear resets the
 * internal selected IDs set to empty and unchecks all row checkboxes.
 * Feedback is immediate: the selected count changes to "0 selected".
 *
 * Success: selected_row_ids equals []
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, Checkbox, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface DeviceData {
  key: string;
  deviceId: string;
  name: string;
  owner: string;
}

const devicesData: DeviceData[] = [
  { key: 'dev_D01', deviceId: 'D-01', name: 'MacBook Pro', owner: 'Alice Chen' },
  { key: 'dev_D02', deviceId: 'D-02', name: 'iPhone 15', owner: 'Bob Martinez' },
  { key: 'dev_D03', deviceId: 'D-03', name: 'iPad Pro', owner: 'Carol Williams' },
  { key: 'dev_D04', deviceId: 'D-04', name: 'Dell XPS', owner: 'David Kim' },
  { key: 'dev_D05', deviceId: 'D-05', name: 'Samsung S24', owner: 'Eva Schmidt' },
  { key: 'dev_D06', deviceId: 'D-06', name: 'Surface Pro', owner: 'Frank Jones' },
  { key: 'dev_D07', deviceId: 'D-07', name: 'ThinkPad X1', owner: 'Grace Liu' },
  { key: 'dev_D08', deviceId: 'D-08', name: 'Pixel 8', owner: 'Henry Wilson' },
  { key: 'dev_D09', deviceId: 'D-09', name: 'iMac 24', owner: 'Iris Chang' },
  { key: 'dev_D10', deviceId: 'D-10', name: 'Mac Mini', owner: 'Jack Brown' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['dev_D02', 'dev_D05', 'dev_D09']));

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

  const handleClear = () => {
    setSelectedKeys(new Set());
  };

  // Check success condition
  useEffect(() => {
    if (selectionEquals(Array.from(selectedKeys), [])) {
      onSuccess();
    }
  }, [selectedKeys, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={500} size="md" mb="md">Devices</Text>
      <Group mb="md">
        <Text size="sm" c="dimmed">{selectedKeys.size} selected</Text>
        <Button variant="subtle" size="xs" onClick={handleClear} data-testid="clear-btn">
          Clear
        </Button>
      </Group>
      <Table
        highlightOnHover
        data-testid="devices-table"
        data-selected-row-ids={JSON.stringify(Array.from(selectedKeys))}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }} />
            <Table.Th>Device ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Owner</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {devicesData.map((row) => (
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
              <Table.Td>{row.deviceId}</Table.Td>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.owner}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
