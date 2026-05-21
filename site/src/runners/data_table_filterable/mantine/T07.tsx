'use client';

/**
 * data_table_filterable-mantine-T07: Small: Amount range slider 50-125
 *
 * Scene context: theme=light; spacing=compact; layout=isolated_card; placement=center; scale=small; instances=1;
 * guidance=text; clutter=none.
 *
 * Layout: isolated_card centered. Spacing is compact and the component is rendered at small scale (narrower card and smaller
 * controls).
 *
 * Composite Mantine filterable Orders table with a toolbar above the table.
 *
 * Toolbar includes a RangeSlider labeled "Amount" with min=0, max=200, step=1, and two draggable handles showing the current
 * min/max as small value labels.
 *
 * There is an "Apply filters" button; slider changes are staged and only applied after clicking Apply filters.
 *
 * Initial state: slider is at full range 0-200 (no filtering).
 *
 * Success: Amount range filter equals min=50 and max=125 (inclusive). Applied via Apply filters.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, Group, Button, RangeSlider, Box } from '@mantine/core';
import type { TaskComponentProps, FilterModel } from '../types';

interface OrderData {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
}

const ordersData: OrderData[] = [
  { id: '1', orderId: 'ORD-001', customer: 'Alice', amount: 45 },
  { id: '2', orderId: 'ORD-002', customer: 'Bob', amount: 75 },
  { id: '3', orderId: 'ORD-003', customer: 'Carol', amount: 90 },
  { id: '4', orderId: 'ORD-004', customer: 'David', amount: 125 },
  { id: '5', orderId: 'ORD-005', customer: 'Eva', amount: 50 },
  { id: '6', orderId: 'ORD-006', customer: 'Frank', amount: 180 },
  { id: '7', orderId: 'ORD-007', customer: 'Grace', amount: 100 },
  { id: '8', orderId: 'ORD-008', customer: 'Henry', amount: 35 },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [pendingRange, setPendingRange] = useState<[number, number]>([0, 200]);
  const [appliedRange, setAppliedRange] = useState<[number, number] | null>(null);
  const successFiredRef = useRef(false);

  // Filter data based on applied range
  const filteredData = ordersData.filter(order => {
    if (!appliedRange) return true;
    return order.amount >= appliedRange[0] && order.amount <= appliedRange[1];
  });

  const handleApply = () => {
    setAppliedRange([...pendingRange]);
  };

  // Check success condition
  useEffect(() => {
    if (
      appliedRange &&
      appliedRange[0] === 50 &&
      appliedRange[1] === 125 &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [appliedRange, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'orders_mantine',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: appliedRange && (appliedRange[0] !== 0 || appliedRange[1] !== 200)
      ? [{
          column: 'Amount',
          operator: 'between_inclusive' as const,
          value: { min: appliedRange[0], max: appliedRange[1] },
        }]
      : [],
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 500 }}>
      {/* Filter toolbar */}
      <Group mb="sm" justify="space-between" align="flex-end">
        <Box style={{ flex: 1, marginRight: 16 }}>
          <Text size="xs" fw={500} mb={4}>Amount</Text>
          <RangeSlider
            min={0}
            max={200}
            step={1}
            value={pendingRange}
            onChange={setPendingRange}
            marks={[
              { value: 0, label: '0' },
              { value: 50, label: '50' },
              { value: 100, label: '100' },
              { value: 150, label: '150' },
              { value: 200, label: '200' },
            ]}
            size="sm"
            data-testid="amount-range-slider"
          />
        </Box>
        <Button size="xs" onClick={handleApply}>
          Apply filters
        </Button>
      </Group>

      <Text fw={500} size="sm" mb="xs" mt="md">Orders</Text>
      <Table
        highlightOnHover
        verticalSpacing="xs"
        data-testid="table-orders"
        data-filter-model={JSON.stringify(filterModel)}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Amount</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.orderId}</Table.Td>
              <Table.Td>{row.customer}</Table.Td>
              <Table.Td>${row.amount}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
