'use client';

/**
 * data_table_filterable-mantine-T08: Dark: Status (Trial/Paused) + Plan=Pro
 *
 * Scene context: theme=dark; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Theme: dark. Layout: isolated_card centered.
 *
 * Composite Mantine filterable Orders table with a toolbar.
 *
 * Toolbar controls: MultiSelect labeled "Status" (options: Pending, Processing, Trial, Paused, Shipped, Cancelled), Select
 * labeled "Plan" (Free, Pro, Enterprise), and an "Apply filters" button.
 *
 * Filtering is staged: changes do not affect rows until Apply filters is clicked.
 *
 * Initial state: no filters active (Status empty, Plan=All).
 *
 * Success: Status filter contains exactly Trial and Paused. Plan filter equals Pro. Applied via Apply filters.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, MultiSelect, Select, Group, Button } from '@mantine/core';
import type { TaskComponentProps, FilterModel } from '../types';

interface OrderData {
  id: string;
  orderId: string;
  customer: string;
  status: string;
  plan: string;
  amount: number;
}

const ordersData: OrderData[] = [
  { id: '1', orderId: 'ORD-001', customer: 'Alice', status: 'Pending', plan: 'Free', amount: 0 },
  { id: '2', orderId: 'ORD-002', customer: 'Bob', status: 'Trial', plan: 'Pro', amount: 29 },
  { id: '3', orderId: 'ORD-003', customer: 'Carol', status: 'Paused', plan: 'Pro', amount: 29 },
  { id: '4', orderId: 'ORD-004', customer: 'David', status: 'Shipped', plan: 'Enterprise', amount: 99 },
  { id: '5', orderId: 'ORD-005', customer: 'Eva', status: 'Trial', plan: 'Pro', amount: 29 },
  { id: '6', orderId: 'ORD-006', customer: 'Frank', status: 'Cancelled', plan: 'Free', amount: 0 },
  { id: '7', orderId: 'ORD-007', customer: 'Grace', status: 'Paused', plan: 'Pro', amount: 29 },
  { id: '8', orderId: 'ORD-008', customer: 'Henry', status: 'Processing', plan: 'Enterprise', amount: 99 },
];

const statusOptions = ['Pending', 'Processing', 'Trial', 'Paused', 'Shipped', 'Cancelled'];
const planOptions = [
  { value: 'All', label: 'All' },
  { value: 'Free', label: 'Free' },
  { value: 'Pro', label: 'Pro' },
  { value: 'Enterprise', label: 'Enterprise' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [pendingStatus, setPendingStatus] = useState<string[]>([]);
  const [pendingPlan, setPendingPlan] = useState<string | null>('All');
  const [appliedStatus, setAppliedStatus] = useState<string[]>([]);
  const [appliedPlan, setAppliedPlan] = useState<string | null>(null);
  const successFiredRef = useRef(false);

  // Filter data based on applied filters
  const filteredData = ordersData.filter(order => {
    if (appliedStatus.length > 0 && !appliedStatus.includes(order.status)) return false;
    if (appliedPlan && appliedPlan !== 'All' && order.plan !== appliedPlan) return false;
    return true;
  });

  const handleApply = () => {
    setAppliedStatus([...pendingStatus]);
    setAppliedPlan(pendingPlan);
  };

  // Check success condition
  useEffect(() => {
    if (
      appliedStatus.length === 2 &&
      appliedStatus.includes('Trial') &&
      appliedStatus.includes('Paused') &&
      appliedPlan === 'Pro' &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [appliedStatus, appliedPlan, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'orders_mantine',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: [
      ...(appliedStatus.length > 0 ? [{ column: 'Status', operator: 'in' as const, value: appliedStatus }] : []),
      ...(appliedPlan && appliedPlan !== 'All' ? [{ column: 'Plan', operator: 'equals' as const, value: appliedPlan }] : []),
    ],
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 750 }}>
      {/* Filter toolbar */}
      <Group mb="md" justify="space-between">
        <Group gap="md">
          <MultiSelect
            label="Status"
            placeholder="Select statuses"
            data={statusOptions}
            value={pendingStatus}
            onChange={setPendingStatus}
            style={{ width: 220 }}
            data-testid="status-filter"
          />
          <Select
            label="Plan"
            data={planOptions}
            value={pendingPlan}
            onChange={setPendingPlan}
            style={{ width: 150 }}
            data-testid="plan-filter"
          />
        </Group>
        <Button onClick={handleApply} mt="auto">
          Apply filters
        </Button>
      </Group>

      <Text fw={500} size="md" mb="md">Orders</Text>
      <Table
        highlightOnHover
        data-testid="table-orders"
        data-filter-model={JSON.stringify(filterModel)}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Plan</Table.Th>
            <Table.Th>Amount</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.orderId}</Table.Td>
              <Table.Td>{row.customer}</Table.Td>
              <Table.Td>{row.status}</Table.Td>
              <Table.Td>{row.plan}</Table.Td>
              <Table.Td>${row.amount}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
