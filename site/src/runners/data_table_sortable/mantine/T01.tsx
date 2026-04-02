'use client';

/**
 * data_table_sortable-mantine-T21: Products - sort Price low→high (Mantine composite)
 *
 * Baseline Mantine scene with a single sortable table using core Table + clickable header buttons.
 * - Columns: Product, Category, Price, Stock.
 * - Price header is a button that toggles sorting with chevron icon.
 * - Initial state: unsorted.
 *
 * Success: Price sorted ascending.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, UnstyledButton, Group, Center } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../types';

interface ProductData {
  id: string;
  product: string;
  category: string;
  price: number;
  stock: number;
}

const productsData: ProductData[] = [
  { id: '1', product: 'Widget A', category: 'Electronics', price: 29.99, stock: 150 },
  { id: '2', product: 'Widget B', category: 'Electronics', price: 49.99, stock: 85 },
  { id: '3', product: 'Gadget X', category: 'Accessories', price: 19.99, stock: 200 },
  { id: '4', product: 'Gadget Y', category: 'Accessories', price: 79.99, stock: 42 },
  { id: '5', product: 'Tool Pro', category: 'Tools', price: 99.99, stock: 63 },
  { id: '6', product: 'Tool Basic', category: 'Tools', price: 34.99, stock: 95 },
  { id: '7', product: 'Part Alpha', category: 'Parts', price: 14.99, stock: 180 },
  { id: '8', product: 'Part Beta', category: 'Parts', price: 24.99, stock: 250 },
  { id: '9', product: 'Bundle A', category: 'Bundles', price: 149.99, stock: 30 },
  { id: '10', product: 'Bundle B', category: 'Bundles', price: 89.99, stock: 45 },
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

export default function T01({ onSuccess }: TaskComponentProps) {
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
    if (!sortBy || !sortDirection) return productsData;
    return [...productsData].sort((a, b) => {
      const aVal = a[sortBy as keyof ProductData];
      const bVal = b[sortBy as keyof ProductData];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [sortBy, sortDirection]);

  // Check success condition
  useEffect(() => {
    if (sortBy === 'price' && sortDirection === 'asc') {
      onSuccess();
    }
  }, [sortBy, sortDirection, onSuccess]);

  const sortModel: SortModel = sortBy && sortDirection
    ? [{ column_key: sortBy, direction: sortDirection, priority: 1 }]
    : [];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={500} size="md" mb="md">Products</Text>
      <Table
        highlightOnHover
        data-testid="table-products"
        data-sort-model={JSON.stringify(sortModel)}
      >
        <Table.Thead>
          <Table.Tr>
            <Th>Product</Th>
            <Th>Category</Th>
            <Th
              sortable
              sorted={sortBy === 'price'}
              reversed={sortDirection === 'desc'}
              onSort={() => handleSort('price')}
            >
              Price
            </Th>
            <Th
              sortable
              sorted={sortBy === 'stock'}
              reversed={sortDirection === 'desc'}
              onSort={() => handleSort('stock')}
            >
              Stock
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedData.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.product}</Table.Td>
              <Table.Td>{row.category}</Table.Td>
              <Table.Td>${row.price.toFixed(2)}</Table.Td>
              <Table.Td>{row.stock}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
