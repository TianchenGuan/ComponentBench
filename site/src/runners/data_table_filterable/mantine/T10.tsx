'use client';

/**
 * data_table_filterable-mantine-T10: Nested cell: Filter the Invoices mini-table (3 instances)
 *
 * Scene context: theme=light; spacing=comfortable; layout=table_cell; placement=center; scale=default;
 * instances=3; guidance=text; clutter=none.
 *
 * Layout: table_cell with minimal extra clutter. The page shows a parent summary table with three rows: Orders, Invoices,
 * Payouts.
 *
 * In the rightmost cell of each row is an embedded mini filterable table (composite Mantine implementation) with its own
 * tiny filter toolbar.
 *
 * There are three instances of the same canonical component (Orders mini-table, Invoices mini-table, Payouts mini-table).
 * The Invoices mini-table is the middle one.
 *
 * Each mini-toolbar includes two Selects: "Payment status" (All, Paid, Late, Failed) and "Currency" (All, USD, EUR, GBP),
 * plus a small "Apply" button.
 *
 * Scale: default overall, but the mini-table toolbars have smaller controls due to the constrained cell width.
 *
 * Initial state: all mini-tables unfiltered.
 *
 * Disambiguation: the task must apply filters only to the Invoices mini-table.
 *
 * Success: Invoices: Payment status equals Late. Invoices: Currency equals EUR.
 * Orders and Payouts mini-tables remain unfiltered. Applied via the Invoices mini-table Apply button.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, Select, Group, Button, Box } from '@mantine/core';
import type { TaskComponentProps, FilterModel } from '../types';

interface MiniTableData {
  id: string;
  reference: string;
  paymentStatus: string;
  currency: string;
  amount: number;
}

const ordersData: MiniTableData[] = [
  { id: '1', reference: 'ORD-001', paymentStatus: 'Paid', currency: 'USD', amount: 150 },
  { id: '2', reference: 'ORD-002', paymentStatus: 'Late', currency: 'EUR', amount: 230 },
  { id: '3', reference: 'ORD-003', paymentStatus: 'Paid', currency: 'GBP', amount: 90 },
];

const invoicesData: MiniTableData[] = [
  { id: '1', reference: 'INV-001', paymentStatus: 'Paid', currency: 'USD', amount: 150 },
  { id: '2', reference: 'INV-002', paymentStatus: 'Late', currency: 'EUR', amount: 230 },
  { id: '3', reference: 'INV-003', paymentStatus: 'Failed', currency: 'EUR', amount: 90 },
  { id: '4', reference: 'INV-004', paymentStatus: 'Late', currency: 'EUR', amount: 340 },
];

const payoutsData: MiniTableData[] = [
  { id: '1', reference: 'PAY-001', paymentStatus: 'Paid', currency: 'USD', amount: 500 },
  { id: '2', reference: 'PAY-002', paymentStatus: 'Late', currency: 'GBP', amount: 320 },
  { id: '3', reference: 'PAY-003', paymentStatus: 'Paid', currency: 'EUR', amount: 180 },
];

const paymentStatusOptions = [
  { value: 'All', label: 'All' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Late', label: 'Late' },
  { value: 'Failed', label: 'Failed' },
];

const currencyOptions = [
  { value: 'All', label: 'All' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
];

interface MiniTableProps {
  title: string;
  data: MiniTableData[];
  testId: string;
  onFilterChange?: (filters: { paymentStatus: string | null; currency: string | null }) => void;
}

function MiniTable({ title, data, testId, onFilterChange }: MiniTableProps) {
  const [pendingPaymentStatus, setPendingPaymentStatus] = useState<string | null>('All');
  const [pendingCurrency, setPendingCurrency] = useState<string | null>('All');
  const [appliedPaymentStatus, setAppliedPaymentStatus] = useState<string | null>(null);
  const [appliedCurrency, setAppliedCurrency] = useState<string | null>(null);

  const filteredData = data.filter(item => {
    if (appliedPaymentStatus && appliedPaymentStatus !== 'All' && item.paymentStatus !== appliedPaymentStatus) return false;
    if (appliedCurrency && appliedCurrency !== 'All' && item.currency !== appliedCurrency) return false;
    return true;
  });

  const handleApply = () => {
    setAppliedPaymentStatus(pendingPaymentStatus);
    setAppliedCurrency(pendingCurrency);
    onFilterChange?.({ paymentStatus: pendingPaymentStatus, currency: pendingCurrency });
  };

  const filterModel: FilterModel = {
    table_id: testId,
    logic_operator: 'AND',
    global_filter: null,
    column_filters: [
      ...(appliedPaymentStatus && appliedPaymentStatus !== 'All' ? [{ column: 'Payment status', operator: 'equals' as const, value: appliedPaymentStatus }] : []),
      ...(appliedCurrency && appliedCurrency !== 'All' ? [{ column: 'Currency', operator: 'equals' as const, value: appliedCurrency }] : []),
    ],
  };

  return (
    <Box>
      <Group gap="xs" mb="xs">
        <Select
          size="xs"
          data={paymentStatusOptions}
          value={pendingPaymentStatus}
          onChange={setPendingPaymentStatus}
          style={{ width: 80 }}
          data-testid={`${testId}-payment-status-filter`}
        />
        <Select
          size="xs"
          data={currencyOptions}
          value={pendingCurrency}
          onChange={setPendingCurrency}
          style={{ width: 70 }}
          data-testid={`${testId}-currency-filter`}
        />
        <Button size="xs" onClick={handleApply}>
          Apply
        </Button>
      </Group>
      <Table
        highlightOnHover
        verticalSpacing={2}
        horizontalSpacing="xs"
        data-testid={`mini-table-${testId}`}
        data-filter-model={JSON.stringify(filterModel)}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ fontSize: 11 }}>Ref</Table.Th>
            <Table.Th style={{ fontSize: 11 }}>Status</Table.Th>
            <Table.Th style={{ fontSize: 11 }}>Curr</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td style={{ fontSize: 11 }}>{row.reference}</Table.Td>
              <Table.Td style={{ fontSize: 11 }}>{row.paymentStatus}</Table.Td>
              <Table.Td style={{ fontSize: 11 }}>{row.currency}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [invoicesFilters, setInvoicesFilters] = useState<{ paymentStatus: string | null; currency: string | null }>({ paymentStatus: null, currency: null });
  const [ordersFilters, setOrdersFilters] = useState<{ paymentStatus: string | null; currency: string | null }>({ paymentStatus: null, currency: null });
  const [payoutsFilters, setPayoutsFilters] = useState<{ paymentStatus: string | null; currency: string | null }>({ paymentStatus: null, currency: null });
  const successFiredRef = useRef(false);

  // Check success condition
  useEffect(() => {
    const invoicesCorrect = 
      invoicesFilters.paymentStatus === 'Late' && 
      invoicesFilters.currency === 'EUR';
    
    const ordersUnfiltered = 
      (!ordersFilters.paymentStatus || ordersFilters.paymentStatus === 'All') && 
      (!ordersFilters.currency || ordersFilters.currency === 'All');
    
    const payoutsUnfiltered = 
      (!payoutsFilters.paymentStatus || payoutsFilters.paymentStatus === 'All') && 
      (!payoutsFilters.currency || payoutsFilters.currency === 'All');
    
    if (
      invoicesCorrect &&
      ordersUnfiltered &&
      payoutsUnfiltered &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [invoicesFilters, ordersFilters, payoutsFilters, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={500} size="md" mb="md">Summary</Text>
      <Table withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Category</Table.Th>
            <Table.Th>Details</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td style={{ verticalAlign: 'top', width: 100 }}>
              <Text fw={500}>Orders</Text>
            </Table.Td>
            <Table.Td>
              <MiniTable
                title="Orders"
                data={ordersData}
                testId="orders"
                onFilterChange={setOrdersFilters}
              />
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td style={{ verticalAlign: 'top', width: 100 }}>
              <Text fw={500}>Invoices</Text>
            </Table.Td>
            <Table.Td>
              <MiniTable
                title="Invoices"
                data={invoicesData}
                testId="invoices"
                onFilterChange={setInvoicesFilters}
              />
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td style={{ verticalAlign: 'top', width: 100 }}>
              <Text fw={500}>Payouts</Text>
            </Table.Td>
            <Table.Td>
              <MiniTable
                title="Payouts"
                data={payoutsData}
                testId="payouts"
                onFilterChange={setPayoutsFilters}
              />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Card>
  );
}
