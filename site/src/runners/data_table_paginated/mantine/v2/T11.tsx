'use client';

/**
 * data_table_paginated-mantine-v2-T11: Products card — rows per page and page in the correct table
 *
 * Dashboard with two Mantine DataTable cards: "Products" and "Services".
 * Each has recordsPerPage selector + Pagination. Header actions + chart card as clutter.
 * Initial: both page 1, size 10. Target: Products → size 50, page 3.
 * Services must remain page 1, size 10.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Badge, Select, ActionIcon, Button } from '@mantine/core';
import { IconRefresh, IconDownload } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { generateProductData } from '../../types';

function generateServiceData(count: number) {
  const services = ['Web Hosting', 'Cloud Storage', 'API Access', 'Support Plan',
    'Analytics', 'CDN', 'Database', 'Email', 'Backup', 'Monitoring'];
  const tiers = ['Basic', 'Pro', 'Enterprise'];
  return Array.from({ length: count }, (_, i) => ({
    id: `SVC-${String(i + 1).padStart(4, '0')}`,
    name: services[i % services.length],
    tier: tiers[i % tiers.length],
    price: Math.round((20 + Math.random() * 180) * 100) / 100,
  }));
}

export default function T11({ onSuccess }: TaskComponentProps) {
  const [products] = useState(() => generateProductData(300));
  const [services] = useState(() => generateServiceData(200));

  const [prodPage, setProdPage] = useState(1);
  const [prodSize, setProdSize] = useState(10);
  const [svcPage, setSvcPage] = useState(1);
  const [svcSize, setSvcSize] = useState(10);
  const successFired = useRef(false);

  const prodData = useMemo(() => {
    const s = (prodPage - 1) * prodSize;
    return products.slice(s, s + prodSize);
  }, [products, prodPage, prodSize]);
  const prodTotal = Math.ceil(products.length / prodSize);

  const svcData = useMemo(() => {
    const s = (svcPage - 1) * svcSize;
    return services.slice(s, s + svcSize);
  }, [services, svcPage, svcSize]);
  const svcTotal = Math.ceil(services.length / svcSize);

  useEffect(() => {
    if (successFired.current) return;
    if (prodSize === 50 && prodPage === 3 && svcSize === 10 && svcPage === 1) {
      successFired.current = true;
      onSuccess();
    }
  }, [prodSize, prodPage, svcSize, svcPage, onSuccess]);

  return (
    <Group align="flex-start" gap="lg" style={{ maxWidth: 1100, padding: 16 }}>
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }} data-testid="table-products">
        <Group justify="space-between" mb="sm">
          <Text fw={500} size="lg">Products</Text>
          <Group gap="xs">
            <ActionIcon variant="subtle" size="sm"><IconRefresh size={16} /></ActionIcon>
            <Button size="xs" variant="light" leftSection={<IconDownload size={14} />}>Export</Button>
            <Select value={String(prodSize)} onChange={(v) => { if (v) { setProdSize(+v); setProdPage(1); } }}
              data={['10', '25', '50']} size="xs" w={70} data-testid="products-page-size" />
          </Group>
        </Group>
        <Table striped highlightOnHover data-current-page={prodPage} data-page-size={prodSize}>
          <Table.Thead><Table.Tr>
            <Table.Th>SKU</Table.Th><Table.Th>Name</Table.Th><Table.Th>Price</Table.Th>
          </Table.Tr></Table.Thead>
          <Table.Tbody>{prodData.map((p) => (
            <Table.Tr key={p.id}><Table.Td>{p.sku}</Table.Td><Table.Td>{p.name}</Table.Td>
              <Table.Td>${p.price.toFixed(2)}</Table.Td></Table.Tr>
          ))}</Table.Tbody>
        </Table>
        <Group justify="center" mt="sm">
          <Pagination total={prodTotal} value={prodPage} onChange={setProdPage} size="sm" data-testid="products-pagination" />
        </Group>
      </Card>

      <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }} data-testid="table-services">
        <Group justify="space-between" mb="sm">
          <Text fw={500} size="lg">Services</Text>
          <Group gap="xs">
            <ActionIcon variant="subtle" size="sm"><IconRefresh size={16} /></ActionIcon>
            <Button size="xs" variant="light" leftSection={<IconDownload size={14} />}>Export</Button>
            <Select value={String(svcSize)} onChange={(v) => { if (v) { setSvcSize(+v); setSvcPage(1); } }}
              data={['10', '25', '50']} size="xs" w={70} data-testid="services-page-size" />
          </Group>
        </Group>
        <Table striped highlightOnHover data-current-page={svcPage} data-page-size={svcSize}>
          <Table.Thead><Table.Tr>
            <Table.Th>ID</Table.Th><Table.Th>Service</Table.Th><Table.Th>Tier</Table.Th><Table.Th>Price</Table.Th>
          </Table.Tr></Table.Thead>
          <Table.Tbody>{svcData.map((s) => (
            <Table.Tr key={s.id}><Table.Td>{s.id}</Table.Td><Table.Td>{s.name}</Table.Td>
              <Table.Td><Badge variant="light" size="sm">{s.tier}</Badge></Table.Td>
              <Table.Td>${s.price.toFixed(2)}</Table.Td></Table.Tr>
          ))}</Table.Tbody>
        </Table>
        <Group justify="center" mt="sm">
          <Pagination total={svcTotal} value={svcPage} onChange={setSvcPage} size="sm" data-testid="services-pagination" />
        </Group>
      </Card>

      <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: '100%' }}>
        <Text size="sm" c="dimmed">Dashboard summary: 300 products, 200 services</Text>
      </Card>
    </Group>
  );
}
