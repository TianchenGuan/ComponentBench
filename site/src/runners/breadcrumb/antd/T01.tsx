'use client';

/**
 * breadcrumb-antd-T01: Navigate to Products (basic breadcrumb click)
 * 
 * Baseline isolated card centered in the viewport titled "Product Details".
 * At the top of the card there is an Ant Design Breadcrumb showing the path:
 * Home > Products > Electronics > Details
 * Clicking "Products" updates the card content to show "You navigated to: Products".
 */

import React, { useState } from 'react';
import { Breadcrumb, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Products') {
      onSuccess();
    }
  };

  return (
    <Card title="Product Details" style={{ width: 450 }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: (
              <a
                onClick={() => handleNavigate('Home')}
                data-testid="antd-breadcrumb-home"
                style={{ cursor: 'pointer' }}
              >
                Home
              </a>
            ),
          },
          {
            title: (
              <a
                onClick={() => handleNavigate('Products')}
                data-testid="antd-breadcrumb-products"
                style={{ cursor: 'pointer' }}
              >
                Products
              </a>
            ),
          },
          {
            title: (
              <a
                onClick={() => handleNavigate('Electronics')}
                data-testid="antd-breadcrumb-electronics"
                style={{ cursor: 'pointer' }}
              >
                Electronics
              </a>
            ),
          },
          {
            title: <span data-testid="antd-breadcrumb-details">Details</span>,
          },
        ]}
      />
      {navigated ? (
        <p style={{ color: '#52c41a', fontWeight: 500 }}>
          You navigated to: {navigated}
        </p>
      ) : (
        <p>
          You are viewing product details. Use the breadcrumb above to navigate.
        </p>
      )}
    </Card>
  );
}
