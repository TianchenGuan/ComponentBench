'use client';

/**
 * search_input-mantine-T07: Dark dashboard: submit a PO code in the Orders search (3 instances)
 *
 * Isolated card centered in the viewport in dark theme titled "Quick filters".
 * The card contains three Mantine TextInput search fields placed side-by-side (instances=3), each with a left search icon and a rightSection ActionIcon button labeled "Search":
 *   • "Products search"
 *   • "Orders search"
 *   • "Customers search"
 * Initial state: Products search contains "PO-0008" (distractor); Orders and Customers are empty.
 * Feedback: clicking the Search button inside Orders search shows an inline badge under that field: "Applied: PO-000812".
 * No extra clutter outside these inputs.
 *
 * Success: Among the three search inputs, the instance labeled "Orders search" has submitted_query "PO-000812" after clicking its Search button.
 */

import React, { useState, useRef } from 'react';
import { Card, TextInput, Text, ActionIcon, Group, Badge } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [productsValue, setProductsValue] = useState('PO-0008');
  const [ordersValue, setOrdersValue] = useState('');
  const [customersValue, setCustomersValue] = useState('');
  const [ordersSubmitted, setOrdersSubmitted] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleOrdersSearch = () => {
    setOrdersSubmitted(ordersValue);
    if (ordersValue === 'PO-000812' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      style={{ 
        width: 700, 
        background: '#1f1f1f', 
        borderColor: '#303030' 
      }}
    >
      <Text fw={600} size="lg" mb="md" c="white">Quick filters</Text>
      
      <Group grow align="flex-start">
        <div>
          <TextInput
            label="Products search"
            placeholder="Search products…"
            value={productsValue}
            onChange={(e) => setProductsValue(e.target.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
              <ActionIcon variant="subtle" size="sm" onClick={() => {}}>
                <IconSearch size={14} />
              </ActionIcon>
            }
            data-testid="search-products"
            styles={{
              label: { color: '#fff' },
              input: { backgroundColor: '#2a2a2a', borderColor: '#404040', color: '#fff' },
            }}
          />
        </div>

        <div>
          <TextInput
            label="Orders search"
            placeholder="Search orders…"
            value={ordersValue}
            onChange={(e) => setOrdersValue(e.target.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
              <ActionIcon variant="subtle" size="sm" onClick={handleOrdersSearch} aria-label="Search orders">
                <IconSearch size={14} />
              </ActionIcon>
            }
            data-testid="search-orders"
            styles={{
              label: { color: '#fff' },
              input: { backgroundColor: '#2a2a2a', borderColor: '#404040', color: '#fff' },
            }}
          />
          {ordersSubmitted && (
            <Badge color="blue" mt="xs">Applied: {ordersSubmitted}</Badge>
          )}
        </div>

        <div>
          <TextInput
            label="Customers search"
            placeholder="Search customers…"
            value={customersValue}
            onChange={(e) => setCustomersValue(e.target.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
              <ActionIcon variant="subtle" size="sm" onClick={() => {}}>
                <IconSearch size={14} />
              </ActionIcon>
            }
            data-testid="search-customers"
            styles={{
              label: { color: '#fff' },
              input: { backgroundColor: '#2a2a2a', borderColor: '#404040', color: '#fff' },
            }}
          />
        </div>
      </Group>
    </Card>
  );
}
