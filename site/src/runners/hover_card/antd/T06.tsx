'use client';

/**
 * hover_card-antd-T06: Match a product preview hover card (visual reference)
 *
 * Layout: dashboard with a two-column layout (light theme, comfortable spacing).
 * - Left column: a "Target Preview" box showing a small static preview image (thumbnail-only) of the desired product hover card header.
 * - Right column: a 3-tile product grid. Each tile includes a small thumbnail image and a short SKU label.
 *
 * Each product tile has its own hover-triggered AntD Popover hover card:
 * - The hover card shows a larger thumbnail, product name, and price.
 * - All three hover cards share the same layout and typography; only the thumbnail/product content differs.
 *
 * Instances: 3 hover cards (one per product tile).
 * Initial state: all hover cards closed. No clicks are required; success is opening the card that corresponds to the Target Preview.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Popover, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const products = [
  { sku: 'SKU-147', name: 'Wireless Mouse', price: '$29.99', color: '#3b82f6' },
  { sku: 'SKU-148', name: 'Mechanical Keyboard', price: '$89.99', color: '#10b981' },
  { sku: 'SKU-149', name: 'USB-C Hub', price: '$49.99', color: '#f59e0b' },
];

// Target is SKU-148 (the green one)
const TARGET_SKU = 'SKU-148';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [activeInstance, setActiveInstance] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (activeInstance === TARGET_SKU && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeInstance, onSuccess]);

  const createHoverCardContent = (product: typeof products[0]) => (
    <div style={{ width: 200 }} data-testid={`hover-card-${product.sku}`} data-cb-instance={product.sku}>
      <div 
        style={{ 
          width: '100%', 
          height: 80, 
          backgroundColor: product.color, 
          borderRadius: 4, 
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 600
        }}
      >
        {product.sku}
      </div>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{product.name}</div>
      <div style={{ color: '#1677ff', fontWeight: 600 }}>{product.price}</div>
    </div>
  );

  const targetProduct = products.find(p => p.sku === TARGET_SKU)!;

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Target Preview */}
      <Card 
        title="Target Preview" 
        style={{ width: 180 }}
        data-testid="target-preview"
        id="target-preview"
      >
        <div 
          style={{ 
            width: '100%', 
            height: 60, 
            backgroundColor: targetProduct.color, 
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: 12
          }}
        >
          {targetProduct.sku}
        </div>
        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 8 }}>
          Find this product
        </Text>
      </Card>

      {/* Product Grid */}
      <Card title="Products" style={{ width: 350 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {products.map((product) => (
            <Popover 
              key={product.sku}
              content={createHoverCardContent(product)}
              trigger="hover"
              onOpenChange={(visible) => visible && setActiveInstance(product.sku)}
            >
              <div
                data-testid={`product-tile-${product.sku}`}
                data-cb-instance={product.sku}
                style={{ 
                  width: 100, 
                  padding: 8, 
                  border: '1px solid #e8e8e8', 
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                <div 
                  style={{ 
                    width: '100%', 
                    height: 50, 
                    backgroundColor: product.color, 
                    borderRadius: 4, 
                    marginBottom: 8 
                  }}
                />
                <Text style={{ fontSize: 11 }}>{product.sku}</Text>
              </div>
            </Popover>
          ))}
        </div>
      </Card>
    </div>
  );
}
