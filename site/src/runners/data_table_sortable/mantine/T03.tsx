'use client';

/**
 * data_table_sortable-mantine-T23: Accordion - open Archived Orders and sort Order # ascending
 *
 * Form section layout with an accordion disclosure controlling visibility.
 * - Two accordion items: "Active Orders" and "Archived Orders" (collapsed by default).
 * - Inside "Archived Orders" is a Mantine composite sortable table.
 * - Columns: Order #, Customer, Total, Archived on.
 * - Initial state (once revealed): unsorted.
 *
 * Success: Archived Orders section expanded AND Order # sorted ascending.
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Table, Card, Text, UnstyledButton, Group, Center, Switch, Box } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../types';

interface ArchivedOrderData {
  id: string;
  orderNum: string;
  customer: string;
  total: number;
  archivedOn: string;
}

const archivedOrdersData: ArchivedOrderData[] = [
  { id: '1', orderNum: 'ORD-1050', customer: 'Acme Corp', total: 1250.00, archivedOn: '2024-01-15' },
  { id: '2', orderNum: 'ORD-1023', customer: 'TechStart', total: 890.50, archivedOn: '2024-01-10' },
  { id: '3', orderNum: 'ORD-1078', customer: 'Global Systems', total: 2340.00, archivedOn: '2024-01-20' },
  { id: '4', orderNum: 'ORD-1012', customer: 'DataFlow', total: 567.25, archivedOn: '2024-01-05' },
  { id: '5', orderNum: 'ORD-1089', customer: 'CloudNet', total: 1780.00, archivedOn: '2024-01-25' },
  { id: '6', orderNum: 'ORD-1034', customer: 'Innovate Labs', total: 3200.00, archivedOn: '2024-01-12' },
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

export default function T03({ onSuccess }: TaskComponentProps) {
  const [accordionValue, setAccordionValue] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortBy(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortBy || !sortDirection) return archivedOrdersData;
    return [...archivedOrdersData].sort((a, b) => {
      if (sortBy === 'orderNum') {
        // Sort by numeric part of order number
        const aNum = parseInt(a.orderNum.split('-')[1]);
        const bNum = parseInt(b.orderNum.split('-')[1]);
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }
      return 0;
    });
  }, [sortBy, sortDirection]);

  // Check success condition
  useEffect(() => {
    const isExpanded = accordionValue === 'archived';
    const isSorted = sortBy === 'orderNum' && sortDirection === 'asc';
    if (isExpanded && isSorted) {
      onSuccess();
    }
  }, [accordionValue, sortBy, sortDirection, onSuccess]);

  const sortModel: SortModel = sortBy && sortDirection
    ? [{ column_key: sortBy === 'orderNum' ? 'order_id' : sortBy, direction: sortDirection, priority: 1 }]
    : [];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={500} size="md" mb="md">Orders</Text>
      
      <Box mb="md">
        <Switch label="Show all time" />
      </Box>

      <Accordion value={accordionValue} onChange={setAccordionValue}>
        <Accordion.Item value="active">
          <Accordion.Control>Active Orders</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm" c="dimmed">You have 12 active orders in progress.</Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="archived">
          <Accordion.Control aria-expanded={accordionValue === 'archived'}>Archived Orders</Accordion.Control>
          <Accordion.Panel>
            <Table
              highlightOnHover
              data-testid="table-archived-orders"
              data-sort-model={JSON.stringify(sortModel)}
            >
              <Table.Thead>
                <Table.Tr>
                  <Th
                    sortable
                    sorted={sortBy === 'orderNum'}
                    reversed={sortDirection === 'desc'}
                    onSort={() => handleSort('orderNum')}
                  >
                    Order #
                  </Th>
                  <Th>Customer</Th>
                  <Th>Total</Th>
                  <Th>Archived on</Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sortedData.map((row) => (
                  <Table.Tr key={row.id}>
                    <Table.Td>{row.orderNum}</Table.Td>
                    <Table.Td>{row.customer}</Table.Td>
                    <Table.Td>${row.total.toFixed(2)}</Table.Td>
                    <Table.Td>{row.archivedOn}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
