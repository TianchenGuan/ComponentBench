'use client';

/**
 * breadcrumb-antd-T09: Select category from dropdown in dark mode
 * 
 * Dark theme isolated card titled "Product".
 * Breadcrumb: Shop > Categories (dropdown) > Product
 * Select "Electronics" from Categories dropdown.
 */

import React, { useState } from 'react';
import { Breadcrumb, Card, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelectCategory = (category: string) => {
    if (selectedCategory) return;
    setSelectedCategory(category);
    if (category === 'Electronics') {
      onSuccess();
    }
  };

  const categoryMenuItems: MenuProps['items'] = [
    {
      key: 'clothing',
      label: 'Clothing',
      onClick: () => handleSelectCategory('Clothing'),
    },
    {
      key: 'electronics',
      label: 'Electronics',
      onClick: () => handleSelectCategory('Electronics'),
    },
    {
      key: 'books',
      label: 'Books',
      onClick: () => handleSelectCategory('Books'),
    },
  ];

  return (
    <Card
      title="Product"
      style={{
        width: 400,
        background: '#1f1f1f',
        borderColor: '#303030',
      }}
      styles={{
        header: { color: '#fff', borderBottomColor: '#303030' },
        body: { color: '#ccc' },
      }}
    >
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: <span style={{ color: '#91caff' }}>Shop</span>,
          },
          {
            title: (
              <Dropdown
                menu={{ items: categoryMenuItems }}
                trigger={['click']}
                overlayStyle={{ minWidth: 120 }}
              >
                <a
                  onClick={(e) => e.preventDefault()}
                  data-testid="antd-breadcrumb-categories-dropdown"
                  style={{ cursor: 'pointer', color: '#91caff' }}
                >
                  Categories <DownOutlined style={{ fontSize: 10 }} />
                </a>
              </Dropdown>
            ),
          },
          {
            title: <span style={{ color: '#888' }}>Product</span>,
          },
        ]}
      />
      {selectedCategory ? (
        <p style={{ color: '#52c41a', fontWeight: 500 }}>
          Selected category: {selectedCategory}
        </p>
      ) : (
        <p>
          Click "Categories" to select a category.
        </p>
      )}
    </Card>
  );
}
