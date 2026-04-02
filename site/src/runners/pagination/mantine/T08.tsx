'use client';

/**
 * pagination-mantine-T08: Navigate in table with siblings
 * 
 * Table cell layout with product table.
 * Mantine Pagination with siblings=2.
 * Total 20 pages, currently on page 5.
 * Goal is to reach page 10.
 */

import React, { useState } from 'react';
import { Card, Text, Pagination, Group, Table, Badge, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

// Sample products
const products = Array.from({ length: 200 }, (_, i) => ({
  id: `PRD-${String(i + 1).padStart(4, '0')}`,
  name: `Product ${i + 1}`,
  price: `$${(Math.random() * 100).toFixed(2)}`,
  status: ['Active', 'Inactive', 'Pending'][i % 3],
}));

export default function T08({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(5); // Start at page 5
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 10 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedProducts = products.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 550 }}>
      <Box style={{ maxHeight: 200, overflow: 'auto' }}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedProducts.map((product) => (
              <Table.Tr key={product.id}>
                <Table.Td>{product.id}</Table.Td>
                <Table.Td>{product.name}</Table.Td>
                <Table.Td>{product.price}</Table.Td>
                <Table.Td>
                  <Badge 
                    size="xs" 
                    color={product.status === 'Active' ? 'green' : product.status === 'Pending' ? 'yellow' : 'gray'}
                  >
                    {product.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
      <Group justify="space-between" align="center" mt="sm">
        <Text size="sm" c="dimmed">
          Page {currentPage} of 20
        </Text>
        <Pagination
          total={20}
          value={currentPage}
          onChange={handlePageChange}
          siblings={2}
          size="sm"
          data-testid="mantine-pagination-products"
        />
      </Group>
    </Card>
  );
}
