'use client';

/**
 * slider_range-antd-v2-T10: Products table — Filters popover with Price and Weight ranges
 *
 * Success: committed Price 50–150 USD, Weight 0–50 kg, after Apply.
 */

import React, { useState, useEffect } from 'react';
import { Button, Input, Popover, Slider, Space, Table, Typography } from 'antd';
import { ExportOutlined, SearchOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface Product {
  key: string;
  name: string;
  category: string;
  price: number;
  weightKg: number;
}

const rows: Product[] = [
  { key: '1', name: 'Widget A', category: 'Electronics', price: 60, weightKg: 12 },
  { key: '2', name: 'Gadget B', category: 'Electronics', price: 120, weightKg: 8 },
  { key: '3', name: 'Tool C', category: 'Hardware', price: 90, weightKg: 22 },
  { key: '4', name: 'Device D', category: 'Electronics', price: 180, weightKg: 5 },
  { key: '5', name: 'Item E', category: 'Misc', price: 40, weightKg: 35 },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pendingPrice, setPendingPrice] = useState<[number, number]>([0, 200]);
  const [pendingWeight, setPendingWeight] = useState<[number, number]>([0, 50]);
  const [committedPrice, setCommittedPrice] = useState<[number, number]>([0, 200]);
  const [committedWeight, setCommittedWeight] = useState<[number, number]>([0, 50]);

  useEffect(() => {
    if (committedPrice[0] === 50 && committedPrice[1] === 150 && committedWeight[0] === 0 && committedWeight[1] === 50) {
      onSuccess();
    }
  }, [committedPrice, committedWeight, onSuccess]);

  const apply = () => {
    setCommittedPrice(pendingPrice);
    setCommittedWeight(pendingWeight);
    setFiltersOpen(false);
  };

  const reset = () => {
    setPendingPrice([0, 200]);
    setPendingWeight([0, 50]);
  };

  const filtered = rows.filter(
    (p) =>
      p.price >= committedPrice[0] &&
      p.price <= committedPrice[1] &&
      p.weightKg >= committedWeight[0] &&
      p.weightKg <= committedWeight[1]
  );

  const filterPanel = (
    <div style={{ width: 280 }}>
      <Text strong style={{ display: 'block', marginBottom: 12 }}>
        Price ($)
      </Text>
      <Slider
        range
        min={0}
        max={200}
        step={5}
        value={pendingPrice}
        onChange={(v) => setPendingPrice(v as [number, number])}
        data-testid="price-filter-range"
      />
      <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
        Pending: ${pendingPrice[0]} – ${pendingPrice[1]}
      </Text>

      <Text strong style={{ display: 'block', marginBottom: 12 }}>
        Weight (kg)
      </Text>
      <Slider
        range
        min={0}
        max={50}
        step={1}
        value={pendingWeight}
        onChange={(v) => setPendingWeight(v as [number, number])}
        data-testid="weight-filter-range"
      />
      <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
        Pending: {pendingWeight[0]} – {pendingWeight[1]} kg
      </Text>

      <Space>
        <Button size="small" onClick={reset}>
          Reset
        </Button>
        <Button size="small" type="primary" onClick={apply}>
          Apply
        </Button>
      </Space>
    </div>
  );

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (p: number) => `$${p}` },
    { title: 'Weight (kg)', dataIndex: 'weightKg', key: 'weightKg' },
  ];

  return (
    <div style={{ width: 640 }}>
      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 16 }}>
        Products
      </Text>
      <Space wrap style={{ marginBottom: 8 }}>
        <Input
          size="small"
          placeholder="Search products"
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          disabled
        />
        <Popover
          content={filterPanel}
          title="Filters"
          trigger="click"
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          placement="bottomLeft"
        >
          <Button size="small" type={filtersOpen ? 'primary' : 'default'}>
            Filters
          </Button>
        </Popover>
        <Button size="small" icon={<ExportOutlined />}>
          Export
        </Button>
        <TagPill />
      </Space>
      <Table dataSource={filtered} columns={columns} size="small" pagination={{ pageSize: 4 }} />
      <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
        Applied: Price ${committedPrice[0]}–${committedPrice[1]} · Weight {committedWeight[0]}–{committedWeight[1]} kg
      </Text>
    </div>
  );
}

function TagPill() {
  return (
    <Space size={4}>
      <span
        style={{
          fontSize: 11,
          padding: '2px 8px',
          borderRadius: 10,
          background: '#f0f0f0',
          color: '#666',
        }}
      >
        SKU sync
      </span>
      <span
        style={{
          fontSize: 11,
          padding: '2px 8px',
          borderRadius: 10,
          background: '#e6f4ff',
          color: '#1677ff',
        }}
      >
        Live
      </span>
    </Space>
  );
}
