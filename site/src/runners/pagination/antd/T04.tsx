'use client';

/**
 * pagination-antd-T04: Change page size to 50 per page
 * 
 * Centered isolated card titled "Products".
 * Ant Design Pagination with showSizeChanger enabled.
 * Goal is to select "50 / page" from dropdown.
 */

import React, { useState } from 'react';
import { Card, Pagination, List, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// Sample products
const products = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: `$${(Math.random() * 100).toFixed(2)}`,
}));

export default function T04({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [completed, setCompleted] = useState(false);

  const handleChange = (page: number, size: number) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
      if (size === 50 && !completed) {
        setCompleted(true);
        onSuccess();
      }
    }
  };

  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card title="Products" style={{ width: 500 }}>
      <List
        size="small"
        dataSource={paginatedProducts.slice(0, 5)} // Show only first 5 for space
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Text>{item.name}</Text>
            <Text type="secondary">{item.price}</Text>
          </List.Item>
        )}
        style={{ marginBottom: 16 }}
      />
      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        {paginatedProducts.length > 5 && `...and ${paginatedProducts.length - 5} more items`}
      </Text>
      <Pagination
        current={currentPage}
        total={200}
        pageSize={pageSize}
        onChange={handleChange}
        onShowSizeChange={handleChange}
        showSizeChanger
        pageSizeOptions={['10', '20', '50', '100']}
        data-testid="antd-pagination-products"
      />
      <div style={{ marginTop: 12 }}>
        <Text>Showing {pageSize} items per page</Text>
      </div>
    </Card>
  );
}
