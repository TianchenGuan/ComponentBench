'use client';

/**
 * data_table_paginated-mantine-T05: Products table: select SKU-0137 on page 4
 *
 * Layout: isolated card positioned near the **top-right** of the viewport titled **Products**.
 *
 * Component: Mantine Table + Pagination composite with checkbox row selection.
 *
 * Dataset: 100 products with SKUs SKU-0100 through SKU-0199, sorted by SKU ascending.
 * Page size is 10. Therefore, SKU-0137 appears on page 4 (rows SKU-0130…SKU-0139).
 *
 * Initial state: page 1; no selection.
 *
 * Success: Exactly one selected row: SKU-0137.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Badge, Checkbox } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { generateProductData } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [products] = useState(() => {
    // Generate 100 products with SKUs 0100-0199
    return generateProductData(100).sort((a, b) => a.sku.localeCompare(b.sku));
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / pageSize);

  useEffect(() => {
    if (selectedRowId === 'SKU-0137' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [selectedRowId, hasSucceeded, onSuccess]);

  const handleRowSelect = (rowId: string) => {
    setSelectedRowId(selectedRowId === rowId ? null : rowId);
  };

  // Note: Placement (top-right) is handled by PlacementWrapper
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 650 }} data-testid="products-card">
      <Text fw={500} size="lg" mb="md">Products</Text>
      
      <Table striped highlightOnHover data-testid="products-table" data-selected-row={selectedRowId}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }}></Table.Th>
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
              <Table.Td>
                <Checkbox
                  checked={selectedRowId === product.id}
                  onChange={() => handleRowSelect(product.id)}
                  aria-label={`Select ${product.sku}`}
                />
              </Table.Td>
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
