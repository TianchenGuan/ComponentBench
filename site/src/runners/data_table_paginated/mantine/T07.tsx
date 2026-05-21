'use client';

/**
 * data_table_paginated-mantine-T07: Dashboard: configure Products table page size and page
 *
 * Layout: **dashboard** with multiple cards and higher clutter.
 *
 * Scene contains TWO paginated tables (instances=2), each implemented as a
 * Mantine Table + Pagination composite:
 * 1) **Products** table (left card) — includes a Rows per page Select and Pagination.
 * 2) **Services** table (right card) — similar controls and styling.
 *
 * Both cards also include small header actions (Refresh icon, Export button) as distractors.
 *
 * Initial state:
 * • Products: page 1, page size 10
 * • Services: page 1, page size 10
 *
 * Task target: only the **Products** table should end on page size 50 and page 3.
 *
 * Success: Products table: page size is 50 and current page is 3.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Pagination, Card, Text, Group, Badge, Select, ActionIcon, Button } from '@mantine/core';
import { IconRefresh, IconDownload } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { generateProductData } from '../types';

// Simple service data generator
function generateServiceData(count: number) {
  const services = ['Web Hosting', 'Cloud Storage', 'API Access', 'Support Plan', 'Analytics', 'CDN', 'Database', 'Email', 'Backup', 'Monitoring'];
  const tiers = ['Basic', 'Pro', 'Enterprise'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `SVC-${String(i + 1).padStart(4, '0')}`,
    name: services[i % services.length],
    tier: tiers[i % tiers.length],
    price: Math.round((20 + Math.random() * 180) * 100) / 100,
  }));
}

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [products] = useState(() => generateProductData(300));
  const [services] = useState(() => generateServiceData(200));
  
  // Products state
  const [productsPage, setProductsPage] = useState(1);
  const [productsPageSize, setProductsPageSize] = useState(10);
  
  // Services state
  const [servicesPage, setServicesPage] = useState(1);
  const [servicesPageSize, setServicesPageSize] = useState(10);
  
  const [hasSucceeded, setHasSucceeded] = useState(false);

  // Products pagination
  const productsPaginatedData = useMemo(() => {
    const start = (productsPage - 1) * productsPageSize;
    return products.slice(start, start + productsPageSize);
  }, [products, productsPage, productsPageSize]);
  const productsTotalPages = Math.ceil(products.length / productsPageSize);

  // Services pagination
  const servicesPaginatedData = useMemo(() => {
    const start = (servicesPage - 1) * servicesPageSize;
    return services.slice(start, start + servicesPageSize);
  }, [services, servicesPage, servicesPageSize]);
  const servicesTotalPages = Math.ceil(services.length / servicesPageSize);

  useEffect(() => {
    // Success when Products: page size = 50 and page = 3
    if (productsPageSize === 50 && productsPage === 3 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [productsPageSize, productsPage, hasSucceeded, onSuccess]);

  return (
    <Group align="flex-start" gap="lg" style={{ maxWidth: 1100 }}>
      {/* Products table (left) */}
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }} data-testid="table-products">
        <Group justify="space-between" mb="sm">
          <Text fw={500} size="lg">Products</Text>
          <Group gap="xs">
            <ActionIcon variant="subtle" size="sm">
              <IconRefresh size={16} />
            </ActionIcon>
            <Button size="xs" variant="light" leftSection={<IconDownload size={14} />}>
              Export
            </Button>
            <Select
              value={String(productsPageSize)}
              onChange={(val) => {
                if (val) {
                  setProductsPageSize(parseInt(val, 10));
                  setProductsPage(1);
                }
              }}
              data={['10', '25', '50']}
              size="xs"
              w={70}
              data-testid="products-page-size"
            />
          </Group>
        </Group>
        
        <Table striped highlightOnHover data-current-page={productsPage} data-page-size={productsPageSize}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>SKU</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Price</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {productsPaginatedData.map((product) => (
              <Table.Tr key={product.id}>
                <Table.Td>{product.sku}</Table.Td>
                <Table.Td>{product.name}</Table.Td>
                <Table.Td>${product.price.toFixed(2)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="center" mt="sm">
          <Pagination
            total={productsTotalPages}
            value={productsPage}
            onChange={setProductsPage}
            size="sm"
            data-testid="products-pagination"
          />
        </Group>
      </Card>

      {/* Services table (right) */}
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }} data-testid="table-services">
        <Group justify="space-between" mb="sm">
          <Text fw={500} size="lg">Services</Text>
          <Group gap="xs">
            <ActionIcon variant="subtle" size="sm">
              <IconRefresh size={16} />
            </ActionIcon>
            <Button size="xs" variant="light" leftSection={<IconDownload size={14} />}>
              Export
            </Button>
            <Select
              value={String(servicesPageSize)}
              onChange={(val) => {
                if (val) {
                  setServicesPageSize(parseInt(val, 10));
                  setServicesPage(1);
                }
              }}
              data={['10', '25', '50']}
              size="xs"
              w={70}
              data-testid="services-page-size"
            />
          </Group>
        </Group>
        
        <Table striped highlightOnHover data-current-page={servicesPage} data-page-size={servicesPageSize}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Service</Table.Th>
              <Table.Th>Tier</Table.Th>
              <Table.Th>Price</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {servicesPaginatedData.map((service) => (
              <Table.Tr key={service.id}>
                <Table.Td>{service.id}</Table.Td>
                <Table.Td>{service.name}</Table.Td>
                <Table.Td>
                  <Badge variant="light" size="sm">{service.tier}</Badge>
                </Table.Td>
                <Table.Td>${service.price.toFixed(2)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="center" mt="sm">
          <Pagination
            total={servicesTotalPages}
            value={servicesPage}
            onChange={setServicesPage}
            size="sm"
            data-testid="services-pagination"
          />
        </Group>
      </Card>
    </Group>
  );
}
