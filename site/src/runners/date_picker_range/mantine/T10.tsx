'use client';

/**
 * date_picker_range-mantine-T10: Set a table-cell renewal window across years
 *
 * A table_cell layout with dark theme: a dense contracts table
 * fills most of the viewport. Each of three rows has a Mantine DatePickerInput configured
 * as a range picker (instances=3) in the 'Renewal window' column. The rows are
 * labeled 'Acme Corp' (target), 'Beta LLC', and 'Cyan Inc'. Because the picker
 * is inside a scrollable table container, it uses dropdownType='modal' so the
 * calendar opens in a full modal overlay. The target cell ('Acme Corp' → 'Renewal
 * window') starts empty. The table also contains other interactive elements (checkboxes,
 * a search box, pagination), making clutter high.
 *
 * Success: Acme Corp / Renewal window has start=2026-12-29, end=2027-01-03
 */

import React, { useState, useEffect } from 'react';
import { Table, Checkbox, TextInput, Pagination, Box, Group, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconSearch } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [acmeValue, setAcmeValue] = useState<[Date | null, Date | null]>([null, null]);
  const [betaValue, setBetaValue] = useState<[Date | null, Date | null]>([
    new Date(2026, 5, 1),
    new Date(2026, 5, 30),
  ]);
  const [cyanValue, setCyanValue] = useState<[Date | null, Date | null]>([
    new Date(2026, 8, 15),
    new Date(2026, 9, 15),
  ]);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (
      acmeValue[0] &&
      acmeValue[1] &&
      dayjs(acmeValue[0]).format('YYYY-MM-DD') === '2026-12-29' &&
      dayjs(acmeValue[1]).format('YYYY-MM-DD') === '2027-01-03'
    ) {
      onSuccess();
    }
  }, [acmeValue, onSuccess]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const rows = [
    { id: 'acme', name: 'Acme Corp', value: acmeValue, setValue: setAcmeValue, status: 'Active' },
    { id: 'beta', name: 'Beta LLC', value: betaValue, setValue: setBetaValue, status: 'Pending' },
    { id: 'cyan', name: 'Cyan Inc', value: cyanValue, setValue: setCyanValue, status: 'Active' },
  ];

  return (
    <Box p="md">
      <Text fw={600} size="lg" mb="md">Contracts table — Renewal window</Text>
      
      {/* Search */}
      <Group mb="md">
        <TextInput
          placeholder="Search contracts..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ flex: 1, maxWidth: 300 }}
          data-testid="search-contracts"
        />
      </Group>

      {/* Table */}
      <Box style={{ overflowX: 'auto' }}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }}>
                <Checkbox
                  checked={selectedRows.length === rows.length}
                  indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                  onChange={() => {
                    if (selectedRows.length === rows.length) {
                      setSelectedRows([]);
                    } else {
                      setSelectedRows(rows.map((r) => r.id));
                    }
                  }}
                  data-testid="select-all-checkbox"
                />
              </Table.Th>
              <Table.Th>Company</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th style={{ minWidth: 280 }}>Renewal window</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onChange={() => toggleRow(row.id)}
                    data-testid={`checkbox-${row.id}`}
                  />
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>{row.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c={row.status === 'Active' ? 'green' : 'orange'}>
                    {row.status}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <DatePickerInput
                    type="range"
                    value={row.value}
                    onChange={row.setValue}
                    valueFormat="YYYY-MM-DD"
                    placeholder="Select range"
                    size="sm"
                    dropdownType="modal"
                    defaultDate={new Date(2026, 11, 1)} // December 2026
                    data-testid={`row-${row.id}-renewal-range`}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <Group justify="flex-end" mt="md">
        <Pagination
          total={3}
          value={page}
          onChange={setPage}
          size="sm"
          data-testid="pagination"
        />
      </Group>
    </Box>
  );
}
