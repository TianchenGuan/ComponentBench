'use client';

/**
 * data_table_paginated-mantine-T04: Products table: search and select product from reference card
 *
 * Layout: isolated card centered, split into two areas:
 * • Main area: Products table (Mantine Table + Pagination composite)
 * • Side area: a **Reference Product** card
 *
 * Reference card (mixed guidance): shows a small product thumbnail icon and the text **Acoustic Guitar**.
 *
 * Table toolbar (part of the component wrapper): includes a Search TextInput labeled "Search products".
 * Typing filters the table by Name.
 *
 * Dataset: 120 products. "Acoustic Guitar" appears exactly once and is not on the first page.
 *
 * Row selection: each row has a leading checkbox.
 *
 * Initial state: page 1; no filter text; no selected rows.
 *
 * Success: Selected row matches the reference product (resolved SKU-0457).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Badge, TextInput, Checkbox, Paper, ThemeIcon } from '@mantine/core';
import { IconSearch, IconMusic } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { generateProductData } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [products] = useState(() => {
    const data = generateProductData(120);
    // Ensure "Acoustic Guitar" is at SKU-0457
    const guitarIdx = data.findIndex(p => p.name === 'Acoustic Guitar');
    if (guitarIdx >= 0) {
      data[guitarIdx].sku = 'SKU-0457';
      data[guitarIdx].id = 'SKU-0457';
    }
    return data;
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
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
    if (selectedRowId === 'SKU-0457' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [selectedRowId, hasSucceeded, onSuccess]);

  const handleRowSelect = (rowId: string) => {
    setSelectedRowId(selectedRowId === rowId ? null : rowId);
  };

  return (
    <Group align="flex-start" gap="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 650 }} data-testid="products-card">
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
            size="sm"
            w={200}
            data-testid="search-input"
          />
        </Group>
        
        <Table striped highlightOnHover data-testid="products-table" data-selected-row={selectedRowId}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }}></Table.Th>
              <Table.Th>SKU</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Price</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedData.map((product) => (
              <Table.Tr key={product.id} data-row-id={product.id}>
                <Table.Td>
                  <Checkbox
                    checked={selectedRowId === product.id}
                    onChange={() => handleRowSelect(product.id)}
                    aria-label={`Select ${product.name}`}
                  />
                </Table.Td>
                <Table.Td>{product.sku}</Table.Td>
                <Table.Td>{product.name}</Table.Td>
                <Table.Td>
                  <Badge variant="light">{product.category}</Badge>
                </Table.Td>
                <Table.Td>${product.price.toFixed(2)}</Table.Td>
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

      {/* Reference card */}
      <Paper shadow="sm" p="md" radius="md" withBorder w={180} data-testid="reference-product-card" data-reference-id="ref-product-card-1">
        <Text size="sm" c="dimmed" mb="sm">Reference Product</Text>
        <Group>
          <ThemeIcon size="lg" variant="light" color="blue">
            <IconMusic size={20} />
          </ThemeIcon>
          <div>
            <Text fw={500}>Acoustic Guitar</Text>
            <Text size="xs" c="dimmed">SKU-0457 · Electronics</Text>
          </div>
        </Group>
      </Paper>
    </Group>
  );
}
