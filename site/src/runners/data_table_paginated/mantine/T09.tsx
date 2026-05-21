'use client';

/**
 * data_table_paginated-mantine-T09: Invoices table: select the row matching a visual badge reference
 *
 * Layout: isolated card centered titled **Invoices**.
 *
 * Component: Mantine Table + Pagination composite with checkbox selection.
 *
 * Visual reference (guidance=visual): above the table header, there is a small **Reference badge**
 * area showing a single Flag badge (icon + color) with no text label. Each table row has a
 * Flag badge in the first data column.
 *
 * Dataset: 120 invoices with IDs INV-0001…INV-0120, 10 rows per page.
 * The matching badge appears on exactly one row: invoice **INV-0094**, located on page 10.
 *
 * Initial state: page 1; no selection.
 *
 * Success: The selected invoice row matches the visual reference badge (resolved to INV-0094).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Checkbox, Paper, ThemeIcon } from '@mantine/core';
import { IconFlag, IconStar, IconHeart, IconBolt, IconBell, IconBookmark } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { generateInvoiceData } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  flag: IconFlag,
  star: IconStar,
  heart: IconHeart,
  bolt: IconBolt,
  bell: IconBell,
  bookmark: IconBookmark,
};

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [invoices] = useState(() => generateInvoiceData(120));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  // Reference badge - matches INV-0094 (purple star)
  const referenceColor = 'purple';
  const referenceIcon = 'star';
  const ReferenceIcon = iconMap[referenceIcon];

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return invoices.slice(start, start + pageSize);
  }, [invoices, currentPage]);

  const totalPages = Math.ceil(invoices.length / pageSize);

  useEffect(() => {
    if (selectedRowId === 'INV-0094' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [selectedRowId, hasSucceeded, onSuccess]);

  const handleRowSelect = (rowId: string) => {
    setSelectedRowId(selectedRowId === rowId ? null : rowId);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }} data-testid="invoices-card">
      <Text fw={500} size="lg" mb="xs">Invoices</Text>
      
      {/* Reference badge area */}
      <Paper p="xs" mb="md" withBorder bg="gray.0" data-testid="reference-badge-area" data-reference-id="ref-flag-badge-1">
        <Group gap="xs">
          <Text size="sm" c="dimmed">Reference badge:</Text>
          <ThemeIcon color={referenceColor} variant="light" size="md">
            <ReferenceIcon size={16} />
          </ThemeIcon>
        </Group>
      </Paper>
      
      <Table striped highlightOnHover data-testid="invoices-table" data-selected-row={selectedRowId}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }}></Table.Th>
            <Table.Th>Flag</Table.Th>
            <Table.Th>Invoice ID</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Amount</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedData.map((invoice) => {
            const FlagIcon = iconMap[invoice.flagIcon] || IconFlag;
            return (
              <Table.Tr key={invoice.id} data-row-id={invoice.id}>
                <Table.Td>
                  <Checkbox
                    checked={selectedRowId === invoice.id}
                    onChange={() => handleRowSelect(invoice.id)}
                    aria-label={`Select ${invoice.invoiceId}`}
                  />
                </Table.Td>
                <Table.Td>
                  <ThemeIcon color={invoice.flagColor} variant="light" size="sm">
                    <FlagIcon size={14} />
                  </ThemeIcon>
                </Table.Td>
                <Table.Td>{invoice.invoiceId}</Table.Td>
                <Table.Td>{invoice.customer}</Table.Td>
                <Table.Td>${invoice.amount.toFixed(2)}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      <Group justify="center" mt="md">
        <Pagination
          total={totalPages}
          value={currentPage}
          onChange={setCurrentPage}
          data-testid="invoices-pagination"
        />
      </Group>
    </Card>
  );
}
