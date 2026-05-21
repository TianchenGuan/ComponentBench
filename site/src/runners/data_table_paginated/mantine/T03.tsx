'use client';

/**
 * data_table_paginated-mantine-T03: Products table: sort by Price (highest first)
 *
 * Layout: isolated card centered titled **Products**.
 *
 * Component: Mantine Table + Pagination composite. Column headers are interactive:
 * each sortable header is rendered as a small button with a sort indicator.
 *
 * Initial state: no active sorting (neutral).
 *
 * Success: Active sort is Price descending (highest → lowest).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Badge, UnstyledButton, Center } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import type { TaskComponentProps, ProductRow } from '../types';
import { generateProductData } from '../types';

type SortDirection = 'asc' | 'desc' | null;

interface ThProps {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: boolean;
  reversed?: boolean;
  onSort?: () => void;
}

function Th({ children, sortable, sorted, reversed, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronDown : IconChevronUp) : IconSelector;
  
  if (!sortable) {
    return <Table.Th>{children}</Table.Th>;
  }
  
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>{children}</span>
        <Center>
          <Icon size={14} stroke={1.5} />
        </Center>
      </UnstyledButton>
    </Table.Th>
  );
}

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [products] = useState(() => generateProductData(120));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [sortColumn, setSortColumn] = useState<keyof ProductRow | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return [...products];
    
    return [...products].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [products, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(products.length / pageSize);

  useEffect(() => {
    if (sortColumn === 'price' && sortDirection === 'desc' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [sortColumn, sortDirection, hasSucceeded, onSuccess]);

  const handleSort = (column: keyof ProductRow) => {
    if (sortColumn === column) {
      // Cycle: null -> asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }} data-testid="products-card">
      <Text fw={500} size="lg" mb="md">Products</Text>
      
      <Table striped highlightOnHover data-testid="products-table" data-sort-column={sortColumn} data-sort-direction={sortDirection}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>SKU</Table.Th>
            <Th sortable sorted={sortColumn === 'name'} reversed={sortDirection === 'desc'} onSort={() => handleSort('name')}>
              Name
            </Th>
            <Th sortable sorted={sortColumn === 'category'} reversed={sortDirection === 'desc'} onSort={() => handleSort('category')}>
              Category
            </Th>
            <Th sortable sorted={sortColumn === 'price'} reversed={sortDirection === 'desc'} onSort={() => handleSort('price')}>
              Price
            </Th>
            <Th sortable sorted={sortColumn === 'stock'} reversed={sortDirection === 'desc'} onSort={() => handleSort('stock')}>
              Stock
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedData.map((product) => (
            <Table.Tr key={product.id} data-row-id={product.id}>
              <Table.Td>{product.sku}</Table.Td>
              <Table.Td>{product.name}</Table.Td>
              <Table.Td>
                <Badge variant="light">{product.category}</Badge>
              </Table.Td>
              <Table.Td>${product.price.toFixed(2)}</Table.Td>
              <Table.Td>{product.stock}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="center" mt="md">
        <Pagination
          total={totalPages}
          value={currentPage}
          onChange={setCurrentPage}
          data-testid="products-pagination"
        />
      </Group>
    </Card>
  );
}
