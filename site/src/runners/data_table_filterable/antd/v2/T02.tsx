'use client';

/**
 * data_table_filterable-antd-v2-T02: Drawer inventory – scroll to hidden Region filter and apply
 *
 * A right-side drawer containing a wide AntD Table ("Inventory") with a fixed first column and many
 * narrow columns. Region is off-screen right; the user must horizontally scroll, open the Region
 * filterSearch dropdown, select LATAM, and click OK. Dark theme, compact spacing.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Drawer, Button, ConfigProvider, theme as antTheme } from 'antd';
import type { ColumnsType, FilterValue, TablePaginationConfig } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../../types';

interface InventoryRow {
  key: string;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  qty: number;
  price: number;
  supplier: string;
  leadTime: string;
  region: string;
}

const regionOptions = ['NA', 'EMEA', 'APAC', 'LATAM'];

const inventoryData: InventoryRow[] = [
  { key: '1', sku: 'INV-001', name: 'Widget A', category: 'Hardware', warehouse: 'WH-East', qty: 500, price: 12.5, supplier: 'Acme Co', leadTime: '5d', region: 'NA' },
  { key: '2', sku: 'INV-002', name: 'Gadget B', category: 'Electronics', warehouse: 'WH-West', qty: 120, price: 45.0, supplier: 'TechCorp', leadTime: '10d', region: 'APAC' },
  { key: '3', sku: 'INV-003', name: 'Sensor C', category: 'IoT', warehouse: 'WH-South', qty: 340, price: 8.75, supplier: 'SensiTech', leadTime: '7d', region: 'LATAM' },
  { key: '4', sku: 'INV-004', name: 'Module D', category: 'Hardware', warehouse: 'WH-North', qty: 80, price: 99.0, supplier: 'Acme Co', leadTime: '14d', region: 'EMEA' },
  { key: '5', sku: 'INV-005', name: 'Adapter E', category: 'Accessories', warehouse: 'WH-East', qty: 1000, price: 3.5, supplier: 'LinkParts', leadTime: '3d', region: 'NA' },
  { key: '6', sku: 'INV-006', name: 'Board F', category: 'Electronics', warehouse: 'WH-West', qty: 60, price: 150.0, supplier: 'ChipWorks', leadTime: '21d', region: 'LATAM' },
  { key: '7', sku: 'INV-007', name: 'Relay G', category: 'IoT', warehouse: 'WH-South', qty: 210, price: 22.0, supplier: 'SensiTech', leadTime: '5d', region: 'APAC' },
  { key: '8', sku: 'INV-008', name: 'Cable H', category: 'Accessories', warehouse: 'WH-North', qty: 750, price: 1.99, supplier: 'LinkParts', leadTime: '2d', region: 'EMEA' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const successFiredRef = useRef(false);

  const columns: ColumnsType<InventoryRow> = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku', fixed: 'left', width: 100 },
    { title: 'Name', dataIndex: 'name', key: 'name', width: 120 },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 110 },
    { title: 'Warehouse', dataIndex: 'warehouse', key: 'warehouse', width: 110 },
    { title: 'Qty', dataIndex: 'qty', key: 'qty', width: 80 },
    { title: 'Price', dataIndex: 'price', key: 'price', width: 90, render: (v: number) => `$${v.toFixed(2)}` },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier', width: 120 },
    { title: 'Lead Time', dataIndex: 'leadTime', key: 'leadTime', width: 90 },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      width: 110,
      filters: regionOptions.map(r => ({ text: r, value: r })),
      filteredValue: filteredInfo.region || null,
      onFilter: (value, record) => record.region === value,
      filterSearch: true,
      filterMultiple: false,
    },
  ];

  const handleChange = (_p: TablePaginationConfig, filters: Record<string, FilterValue | null>) => {
    setFilteredInfo(filters);
  };

  useEffect(() => {
    if (successFiredRef.current) return;
    const r = filteredInfo.region;
    const otherFilters = Object.entries(filteredInfo).filter(([k, v]) => k !== 'region' && v && v.length > 0);
    if (r && r.length === 1 && r[0] === 'LATAM' && otherFilters.length === 0) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filteredInfo, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'inventory',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: Object.entries(filteredInfo)
      .filter(([, v]) => v && v.length > 0)
      .map(([col, values]) => ({
        column: col.charAt(0).toUpperCase() + col.slice(1),
        operator: (values?.length ?? 0) > 1 ? 'in' : ('equals' as const),
        value: values?.length === 1 ? String(values[0]) : (values as string[]),
      })),
  };

  return (
    <ConfigProvider theme={{ algorithm: antTheme.darkAlgorithm }}>
      <div style={{ padding: 16, background: '#141414', minHeight: 400 }}>
        <Button type="primary" size="small" onClick={() => setDrawerOpen(true)}>
          Open Inventory
        </Button>

        <Drawer
          title="Inventory"
          placement="right"
          width={720}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Table<InventoryRow>
            dataSource={inventoryData}
            columns={columns}
            pagination={false}
            size="small"
            rowKey="key"
            scroll={{ x: 1050 }}
            onChange={handleChange}
            data-testid="table-inventory"
            data-filter-model={JSON.stringify(filterModel)}
          />
        </Drawer>
      </div>
    </ConfigProvider>
  );
}
