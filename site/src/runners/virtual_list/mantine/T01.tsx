'use client';

/**
 * virtual_list-mantine-T01: Select a visible product row
 *
 * Layout: isolated_card — a centered Mantine Paper/Card titled "Products".
 * Target component: a virtualized list built with Mantine ScrollArea (h≈360px) as the scroll container
 * and @tanstack/react-virtual for row virtualization.
 * Row content: "Product #### — <name>" with a small price on the right.
 * Initial state: list at the top; no selection.
 *
 * Success: Select row with key 'prod-0012'
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Group, Box, Stack } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../types';

interface ProductItem {
  key: string;
  id: string;
  name: string;
  price: number;
}

// Generate 200 products
const generateProducts = (): ProductItem[] => {
  const names = ['Cedar Mug', 'Oak Table', 'Pine Chair', 'Maple Desk', 'Birch Shelf', 'Walnut Bowl', 'Cherry Frame', 'Ash Stool'];
  return Array.from({ length: 200 }, (_, i) => {
    const num = i + 1;
    let name = names[i % names.length];
    if (num === 12) name = 'Cedar Mug';
    return {
      key: `prod-${String(num).padStart(4, '0')}`,
      id: `Product ${String(num).padStart(4, '0')}`,
      name,
      price: Math.floor(Math.random() * 200) + 10,
    };
  });
};

const products = generateProducts();

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  // Check success condition
  useEffect(() => {
    if (selectedKey === 'prod-0012') {
      onSuccess();
    }
  }, [selectedKey, onSuccess]);

  return (
    <Paper shadow="sm" p="md" withBorder style={{ width: 400 }} data-testid="vl-primary">
      <Text fw={600} size="lg" mb="sm">Products</Text>
      
      <Box
        ref={parentRef}
        style={{
          height: 360,
          overflow: 'auto',
          border: '1px solid #e9ecef',
          borderRadius: 4,
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
            const item = products[virtualRow.index];
            return (
              <div
                key={item.key}
                data-item-key={item.key}
                data-selected={selectedKey === item.key}
                aria-selected={selectedKey === item.key}
                onClick={() => setSelectedKey(item.key)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: selectedKey === item.key ? '#e7f5ff' : 'transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text size="sm">{item.id} — {item.name}</Text>
                <Text size="sm" c="dimmed">${item.price}</Text>
              </div>
            );
          })}
        </div>
      </Box>

      <Text size="sm" c="dimmed" mt="sm">
        Selected: {selectedKey ? products.find(p => p.key === selectedKey)?.id : 'none'}
      </Text>
    </Paper>
  );
}
