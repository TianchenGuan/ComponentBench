'use client';

/**
 * data_table_paginated-mantine-T08: Products table: go to last page in dark compact mode
 *
 * Layout: isolated card centered titled **Products** in **dark theme** with **compact spacing**.
 *
 * Component: Mantine Table + Pagination composite. Pagination is configured with **withEdges**
 * enabled, so it shows small first/last controls (double-chevron buttons) in addition to
 * previous/next.
 *
 * Dataset: 120 products, 10 rows per page (12 pages).
 *
 * Initial state: page 1.
 *
 * Success: Products table current page is 12.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Badge, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { generateProductData } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
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
    if (currentPage === 12 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [currentPage, hasSucceeded, onSuccess]);

  // Note: Dark theme is also handled by ThemeWrapper
  return (
    <MantineProvider defaultColorScheme="dark">
      <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 650, background: '#1a1b1e' }} data-testid="products-card">
        <Text fw={500} size="md" mb="xs" c="white">Products</Text>
        
        <Table striped highlightOnHover data-testid="products-table" data-current-page={currentPage}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ padding: '6px 8px' }}>SKU</Table.Th>
              <Table.Th style={{ padding: '6px 8px' }}>Name</Table.Th>
              <Table.Th style={{ padding: '6px 8px' }}>Category</Table.Th>
              <Table.Th style={{ padding: '6px 8px' }}>Price</Table.Th>
              <Table.Th style={{ padding: '6px 8px' }}>Stock</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedData.map((product) => (
              <Table.Tr key={product.id} data-row-id={product.id}>
                <Table.Td style={{ padding: '4px 8px' }}>{product.sku}</Table.Td>
                <Table.Td style={{ padding: '4px 8px' }}>{product.name}</Table.Td>
                <Table.Td style={{ padding: '4px 8px' }}>
                  <Badge variant="light" size="xs">{product.category}</Badge>
                </Table.Td>
                <Table.Td style={{ padding: '4px 8px' }}>${product.price.toFixed(2)}</Table.Td>
                <Table.Td style={{ padding: '4px 8px' }}>{product.stock}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="center" mt="xs">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
            withEdges
            size="sm"
            data-testid="products-pagination"
          />
        </Group>
      </Card>
    </MantineProvider>
  );
}
