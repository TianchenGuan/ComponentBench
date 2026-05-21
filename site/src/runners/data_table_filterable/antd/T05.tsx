'use client';

/**
 * data_table_filterable-antd-T05: Filter Category using filter search
 *
 * Scene context: theme=light; spacing=compact; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered. Spacing mode is compact (reduced padding/row height) while scale remains default.
 *
 * A single Ant Design Table titled "Products" with columns: SKU, Product name, Category, Price.
 *
 * Category filter: the filter dropdown popover includes a small search input at the top (filterSearch enabled) and a long
 * list of ~20 categories (e.g., Accessories, Apparel, Audio, Cameras, Chargers, etc.).
 *
 * Initial state: no active filters.
 *
 * Success: Category filter equals "Accessories" after clicking OK.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card } from 'antd';
import type { ColumnsType, FilterValue, TablePaginationConfig } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../types';

interface ProductData {
  key: string;
  sku: string;
  productName: string;
  category: string;
  price: number;
}

const productsData: ProductData[] = [
  { key: '1', sku: 'SKU-001', productName: 'Wireless Earbuds', category: 'Audio', price: 79.99 },
  { key: '2', sku: 'SKU-002', productName: 'Phone Case', category: 'Accessories', price: 19.99 },
  { key: '3', sku: 'SKU-003', productName: 'Laptop Stand', category: 'Accessories', price: 49.99 },
  { key: '4', sku: 'SKU-004', productName: 'DSLR Camera', category: 'Cameras', price: 899.00 },
  { key: '5', sku: 'SKU-005', productName: 'USB-C Charger', category: 'Chargers', price: 29.99 },
  { key: '6', sku: 'SKU-006', productName: 'Winter Jacket', category: 'Apparel', price: 149.00 },
  { key: '7', sku: 'SKU-007', productName: 'Bluetooth Speaker', category: 'Audio', price: 59.99 },
  { key: '8', sku: 'SKU-008', productName: 'Screen Protector', category: 'Accessories', price: 12.99 },
  { key: '9', sku: 'SKU-009', productName: 'Action Camera', category: 'Cameras', price: 299.00 },
  { key: '10', sku: 'SKU-010', productName: 'Running Shoes', category: 'Apparel', price: 89.99 },
];

const categoryOptions = [
  'Accessories', 'Apparel', 'Audio', 'Automotive', 'Baby', 
  'Beauty', 'Books', 'Cameras', 'Chargers', 'Computers',
  'Electronics', 'Fitness', 'Furniture', 'Garden', 'Health',
  'Home', 'Jewelry', 'Kitchen', 'Office', 'Sports'
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const successFiredRef = useRef(false);

  const columns: ColumnsType<ProductData> = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Product name', dataIndex: 'productName', key: 'productName' },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: categoryOptions.map(c => ({ text: c, value: c })),
      filteredValue: filteredInfo.category || null,
      onFilter: (value, record) => record.category === value,
      filterSearch: true,
      filterMultiple: false,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (val: number) => `$${val.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
  ];

  const handleChange = (
    _pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    setFilteredInfo(filters);
  };

  // Check success condition
  useEffect(() => {
    const categoryFilter = filteredInfo.category;
    
    if (
      categoryFilter &&
      categoryFilter.length === 1 &&
      categoryFilter[0] === 'Accessories' &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filteredInfo, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'products',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: Object.entries(filteredInfo)
      .filter(([, v]) => v && v.length > 0)
      .map(([col, values]) => ({
        column: col.charAt(0).toUpperCase() + col.slice(1),
        operator: (values?.length ?? 0) > 1 ? 'in' : 'equals' as const,
        value: values?.length === 1 ? String(values[0]) : (values as string[]),
      })),
  };

  return (
    <Card style={{ width: 800 }}>
      <div style={{ marginBottom: 12, fontWeight: 500, fontSize: 16 }}>Products</div>
      <Table
        dataSource={productsData}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="key"
        onChange={handleChange}
        data-testid="table-products"
        data-filter-model={JSON.stringify(filterModel)}
      />
    </Card>
  );
}
