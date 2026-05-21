'use client';

/**
 * data_table_filterable-mantine-v2-T14: Products drawer – search inside category popover and apply
 *
 * A left-side Mantine Drawer from a merch dashboard. Inside: one Mantine DataTable "Products".
 * Category has a searchable popover with a long list; Stock has a simpler select popover. Both
 * use explicit Apply buttons. Target: Category=Accessories AND Stock=Low. Dark theme, compact.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, Drawer, Button, Popover, TextInput, Stack, Select, Group, Badge, MantineProvider } from '@mantine/core';
import type { TaskComponentProps, FilterModel } from '../../types';

interface ProductRow {
  id: string;
  name: string;
  category: string;
  stock: string;
  price: number;
}

const categoryOptions = [
  'Accessories', 'Apparel', 'Audio', 'Automotive', 'Beauty',
  'Books', 'Cameras', 'Chargers', 'Computers', 'Electronics',
  'Fitness', 'Furniture', 'Garden', 'Health', 'Home',
  'Jewelry', 'Kitchen', 'Office', 'Outdoors', 'Sports',
];

const stockOptions = ['All', 'High', 'Medium', 'Low', 'Out of Stock'];

const productsData: ProductRow[] = [
  { id: '1', name: 'Phone Case', category: 'Accessories', stock: 'Low', price: 19.99 },
  { id: '2', name: 'Laptop Stand', category: 'Accessories', stock: 'Medium', price: 49.99 },
  { id: '3', name: 'Winter Jacket', category: 'Apparel', stock: 'High', price: 149.00 },
  { id: '4', name: 'Bluetooth Speaker', category: 'Audio', stock: 'Low', price: 59.99 },
  { id: '5', name: 'USB-C Charger', category: 'Chargers', stock: 'High', price: 29.99 },
  { id: '6', name: 'Screen Protector', category: 'Accessories', stock: 'Low', price: 12.99 },
  { id: '7', name: 'Running Shoes', category: 'Sports', stock: 'Medium', price: 89.99 },
  { id: '8', name: 'Yoga Mat', category: 'Fitness', stock: 'Out of Stock', price: 35.00 },
];

export default function T14({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<string>('All');
  const [catPopOpen, setCatPopOpen] = useState(false);
  const [stockPopOpen, setStockPopOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [pendingCat, setPendingCat] = useState<string>('All');
  const [pendingStock, setPendingStock] = useState<string>('All');
  const successFiredRef = useRef(false);

  const filteredData = productsData.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (stockFilter !== 'All' && p.stock !== stockFilter) return false;
    return true;
  });

  useEffect(() => {
    if (successFiredRef.current) return;
    if (categoryFilter === 'Accessories' && stockFilter === 'Low') {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [categoryFilter, stockFilter, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'products',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: [
      ...(categoryFilter !== 'All' ? [{ column: 'Category', operator: 'equals' as const, value: categoryFilter }] : []),
      ...(stockFilter !== 'All' ? [{ column: 'Stock', operator: 'equals' as const, value: stockFilter }] : []),
    ],
  };

  const visibleCats = categoryOptions.filter(c => c.toLowerCase().includes(catSearch.toLowerCase()));

  return (
    <MantineProvider defaultColorScheme="dark">
      <div style={{ padding: 16, background: '#1a1b1e', minHeight: 400 }}>
        <Button size="xs" onClick={() => setDrawerOpen(true)}>Open Products</Button>

        <Drawer
          opened={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Products"
          position="left"
          size="lg"
        >
          <Table
            highlightOnHover
            data-testid="table-products"
            data-filter-model={JSON.stringify(filterModel)}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>
                  <Group gap={4}>
                    Category
                    <Popover opened={catPopOpen} onChange={setCatPopOpen} position="bottom" withArrow closeOnClickOutside={false}>
                      <Popover.Target>
                        <Badge
                          size="xs"
                          variant={categoryFilter !== 'All' ? 'filled' : 'outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => { setPendingCat(categoryFilter); setCatSearch(''); setCatPopOpen(o => !o); }}
                        >
                          ▼
                        </Badge>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Stack gap="xs" style={{ width: 200 }}>
                          <TextInput
                            size="xs"
                            placeholder="Search categories…"
                            value={catSearch}
                            onChange={e => setCatSearch(e.currentTarget.value)}
                            data-testid="category-search"
                          />
                          <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                            <div
                              style={{ padding: '4px 8px', cursor: 'pointer', fontWeight: pendingCat === 'All' ? 600 : 400 }}
                              onClick={() => setPendingCat('All')}
                            >
                              All
                            </div>
                            {visibleCats.map(c => (
                              <div
                                key={c}
                                style={{ padding: '4px 8px', cursor: 'pointer', fontWeight: pendingCat === c ? 600 : 400, background: pendingCat === c ? 'rgba(34,139,230,0.15)' : 'transparent' }}
                                onClick={() => setPendingCat(c)}
                              >
                                {c}
                              </div>
                            ))}
                          </div>
                          <Button
                            size="xs"
                            onClick={() => { setCategoryFilter(pendingCat); setCatPopOpen(false); }}
                          >
                            Apply
                          </Button>
                        </Stack>
                      </Popover.Dropdown>
                    </Popover>
                  </Group>
                </Table.Th>
                <Table.Th>
                  <Group gap={4}>
                    Stock
                    <Popover opened={stockPopOpen} onChange={setStockPopOpen} position="bottom" withArrow closeOnClickOutside={false}>
                      <Popover.Target>
                        <Badge
                          size="xs"
                          variant={stockFilter !== 'All' ? 'filled' : 'outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => { setPendingStock(stockFilter); setStockPopOpen(o => !o); }}
                        >
                          ▼
                        </Badge>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Stack gap="xs" style={{ width: 160 }}>
                          <Select
                            size="xs"
                            data={stockOptions}
                            value={pendingStock}
                            onChange={v => setPendingStock(v || 'All')}
                          />
                          <Button
                            size="xs"
                            onClick={() => { setStockFilter(pendingStock); setStockPopOpen(false); }}
                          >
                            Apply
                          </Button>
                        </Stack>
                      </Popover.Dropdown>
                    </Popover>
                  </Group>
                </Table.Th>
                <Table.Th>Price</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredData.map(r => (
                <Table.Tr key={r.id}>
                  <Table.Td>{r.name}</Table.Td>
                  <Table.Td>{r.category}</Table.Td>
                  <Table.Td>{r.stock}</Table.Td>
                  <Table.Td>${r.price.toFixed(2)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Drawer>
      </div>
    </MantineProvider>
  );
}
