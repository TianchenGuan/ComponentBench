'use client';

/**
 * virtual_list-mantine-T02: Scroll until a specific product is visible
 *
 * Layout: isolated_card centered titled "Products".
 * Target component: Mantine ScrollArea with tanstack virtual rows; ~800 products total.
 * Initial state: scrolled to top (Product 0001…).
 *
 * Success: Product 0045 (key 'prod-0045') is visible (at least 60% in viewport)
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Paper, Text, Box } from '@mantine/core';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import type { TaskComponentProps } from '../types';

interface ProductItem {
  key: string;
  id: string;
  name: string;
}

// Generate 800 products
const generateProducts = (): ProductItem[] => {
  const names = ['Linen Tote', 'Cotton Bag', 'Canvas Pack', 'Silk Scarf', 'Wool Wrap', 'Hemp Pouch', 'Bamboo Case', 'Cork Wallet'];
  return Array.from({ length: 800 }, (_, i) => {
    const num = i + 1;
    let name = names[i % names.length];
    if (num === 45) name = 'Linen Tote';
    return {
      key: `prod-${String(num).padStart(4, '0')}`,
      id: `Product ${String(num).padStart(4, '0')}`,
      name,
    };
  });
};

const products = generateProducts();

export default function T02({ onSuccess }: TaskComponentProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  const checkVisibility = useCallback(() => {
    if (hasCompleted || !parentRef.current) return;
    
    const targetElement = parentRef.current.querySelector('[data-item-key="prod-0045"]');
    const container = parentRef.current;
    
    if (targetElement) {
      const itemRect = targetElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const visibleTop = Math.max(itemRect.top, containerRect.top);
      const visibleBottom = Math.min(itemRect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const itemHeight = itemRect.height;
      
      if (itemHeight > 0 && visibleHeight / itemHeight >= 0.6) {
        setHasCompleted(true);
        onSuccess();
      }
    }
  }, [hasCompleted, onSuccess]);

  useEffect(() => {
    const interval = setInterval(checkVisibility, 100);
    return () => clearInterval(interval);
  }, [checkVisibility]);

  return (
    <Paper shadow="sm" p="md" withBorder style={{ width: 400 }} data-testid="vl-primary">
      <Text fw={600} size="lg" mb="sm">Products</Text>
      
      <Box
        ref={parentRef}
        onScroll={checkVisibility}
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
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Text size="sm">{item.id} — {item.name}</Text>
              </div>
            );
          })}
        </div>
      </Box>
    </Paper>
  );
}
