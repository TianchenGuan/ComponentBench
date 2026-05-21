'use client';

/**
 * data_table_paginated-mantine-T01: Products table: go to page 2
 *
 * Layout: isolated card centered titled **Products**.
 *
 * Component: a composed Mantine implementation of a paginated table:
 * • Mantine **Table** for the rows/columns
 * • Mantine **Pagination** component below the table for page navigation
 *
 * Dataset: 120 products, 10 rows per page (12 pages total).
 * Pagination shows numbered page buttons plus next/previous.
 *
 * Initial state: page 1; no selected rows; no sorting/filtering.
 *
 * Success: Products table current page is 2 (1-based).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { generateProductData } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [products] = useState(() => generateProductData(120));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / pageSize);

  useEffect(() => {
    if (currentPage === 2 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [currentPage, hasSucceeded, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }} data-testid="products-card">
      <Text fw={500} size="lg" mb="md">Products</Text>
      
      <Table striped highlightOnHover data-testid="products-table" data-current-page={currentPage}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>SKU</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Stock</Table.Th>
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
