'use client';

/**
 * data_table_paginated-mantine-v2-T13: Cross-page exact SKU selection in compact dark table
 *
 * Dark settings_panel with one Mantine DataTable "Products". Checkbox selection
 * persists across pages. Compact, small scale.
 * Initial: page 1, no selection. Target: exactly {SKU-0137, SKU-0169, SKU-0236} selected.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Badge, Checkbox, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { generateProductData } from '../../types';

const TARGET_IDS = new Set(['SKU-0137', 'SKU-0169', 'SKU-0236']);

export default function T13({ onSuccess }: TaskComponentProps) {
  const [products] = useState(() => generateProductData(400));
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const pageSize = 10;
  const successFired = useRef(false);

  const paginatedData = useMemo(() => {
    const s = (currentPage - 1) * pageSize;
    return products.slice(s, s + pageSize);
  }, [products, currentPage]);
  const totalPages = Math.ceil(products.length / pageSize);

  useEffect(() => {
    if (successFired.current) return;
    if (selectedIds.size === TARGET_IDS.size && Array.from(TARGET_IDS).every((id) => selectedIds.has(id))) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedIds, onSuccess]);

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ padding: 16, maxWidth: 680 }}>
        <Card shadow="sm" padding="md" radius="md" withBorder data-testid="products-card">
          <Text fw={500} size="lg" mb="md">Products</Text>
          <Table striped highlightOnHover data-testid="products-table"
            data-current-page={currentPage} data-selected-rows={JSON.stringify(Array.from(selectedIds))}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 40 }} />
                <Table.Th>SKU</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Stock</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.map((p) => (
                <Table.Tr key={p.id} data-row-id={p.id}>
                  <Table.Td>
                    <Checkbox
                      checked={selectedIds.has(p.id)}
                      onChange={() => toggleRow(p.id)}
                      aria-label={`Select ${p.sku}`}
                    />
                  </Table.Td>
                  <Table.Td>{p.sku}</Table.Td>
                  <Table.Td>{p.name}</Table.Td>
                  <Table.Td><Badge variant="light">{p.category}</Badge></Table.Td>
                  <Table.Td>${p.price.toFixed(2)}</Table.Td>
                  <Table.Td>{p.stock}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Group justify="center" mt="md">
            <Pagination total={totalPages} value={currentPage} onChange={setCurrentPage}
              size="sm" data-testid="products-pagination" />
          </Group>
        </Card>
      </div>
    </MantineProvider>
  );
}
