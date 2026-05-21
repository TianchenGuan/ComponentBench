'use client';

/**
 * virtual_list-mantine-T03: Favorite a row item
 *
 * Layout: isolated_card centered titled "Products".
 * Target component: virtualized list within Mantine ScrollArea.
 * Row content: product label + price + a heart-shaped ActionIcon on the far right.
 * Initial state: all items are not favorited; Product 0008 is visible in the initial viewport.
 *
 * Success: Product 0008 has Favorite = true
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Text, Box, ActionIcon, Badge, Group } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../types';

interface ProductItem {
  key: string;
  id: string;
  name: string;
  price: number;
}

// Generate 100 products
const generateProducts = (): ProductItem[] => {
  const names = ['Glass Bottle', 'Ceramic Vase', 'Metal Frame', 'Wooden Box', 'Stone Coaster', 'Paper Lamp', 'Fabric Cover', 'Leather Case'];
  return Array.from({ length: 100 }, (_, i) => ({
    key: `prod-${String(i + 1).padStart(4, '0')}`,
    id: `Product ${String(i + 1).padStart(4, '0')}`,
    name: names[i % names.length],
    price: Math.floor(Math.random() * 100) + 15,
  }));
};

const products = generateProducts();

export default function T03({ onSuccess }: TaskComponentProps) {
  const [favoritedKeys, setFavoritedKeys] = useState<Set<string>>(new Set());
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 54,
    overscan: 5,
  });

  const handleToggleFavorite = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoritedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Check success condition
  useEffect(() => {
    if (favoritedKeys.has('prod-0008')) {
      onSuccess();
    }
  }, [favoritedKeys, onSuccess]);

  return (
    <Paper shadow="sm" p="md" withBorder style={{ width: 450 }} data-testid="vl-primary">
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
            const isFavorited = favoritedKeys.has(item.key);
            return (
              <div
                key={item.key}
                data-item-key={item.key}
                data-favorited={isFavorited}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  padding: '10px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Group gap="xs">
                  <Text size="sm">{item.id} — {item.name}</Text>
                  {isFavorited && <Badge size="xs" color="red">Favorited</Badge>}
                </Group>
                <Group gap="sm">
                  <Text size="sm" c="dimmed">${item.price}</Text>
                  <ActionIcon
                    variant="subtle"
                    color={isFavorited ? 'red' : 'gray'}
                    onClick={(e) => handleToggleFavorite(item.key, e)}
                    aria-pressed={isFavorited}
                    aria-label="Favorite"
                  >
                    {isFavorited ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                  </ActionIcon>
                </Group>
              </div>
            );
          })}
        </div>
      </Box>
    </Paper>
  );
}
