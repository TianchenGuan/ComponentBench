'use client';

/**
 * data_grid_row_selection-mantine-T08: Select all except two using indeterminate header checkbox
 *
 * A centered isolated card titled "Accounts" contains a Mantine Table with a selection Checkbox in the
 * header (select-all) and one Checkbox per row.
 * The page is in compact spacing mode (tighter row height). The header checkbox supports an indeterminate
 * state when some but not all rows are selected.
 * The table shows 12 rows with columns: Account ID, Name, Type. Two special rows are SYS (System) and ADM
 * (Admin); the other 10 rows are regular accounts A-01 through A-10.
 * Initial state: no rows selected. There is no pagination and selection updates immediately.
 * The intended interaction is: select all, then deselect SYS and ADM (or equivalently, select only the 10
 * regular accounts).
 *
 * Success: selected_row_ids equals ['acct_A01', 'acct_A02', ..., 'acct_A10'] (all except SYS and ADM)
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, Checkbox } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface AccountData {
  key: string;
  accountId: string;
  name: string;
  type: string;
}

const accountsData: AccountData[] = [
  { key: 'acct_SYS', accountId: 'SYS', name: 'System', type: 'System' },
  { key: 'acct_ADM', accountId: 'ADM', name: 'Admin', type: 'System' },
  { key: 'acct_A01', accountId: 'A-01', name: 'Alice Chen', type: 'User' },
  { key: 'acct_A02', accountId: 'A-02', name: 'Bob Martinez', type: 'User' },
  { key: 'acct_A03', accountId: 'A-03', name: 'Carol Williams', type: 'User' },
  { key: 'acct_A04', accountId: 'A-04', name: 'David Kim', type: 'User' },
  { key: 'acct_A05', accountId: 'A-05', name: 'Eva Schmidt', type: 'User' },
  { key: 'acct_A06', accountId: 'A-06', name: 'Frank Jones', type: 'User' },
  { key: 'acct_A07', accountId: 'A-07', name: 'Grace Liu', type: 'User' },
  { key: 'acct_A08', accountId: 'A-08', name: 'Henry Wilson', type: 'User' },
  { key: 'acct_A09', accountId: 'A-09', name: 'Iris Chang', type: 'User' },
  { key: 'acct_A10', accountId: 'A-10', name: 'Jack Brown', type: 'User' },
];

const allKeys = accountsData.map(d => d.key);
const targetKeys = [
  'acct_A01', 'acct_A02', 'acct_A03', 'acct_A04', 'acct_A05',
  'acct_A06', 'acct_A07', 'acct_A08', 'acct_A09', 'acct_A10',
];

export default function T08({ onSuccess }: TaskComponentProps) {
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

  const toggleAll = () => {
    setSelectedKeys(prev => {
      if (prev.size === allKeys.length) {
        return new Set();
      } else {
        return new Set(allKeys);
      }
    });
  };

  const allSelected = selectedKeys.size === allKeys.length;
  const someSelected = selectedKeys.size > 0 && selectedKeys.size < allKeys.length;

  // Check success condition
  useEffect(() => {
    if (selectionEquals(Array.from(selectedKeys), targetKeys)) {
      onSuccess();
    }
  }, [selectedKeys, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={500} size="md" mb="md">Accounts</Text>
      <Table
        highlightOnHover
        data-testid="accounts-table"
        data-selected-row-ids={JSON.stringify(Array.from(selectedKeys))}
        styles={{ table: { fontSize: 13 }, tr: { height: 36 } }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }}>
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={toggleAll}
                aria-label="Select all"
              />
            </Table.Th>
            <Table.Th>Account ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Type</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {accountsData.map((row) => (
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
              <Table.Td>{row.accountId}</Table.Td>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.type}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
