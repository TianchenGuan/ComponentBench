'use client';

/**
 * data_table_paginated-mantine-T10: Dashboard: select a row in the West Region table (3 instances)
 *
 * Layout: **dashboard** centered in the viewport.
 *
 * Scene contains THREE similar paginated tables (instances=3), each a Mantine Table + Pagination composite:
 * • **North Region**
 * • **South Region**
 * • **West Region**
 *
 * Each table shows sales records with columns: Record ID, Rep, Amount, and Date,
 * and each has a leading checkbox selection column.
 *
 * Dataset: each region has 120 records (12 pages at 10 rows per page).
 * In the **West Region** table, Record ID **SALE-0423** appears on page 3.
 *
 * Initial state: all three tables start on page 1 with no selected rows.
 *
 * Task target: only the selection state of the **West Region** table matters.
 *
 * Success: In the West Region table, exactly one selected row exists: SALE-0423.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Checkbox, Paper, Badge, Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { generateSalesData } from '../types';

interface RegionTableProps {
  title: string;
  data: { id: string; recordId: string; rep: string; amount: number; date: string }[];
  testId: string;
  selectedRowId: string | null;
  onSelectRow: (id: string | null) => void;
}

function RegionTable({ title, data, testId, selectedRowId, onSelectRow }: RegionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handleRowSelect = (rowId: string) => {
    onSelectRow(selectedRowId === rowId ? null : rowId);
  };

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ flex: 1, minWidth: 300 }} data-testid={testId}>
      <Text fw={500} size="md" mb="xs">{title}</Text>
      
      <Table striped highlightOnHover data-current-page={currentPage} data-selected-row={selectedRowId}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 30 }}></Table.Th>
            <Table.Th>Record ID</Table.Th>
            <Table.Th>Rep</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedData.map((record) => (
            <Table.Tr key={record.id} data-row-id={record.id}>
              <Table.Td>
                <Checkbox
                  size="xs"
                  checked={selectedRowId === record.id}
                  onChange={() => handleRowSelect(record.id)}
                  aria-label={`Select ${record.recordId}`}
                />
              </Table.Td>
              <Table.Td>{record.recordId}</Table.Td>
              <Table.Td>{record.rep}</Table.Td>
              <Table.Td>${record.amount.toFixed(2)}</Table.Td>
              <Table.Td>{record.date}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="center" mt="xs">
        <Pagination
          total={totalPages}
          value={currentPage}
          onChange={setCurrentPage}
          size="xs"
        />
      </Group>
    </Card>
  );
}

export default function T10({ task, onSuccess }: TaskComponentProps) {
  // Generate separate data for each region
  const [northData] = useState(() => generateSalesData(120).map(s => ({ ...s, id: `N-${s.id}`, recordId: s.recordId.replace('SALE', 'SALE-N') })));
  const [southData] = useState(() => generateSalesData(120).map(s => ({ ...s, id: `S-${s.id}`, recordId: s.recordId.replace('SALE', 'SALE-S') })));
  const [westData] = useState(() => {
    // SALE-0423 should be on page 3 (rows 21-30), so at index 22
    const data = generateSalesData(120);
    // Ensure SALE-0423 exists at position that puts it on page 3 with page size 10
    // Page 3 = indices 20-29, so SALE-0423 at index 22
    if (data[22]) {
      data[22].id = 'SALE-0423';
      data[22].recordId = 'SALE-0423';
    }
    return data;
  });
  
  // Selection state for each region (only West matters for success)
  const [northSelected, setNorthSelected] = useState<string | null>(null);
  const [southSelected, setSouthSelected] = useState<string | null>(null);
  const [westSelected, setWestSelected] = useState<string | null>(null);
  
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    // Success when West Region has SALE-0423 selected
    if (westSelected === 'SALE-0423' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [westSelected, hasSucceeded, onSuccess]);

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* KPI strip and action (distractors) */}
      <Group mb="md" gap="md">
        <Paper p="xs" withBorder>
          <Text size="xs" c="dimmed">Total Sales</Text>
          <Text fw={600}>$284,521</Text>
        </Paper>
        <Paper p="xs" withBorder>
          <Text size="xs" c="dimmed">Transactions</Text>
          <Text fw={600}>360</Text>
        </Paper>
        <Button variant="light" size="xs" leftSection={<IconDownload size={14} />}>
          Download CSV
        </Button>
      </Group>

      {/* Three region tables */}
      <Group align="flex-start" gap="md">
        <RegionTable
          title="North Region"
          data={northData}
          testId="table-north-region"
          selectedRowId={northSelected}
          onSelectRow={setNorthSelected}
        />
        <RegionTable
          title="South Region"
          data={southData}
          testId="table-south-region"
          selectedRowId={southSelected}
          onSelectRow={setSouthSelected}
        />
        <RegionTable
          title="West Region"
          data={westData}
          testId="table-west-region"
          selectedRowId={westSelected}
          onSelectRow={setWestSelected}
        />
      </Group>
    </div>
  );
}
