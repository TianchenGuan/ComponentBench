'use client';

/**
 * data_table_sortable-mantine-T24: Billing - sort Invoices by Due date earliest→latest (two tables)
 *
 * Billing page form section with two Mantine composite sortable tables.
 * - "Invoices" (target) and "Payments" (distractor).
 * - Both tables have date columns, increasing disambiguation.
 * - Initial state: both tables unsorted.
 *
 * Success: Invoices Due date sorted ascending; Payments unchanged.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, UnstyledButton, Group, Center, Badge, Stack } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../types';

interface InvoiceData {
  id: string;
  invoiceNum: string;
  amount: number;
  dueDate: string;
  status: string;
}

interface PaymentData {
  id: string;
  paymentNum: string;
  amount: number;
  date: string;
  method: string;
}

const invoicesData: InvoiceData[] = [
  { id: '1', invoiceNum: 'INV-2001', amount: 1250.00, dueDate: '2024-02-28', status: 'Pending' },
  { id: '2', invoiceNum: 'INV-2002', amount: 890.50, dueDate: '2024-02-15', status: 'Overdue' },
  { id: '3', invoiceNum: 'INV-2003', amount: 2340.00, dueDate: '2024-03-05', status: 'Pending' },
  { id: '4', invoiceNum: 'INV-2004', amount: 567.25, dueDate: '2024-02-20', status: 'Paid' },
  { id: '5', invoiceNum: 'INV-2005', amount: 1780.00, dueDate: '2024-03-10', status: 'Pending' },
];

const paymentsData: PaymentData[] = [
  { id: '1', paymentNum: 'PAY-3001', amount: 567.25, date: '2024-02-10', method: 'Wire' },
  { id: '2', paymentNum: 'PAY-3002', amount: 1500.00, date: '2024-02-05', method: 'Card' },
  { id: '3', paymentNum: 'PAY-3003', amount: 890.50, date: '2024-02-01', method: 'ACH' },
];

type SortDirection = 'asc' | 'desc' | null;

interface ThProps {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: boolean;
  reversed?: boolean;
  onSort?: () => void;
}

function Th({ children, sortable, sorted, reversed, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  
  if (!sortable) {
    return <Table.Th>{children}</Table.Th>;
  }

  return (
    <Table.Th>
      <UnstyledButton onClick={onSort} style={{ width: '100%' }}>
        <Group justify="space-between" wrap="nowrap">
          <Text fw={500} size="sm">{children}</Text>
          <Center>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [invoicesSortBy, setInvoicesSortBy] = useState<string | null>(null);
  const [invoicesSortDirection, setInvoicesSortDirection] = useState<SortDirection>(null);
  const [paymentsSortBy, setPaymentsSortBy] = useState<string | null>(null);
  const [paymentsSortDirection, setPaymentsSortDirection] = useState<SortDirection>(null);

  const handleInvoicesSort = (column: string) => {
    if (invoicesSortBy === column) {
      if (invoicesSortDirection === 'asc') {
        setInvoicesSortDirection('desc');
      } else if (invoicesSortDirection === 'desc') {
        setInvoicesSortDirection(null);
        setInvoicesSortBy(null);
      } else {
        setInvoicesSortDirection('asc');
      }
    } else {
      setInvoicesSortBy(column);
      setInvoicesSortDirection('asc');
    }
  };

  const handlePaymentsSort = (column: string) => {
    if (paymentsSortBy === column) {
      if (paymentsSortDirection === 'asc') {
        setPaymentsSortDirection('desc');
      } else if (paymentsSortDirection === 'desc') {
        setPaymentsSortDirection(null);
        setPaymentsSortBy(null);
      } else {
        setPaymentsSortDirection('asc');
      }
    } else {
      setPaymentsSortBy(column);
      setPaymentsSortDirection('asc');
    }
  };

  const sortedInvoices = React.useMemo(() => {
    if (!invoicesSortBy || !invoicesSortDirection) return invoicesData;
    return [...invoicesData].sort((a, b) => {
      if (invoicesSortBy === 'dueDate') {
        return invoicesSortDirection === 'asc'
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      return 0;
    });
  }, [invoicesSortBy, invoicesSortDirection]);

  const sortedPayments = React.useMemo(() => {
    if (!paymentsSortBy || !paymentsSortDirection) return paymentsData;
    return [...paymentsData].sort((a, b) => {
      if (paymentsSortBy === 'date') {
        return paymentsSortDirection === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
  }, [paymentsSortBy, paymentsSortDirection]);

  // Check success condition
  useEffect(() => {
    const invoicesCorrect = invoicesSortBy === 'dueDate' && invoicesSortDirection === 'asc';
    const paymentsUntouched = !paymentsSortBy || !paymentsSortDirection;
    if (invoicesCorrect && paymentsUntouched) {
      onSuccess();
    }
  }, [invoicesSortBy, invoicesSortDirection, paymentsSortBy, paymentsSortDirection, onSuccess]);

  const invoicesSortModel: SortModel = invoicesSortBy && invoicesSortDirection
    ? [{ column_key: invoicesSortBy === 'dueDate' ? 'due_date' : invoicesSortBy, direction: invoicesSortDirection, priority: 1 }]
    : [];

  const paymentsSortModel: SortModel = paymentsSortBy && paymentsSortDirection
    ? [{ column_key: paymentsSortBy, direction: paymentsSortDirection, priority: 1 }]
    : [];

  return (
    <Stack style={{ width: 650 }} gap="md">
      {/* Summary pills */}
      <Group>
        <Badge variant="light" color="orange" size="lg">Outstanding: $4,837.75</Badge>
        <Badge variant="light" color="green" size="lg">Paid this month: $2,957.75</Badge>
      </Group>

      {/* Invoices */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={500} size="md" mb="md">Invoices</Text>
        <Table
          highlightOnHover
          data-testid="table-invoices"
          data-sort-model={JSON.stringify(invoicesSortModel)}
        >
          <Table.Thead>
            <Table.Tr>
              <Th>Invoice #</Th>
              <Th>Amount</Th>
              <Th
                sortable
                sorted={invoicesSortBy === 'dueDate'}
                reversed={invoicesSortDirection === 'desc'}
                onSort={() => handleInvoicesSort('dueDate')}
              >
                Due date
              </Th>
              <Th>Status</Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedInvoices.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.invoiceNum}</Table.Td>
                <Table.Td>${row.amount.toFixed(2)}</Table.Td>
                <Table.Td>{row.dueDate}</Table.Td>
                <Table.Td>{row.status}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Payments */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={500} size="md" mb="md">Payments</Text>
        <Table
          highlightOnHover
          data-testid="table-payments"
          data-sort-model={JSON.stringify(paymentsSortModel)}
        >
          <Table.Thead>
            <Table.Tr>
              <Th>Payment #</Th>
              <Th>Amount</Th>
              <Th
                sortable
                sorted={paymentsSortBy === 'date'}
                reversed={paymentsSortDirection === 'desc'}
                onSort={() => handlePaymentsSort('date')}
              >
                Date
              </Th>
              <Th>Method</Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedPayments.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.paymentNum}</Table.Td>
                <Table.Td>${row.amount.toFixed(2)}</Table.Td>
                <Table.Td>{row.date}</Table.Td>
                <Table.Td>{row.method}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}
