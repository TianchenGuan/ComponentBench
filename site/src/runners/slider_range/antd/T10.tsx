'use client';

/**
 * slider_range-antd-T10: Apply a price filter from a table column popover
 * 
 * Layout: table_cell. The main content is a Products table with several columns (Name, Category, Price, Stock).
 * The Price column header includes a small filter icon. Clicking it opens a compact popover titled "Price filter".
 * Inside the popover:
 * - One Ant Design range Slider labeled "Price range ($)" with min=0, max=100, step=1, range=true.
 * - A readout line "Selected: $0 – $100" updates as the slider moves, but the table results do NOT change until "Apply filter" is clicked.
 * Popover footer has two buttons: "Clear" (resets to full range) and primary "Apply filter" (commits and closes popover).
 * Other columns also have small icons and controls, creating realistic visual clutter, but they are not required for success.
 * 
 * Success: Target range is set to 25–75 USD (both thumbs), require_confirm: true with "Apply filter" button.
 */

import React, { useState, useEffect } from 'react';
import { Table, Button, Popover, Slider, Typography, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface Product {
  key: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const allProducts: Product[] = [
  { key: '1', name: 'Widget A', category: 'Electronics', price: 25, stock: 100 },
  { key: '2', name: 'Gadget B', category: 'Electronics', price: 50, stock: 75 },
  { key: '3', name: 'Tool C', category: 'Hardware', price: 35, stock: 50 },
  { key: '4', name: 'Device D', category: 'Electronics', price: 80, stock: 30 },
  { key: '5', name: 'Item E', category: 'Misc', price: 15, stock: 200 },
  { key: '6', name: 'Product F', category: 'Hardware', price: 95, stock: 10 },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [pendingRange, setPendingRange] = useState<[number, number]>([0, 100]);
  const [appliedRange, setAppliedRange] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    if (appliedRange[0] === 25 && appliedRange[1] === 75) {
      onSuccess();
    }
  }, [appliedRange, onSuccess]);

  const handleApplyFilter = () => {
    setAppliedRange(pendingRange);
    setPopoverOpen(false);
  };

  const handleClear = () => {
    setPendingRange([0, 100]);
  };

  const filteredProducts = allProducts.filter(
    (p) => p.price >= appliedRange[0] && p.price <= appliedRange[1]
  );

  const filterContent = (
    <div style={{ width: 250 }}>
      <Text strong style={{ display: 'block', marginBottom: 12 }}>Price filter</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Price range ($)</Text>
      <Slider
        range
        min={0}
        max={100}
        step={1}
        value={pendingRange}
        onChange={(val) => setPendingRange(val as [number, number])}
        data-testid="price-filter-range"
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 8, marginBottom: 16 }}>
        Selected: ${pendingRange[0]} – ${pendingRange[1]}
      </Text>
      <Space>
        <Button size="small" onClick={handleClear}>Clear</Button>
        <Button size="small" type="primary" onClick={handleApplyFilter}>Apply filter</Button>
      </Space>
    </div>
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: (
        <Space>
          Price
          <Popover
            content={filterContent}
            title={null}
            trigger="click"
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
            placement="bottomRight"
          >
            <Button 
              type="text" 
              size="small" 
              icon={<FilterOutlined />}
              data-testid="price-filter-icon"
              style={{ color: appliedRange[0] !== 0 || appliedRange[1] !== 100 ? '#1677ff' : undefined }}
            />
          </Popover>
        </Space>
      ),
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
  ];

  return (
    <div style={{ width: 600 }}>
      <Text strong style={{ display: 'block', marginBottom: 16, fontSize: 18 }}>Products</Text>
      <Table
        dataSource={filteredProducts}
        columns={columns}
        pagination={false}
        size="small"
      />
    </div>
  );
}
