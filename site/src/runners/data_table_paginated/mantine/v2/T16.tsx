'use client';

/**
 * data_table_paginated-mantine-v2-T16: Customers table — clear search, then page size 50 and page 2
 *
 * Compact settings_panel with one Mantine DataTable "Customers" and a toolbar search
 * input pre-filled with "west". Records-per-page selector + pagination below.
 * Initial: search="west", page 1, size 10.
 * Target: search empty, size 50, page 2.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Select, TextInput, CloseButton, Badge } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';

interface CustomerRecord { id: string; name: string; region: string; spend: number; status: string; }

function generateCustomers(count: number): CustomerRecord[] {
  const regions = ['North', 'South', 'East', 'West', 'Central', 'Northwest', 'Southwest', 'Northeast', 'Southeast', 'Midwest'];
  const statuses = ['Active', 'Inactive', 'VIP'];
  const names = [
    'Acme Corp', 'Western Supply', 'Eastern Goods', 'Northern Logistics', 'Southern Trading',
    'Pacific Imports', 'Atlantic Exports', 'Central Hub', 'Midwest Wholesale', 'Southwest Retail',
    'Northwestern Dist', 'Southeastern Co', 'Westfield Inc', 'Eastgate LLC', 'Northpoint Ltd',
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `CUST-${String(i + 1).padStart(4, '0')}`,
    name: names[i % names.length],
    region: regions[i % regions.length],
    spend: Math.round((500 + Math.random() * 9500) * 100) / 100,
    status: statuses[i % statuses.length],
  }));
}

export default function T16({ onSuccess }: TaskComponentProps) {
  const [allCustomers] = useState(() => generateCustomers(300));
  const [search, setSearch] = useState('west');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const successFired = useRef(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return allCustomers;
    const q = search.toLowerCase();
    return allCustomers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q),
    );
  }, [allCustomers, search]);

  const paginatedData = useMemo(() => {
    const s = (currentPage - 1) * pageSize;
    return filtered.slice(s, s + pageSize);
  }, [filtered, currentPage, pageSize]);
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    if (successFired.current) return;
    if (search.trim() === '' && pageSize === 50 && currentPage === 2) {
      successFired.current = true;
      onSuccess();
    }
  }, [search, pageSize, currentPage, onSuccess]);

  return (
    <div style={{ padding: 16, maxWidth: 750 }}>
      <Card shadow="sm" padding="md" radius="md" withBorder data-testid="customers-card">
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">Customers</Text>
          <Group gap="xs">
            <TextInput
              placeholder="Search customers..."
              leftSection={<IconSearch size={14} />}
              value={search}
              onChange={(e) => { setSearch(e.currentTarget.value); setCurrentPage(1); }}
              rightSection={search ? <CloseButton size="sm" onClick={() => { setSearch(''); setCurrentPage(1); }} /> : null}
              size="sm"
              w={220}
              data-testid="search-input"
            />
            <Select
              value={String(pageSize)}
              onChange={(v) => { if (v) { setPageSize(+v); setCurrentPage(1); } }}
              data={['10', '25', '50']}
              size="xs"
              w={70}
              data-testid="customers-page-size"
            />
          </Group>
        </Group>

        <Table striped highlightOnHover data-testid="customers-table"
          data-current-page={currentPage} data-page-size={pageSize} data-search={search}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Region</Table.Th>
              <Table.Th>Spend</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedData.map((c) => (
              <Table.Tr key={c.id}>
                <Table.Td>{c.id}</Table.Td>
                <Table.Td>{c.name}</Table.Td>
                <Table.Td>{c.region}</Table.Td>
                <Table.Td>${c.spend.toFixed(2)}</Table.Td>
                <Table.Td>
                  <Badge variant="light" size="sm"
                    color={c.status === 'VIP' ? 'violet' : c.status === 'Active' ? 'green' : 'gray'}>
                    {c.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="center" mt="md">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
            size="sm"
            data-testid="customers-pagination"
          />
        </Group>
      </Card>
    </div>
  );
}
