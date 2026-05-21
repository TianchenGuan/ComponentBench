'use client';

/**
 * data_table_sortable-antd-T06: Wide table - scroll to Profit % and sort descending
 *
 * A single wide Ant Design Table in an isolated card titled "Sales by SKU".
 * - Spacing mode is compact.
 * - The table has many columns and uses horizontal scrolling. The first column ("SKU") is fixed.
 * - The target column "Profit %" is near the far right and not visible until scrolling.
 * - Initial state: unsorted.
 *
 * Success: Profit % sorted descending.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card } from 'antd';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../types';

interface SalesData {
  key: string;
  sku: string;
  product: string;
  category: string;
  unitsSold: number;
  revenue: number;
  cost: number;
  grossProfit: number;
  margin: number;
  profitPct: number;
}

const salesData: SalesData[] = [
  { key: '1', sku: 'SKU-001', product: 'Widget A', category: 'Electronics', unitsSold: 150, revenue: 4500, cost: 2700, grossProfit: 1800, margin: 0.4, profitPct: 12.5 },
  { key: '2', sku: 'SKU-002', product: 'Widget B', category: 'Electronics', unitsSold: 200, revenue: 8000, cost: 4000, grossProfit: 4000, margin: 0.5, profitPct: 18.2 },
  { key: '3', sku: 'SKU-003', product: 'Gadget X', category: 'Accessories', unitsSold: 75, revenue: 2250, cost: 1575, grossProfit: 675, margin: 0.3, profitPct: 8.5 },
  { key: '4', sku: 'SKU-004', product: 'Gadget Y', category: 'Accessories', unitsSold: 120, revenue: 6000, cost: 3000, grossProfit: 3000, margin: 0.5, profitPct: 22.1 },
  { key: '5', sku: 'SKU-005', product: 'Tool Pro', category: 'Tools', unitsSold: 50, revenue: 5000, cost: 2500, grossProfit: 2500, margin: 0.5, profitPct: 15.8 },
  { key: '6', sku: 'SKU-006', product: 'Tool Basic', category: 'Tools', unitsSold: 180, revenue: 3600, cost: 2160, grossProfit: 1440, margin: 0.4, profitPct: 11.2 },
  { key: '7', sku: 'SKU-007', product: 'Part Alpha', category: 'Parts', unitsSold: 300, revenue: 1500, cost: 900, grossProfit: 600, margin: 0.4, profitPct: 6.8 },
  { key: '8', sku: 'SKU-008', product: 'Part Beta', category: 'Parts', unitsSold: 250, revenue: 2500, cost: 1250, grossProfit: 1250, margin: 0.5, profitPct: 14.3 },
  { key: '9', sku: 'SKU-009', product: 'Bundle A', category: 'Bundles', unitsSold: 40, revenue: 8000, cost: 4800, grossProfit: 3200, margin: 0.4, profitPct: 25.6 },
  { key: '10', sku: 'SKU-010', product: 'Bundle B', category: 'Bundles', unitsSold: 30, revenue: 4500, cost: 2925, grossProfit: 1575, margin: 0.35, profitPct: 9.7 },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [sortedInfo, setSortedInfo] = useState<SorterResult<SalesData>>({});

  const columns: ColumnsType<SalesData> = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku', fixed: 'left', width: 100 },
    { title: 'Product', dataIndex: 'product', key: 'product', width: 120 },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 120 },
    { title: 'Units Sold', dataIndex: 'unitsSold', key: 'unitsSold', width: 100 },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 100,
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      width: 100,
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: 'Gross Profit',
      dataIndex: 'grossProfit',
      key: 'grossProfit',
      width: 110,
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: 'Margin',
      dataIndex: 'margin',
      key: 'margin',
      width: 80,
      render: (val: number) => `${(val * 100).toFixed(0)}%`,
    },
    {
      title: 'Profit %',
      dataIndex: 'profitPct',
      key: 'profit_pct',
      width: 100,
      sorter: (a, b) => a.profitPct - b.profitPct,
      sortOrder: sortedInfo.columnKey === 'profit_pct' ? sortedInfo.order : null,
      render: (val: number) => `${val.toFixed(1)}%`,
    },
  ];

  const handleChange = (_pagination: unknown, _filters: unknown, sorter: SorterResult<SalesData> | SorterResult<SalesData>[]) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo(singleSorter || {});
  };

  // Check success condition
  useEffect(() => {
    if (sortedInfo.columnKey === 'profit_pct' && sortedInfo.order === 'descend') {
      onSuccess();
    }
  }, [sortedInfo, onSuccess]);

  const sortModel: SortModel = sortedInfo.columnKey && sortedInfo.order
    ? [{ column_key: String(sortedInfo.columnKey), direction: sortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <Card style={{ width: 700 }}>
      <div style={{ marginBottom: 16, fontWeight: 500 }}>Sales by SKU</div>
      <Table
        dataSource={salesData}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="key"
        onChange={handleChange}
        scroll={{ x: 1000 }}
        data-testid="table-sales-by-sku"
        data-sort-model={JSON.stringify(sortModel)}
      />
    </Card>
  );
}
