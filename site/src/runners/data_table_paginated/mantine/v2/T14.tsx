'use client';

/**
 * data_table_paginated-mantine-v2-T14: Vendors row — nested Invoices subtable pagination
 *
 * Table-cell layout: two expanded vendor rows "Northern Supply" and "Western Trade".
 * Each contains an "Invoices" subtable (Mantine Table + Pagination + records-per-page).
 * Initial: both subtables page 1, size 10.
 * Target: Northern Supply → Invoices size 25, page 2.
 * Western Trade must remain page 1, size 10.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Select, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

interface InvoiceRecord { id: string; invoiceId: string; amount: number; date: string; status: string; }

function generateInvoices(count: number, prefix: string): InvoiceRecord[] {
  const statuses = ['Paid', 'Pending', 'Overdue'];
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(2024, 0, 1);
    d.setDate(d.getDate() + i * 3);
    return {
      id: `${prefix}-${String(i + 1).padStart(4, '0')}`,
      invoiceId: `${prefix}-${String(i + 1).padStart(4, '0')}`,
      amount: Math.round((100 + Math.random() * 900) * 100) / 100,
      date: d.toISOString().split('T')[0],
      status: statuses[i % statuses.length],
    };
  });
}

function InvoiceSubtable({ invoices, page, setPage, pageSize, setPageSize, testId }: {
  invoices: InvoiceRecord[]; page: number; setPage: (p: number) => void;
  pageSize: number; setPageSize: (s: number) => void; testId: string;
}) {
  const data = useMemo(() => {
    const s = (page - 1) * pageSize;
    return invoices.slice(s, s + pageSize);
  }, [invoices, page, pageSize]);
  const total = Math.ceil(invoices.length / pageSize);

  return (
    <div data-testid={testId} data-current-page={page} data-page-size={pageSize}>
      <Group justify="flex-end" mb="xs">
        <Select value={String(pageSize)} onChange={(v) => { if (v) { setPageSize(+v); setPage(1); } }}
          data={['10', '25', '50']} size="xs" w={70} />
      </Group>
      <Table striped highlightOnHover>
        <Table.Thead><Table.Tr>
          <Table.Th>Invoice</Table.Th><Table.Th>Amount</Table.Th><Table.Th>Date</Table.Th><Table.Th>Status</Table.Th>
        </Table.Tr></Table.Thead>
        <Table.Tbody>{data.map((inv) => (
          <Table.Tr key={inv.id}>
            <Table.Td>{inv.invoiceId}</Table.Td>
            <Table.Td>${inv.amount.toFixed(2)}</Table.Td>
            <Table.Td>{inv.date}</Table.Td>
            <Table.Td><Badge variant="light" size="sm"
              color={inv.status === 'Paid' ? 'green' : inv.status === 'Overdue' ? 'red' : 'yellow'}>
              {inv.status}</Badge></Table.Td>
          </Table.Tr>
        ))}</Table.Tbody>
      </Table>
      <Group justify="center" mt="xs">
        <Pagination total={total} value={page} onChange={setPage} size="sm" />
      </Group>
    </div>
  );
}

export default function T14({ onSuccess }: TaskComponentProps) {
  const [northernInvoices] = useState(() => generateInvoices(80, 'NINV'));
  const [westernInvoices] = useState(() => generateInvoices(60, 'WINV'));

  const [nPage, setNPage] = useState(1);
  const [nSize, setNSize] = useState(10);
  const [wPage, setWPage] = useState(1);
  const [wSize, setWSize] = useState(10);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (nSize === 25 && nPage === 2 && wSize === 10 && wPage === 1) {
      successFired.current = true;
      onSuccess();
    }
  }, [nSize, nPage, wSize, wPage, onSuccess]);

  return (
    <div style={{ padding: 16, maxWidth: 800 }}>
      <Text fw={600} size="lg" mb="md">Vendors</Text>
      <Table withTableBorder withColumnBorders>
        <Table.Thead><Table.Tr>
          <Table.Th>Vendor</Table.Th><Table.Th>Region</Table.Th><Table.Th>Status</Table.Th>
        </Table.Tr></Table.Thead>
        <Table.Tbody>
          <Table.Tr><Table.Td>Northern Supply</Table.Td><Table.Td>North</Table.Td>
            <Table.Td><Badge color="green">Active</Badge></Table.Td></Table.Tr>
          <Table.Tr>
            <Table.Td colSpan={3} style={{ padding: 16, background: 'var(--mantine-color-gray-0, #f8f9fa)' }}>
              <Text fw={500} size="sm" mb="xs">Invoices</Text>
              <InvoiceSubtable invoices={northernInvoices} page={nPage} setPage={setNPage}
                pageSize={nSize} setPageSize={setNSize} testId="northern-invoices" />
            </Table.Td>
          </Table.Tr>

          <Table.Tr><Table.Td>Western Trade</Table.Td><Table.Td>West</Table.Td>
            <Table.Td><Badge color="blue">Active</Badge></Table.Td></Table.Tr>
          <Table.Tr>
            <Table.Td colSpan={3} style={{ padding: 16, background: 'var(--mantine-color-gray-0, #f8f9fa)' }}>
              <Text fw={500} size="sm" mb="xs">Invoices</Text>
              <InvoiceSubtable invoices={westernInvoices} page={wPage} setPage={setWPage}
                pageSize={wSize} setPageSize={setWSize} testId="western-invoices" />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  );
}
