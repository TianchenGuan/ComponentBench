'use client';

/**
 * data_table_paginated-mantine-T02: Products table: set rows per page to 25
 *
 * Layout: isolated card centered titled **Products**.
 *
 * Component: composed Mantine Table + Pagination with a small table toolbar.
 *
 * Toolbar (part of the table component wrapper): includes a **Rows per page** Select control
 * with options 10, 25, 50.
 *
 * Initial state: page 1; rows per page = 10.
 *
 * Success: Products table rows-per-page (page_size) is 25.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Badge, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { generateProductData } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [products] = useState(() => generateProductData(120));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage, pageSize]);

  const totalPages = Math.ceil(products.length / pageSize);

  useEffect(() => {
    if (pageSize === 25 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [pageSize, hasSucceeded, onSuccess]);

  const handlePageSizeChange = (value: string | null) => {
    if (value) {
      setPageSize(parseInt(value, 10));
      setCurrentPage(1); // Reset to first page when changing page size
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }} data-testid="products-card">
      <Group justify="space-between" mb="md">
        <Text fw={500} size="lg">Products</Text>
        <Select
          label="Rows per page"
          value={String(pageSize)}
          onChange={handlePageSizeChange}
          data={[
            { value: '10', label: '10' },
            { value: '25', label: '25' },
            { value: '50', label: '50' },
          ]}
          size="xs"
          w={100}
          data-testid="page-size-select"
        />
      </Group>
      
      <Table striped highlightOnHover data-testid="products-table" data-page-size={pageSize}>
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
