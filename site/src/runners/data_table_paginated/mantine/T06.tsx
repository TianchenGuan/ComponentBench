'use client';

/**
 * data_table_paginated-mantine-T06: Products table: clear the active search filter
 *
 * Layout: isolated card centered titled **Products**.
 *
 * Component: Mantine Table + Pagination composite with a toolbar Search TextInput.
 *
 * Initial state (important): the Search input already contains the text **guitar**,
 * and the table is filtered accordingly (only matching products are shown).
 * The Search input shows a clear (×) control on the right.
 *
 * Controls: clear the Search input (using the × button or by deleting text)
 * so the table returns to the unfiltered state.
 *
 * Success: No active filters remain (search text is empty / filter list empty).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Badge, TextInput, CloseButton } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { generateProductData } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [products] = useState(() => generateProductData(120));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // Start with 'guitar' filter active
  const [searchQuery, setSearchQuery] = useState('guitar');
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(query));
  }, [products, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  useEffect(() => {
    // Success when search is cleared
    if (searchQuery.trim() === '' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [searchQuery, hasSucceeded, onSuccess]);

  const handleClear = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }} data-testid="products-card">
      <Group justify="space-between" mb="md">
        <Text fw={500} size="lg">Products</Text>
        <TextInput
          placeholder="Search products"
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          rightSection={
            searchQuery ? (
              <CloseButton
                size="sm"
                onClick={handleClear}
                aria-label="Clear search"
              />
            ) : null
          }
          size="sm"
          w={200}
          data-testid="search-input"
        />
      </Group>
      
      <Table striped highlightOnHover data-testid="products-table" data-filter-query={searchQuery}>
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
          {paginatedData.length > 0 ? (
            paginatedData.map((product) => (
              <Table.Tr key={product.id} data-row-id={product.id}>
                <Table.Td>{product.sku}</Table.Td>
                <Table.Td>{product.name}</Table.Td>
                <Table.Td>
                  <Badge variant="light">{product.category}</Badge>
                </Table.Td>
                <Table.Td>${product.price.toFixed(2)}</Table.Td>
                <Table.Td>{product.stock}</Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                No products found
              </Table.Td>
            </Table.Tr>
          )}
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
