'use client';

/**
 * data_table_paginated-mantine-v2-T12: Inventory drawer — configure Inventory, not Backorders
 *
 * Dark drawer flow: "Inventory Manager" opens a left drawer with two Mantine DataTable
 * cards: "Inventory" and "Backorders". Each has pagination + records-per-page selector.
 * Initial: both page 1, size 10. Target: Inventory → size 25, page 4.
 * Backorders must remain page 1, size 10.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Table, Pagination, Card, Text, Group, Select, Button, Drawer, MantineProvider,
} from '@mantine/core';
import { IconBox } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { generateProductData } from '../../types';

export default function T12({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [inventory] = useState(() => generateProductData(200));
  const [backorders] = useState(() =>
    generateProductData(150).map((p) => ({ ...p, id: `BO-${p.id}`, sku: p.sku.replace('SKU', 'BO') })),
  );

  const [invPage, setInvPage] = useState(1);
  const [invSize, setInvSize] = useState(10);
  const [boPage, setBoPage] = useState(1);
  const [boSize, setBoSize] = useState(10);
  const successFired = useRef(false);

  const invData = useMemo(() => {
    const s = (invPage - 1) * invSize;
    return inventory.slice(s, s + invSize);
  }, [inventory, invPage, invSize]);
  const invTotal = Math.ceil(inventory.length / invSize);

  const boData = useMemo(() => {
    const s = (boPage - 1) * boSize;
    return backorders.slice(s, s + boSize);
  }, [backorders, boPage, boSize]);
  const boTotal = Math.ceil(backorders.length / boSize);

  useEffect(() => {
    if (successFired.current) return;
    if (invSize === 25 && invPage === 4 && boSize === 10 && boPage === 1) {
      successFired.current = true;
      onSuccess();
    }
  }, [invSize, invPage, boSize, boPage, onSuccess]);

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ padding: 16 }}>
        <Card shadow="sm" padding="md" withBorder>
          <Button leftSection={<IconBox size={16} />} onClick={() => setOpened(true)}>
            Inventory Manager
          </Button>
        </Card>

        <Drawer opened={opened} onClose={() => setOpened(false)} title="Inventory Manager"
          position="left" size="lg" data-testid="inventory-drawer">
          <Text fw={500} mb="xs">Inventory</Text>
          <Card shadow="sm" padding="sm" withBorder mb="lg" data-testid="inventory-card">
            <Group justify="flex-end" mb="xs">
              <Select value={String(invSize)} onChange={(v) => { if (v) { setInvSize(+v); setInvPage(1); } }}
                data={['10', '25', '50']} size="xs" w={70} data-testid="inventory-page-size" />
            </Group>
            <Table striped highlightOnHover data-current-page={invPage} data-page-size={invSize}>
              <Table.Thead><Table.Tr>
                <Table.Th>SKU</Table.Th><Table.Th>Name</Table.Th><Table.Th>Stock</Table.Th><Table.Th>Price</Table.Th>
              </Table.Tr></Table.Thead>
              <Table.Tbody>{invData.map((p) => (
                <Table.Tr key={p.id}><Table.Td>{p.sku}</Table.Td><Table.Td>{p.name}</Table.Td>
                  <Table.Td>{p.stock}</Table.Td><Table.Td>${p.price.toFixed(2)}</Table.Td></Table.Tr>
              ))}</Table.Tbody>
            </Table>
            <Group justify="center" mt="sm">
              <Pagination total={invTotal} value={invPage} onChange={setInvPage} size="sm" data-testid="inventory-pagination" />
            </Group>
          </Card>

          <Text fw={500} mb="xs">Backorders</Text>
          <Card shadow="sm" padding="sm" withBorder data-testid="backorders-card">
            <Group justify="flex-end" mb="xs">
              <Select value={String(boSize)} onChange={(v) => { if (v) { setBoSize(+v); setBoPage(1); } }}
                data={['10', '25', '50']} size="xs" w={70} data-testid="backorders-page-size" />
            </Group>
            <Table striped highlightOnHover data-current-page={boPage} data-page-size={boSize}>
              <Table.Thead><Table.Tr>
                <Table.Th>SKU</Table.Th><Table.Th>Name</Table.Th><Table.Th>Stock</Table.Th><Table.Th>Price</Table.Th>
              </Table.Tr></Table.Thead>
              <Table.Tbody>{boData.map((p) => (
                <Table.Tr key={p.id}><Table.Td>{p.sku}</Table.Td><Table.Td>{p.name}</Table.Td>
                  <Table.Td>{p.stock}</Table.Td><Table.Td>${p.price.toFixed(2)}</Table.Td></Table.Tr>
              ))}</Table.Tbody>
            </Table>
            <Group justify="center" mt="sm">
              <Pagination total={boTotal} value={boPage} onChange={setBoPage} size="sm" data-testid="backorders-pagination" />
            </Group>
          </Card>
        </Drawer>
      </div>
    </MantineProvider>
  );
}
