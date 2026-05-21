'use client';

/**
 * data_grid_row_selection-antd-T04: Select all rows using header checkbox
 *
 * A centered isolated card titled "Inventory" contains an Ant Design Table with a checkbox selection column
 * and a select-all checkbox in the header of that column.
 * Spacing is comfortable and size is default. The table has exactly 5 visible rows with columns: SKU, Item, Stock.
 * Initial state: no rows selected. There is no pagination and no other controls.
 * Selecting all rows can be done by clicking the header checkbox (which sets all row checkboxes to checked).
 *
 * Success: selected_row_ids equals ['sku_S001', 'sku_S002', 'sku_S003', 'sku_S004', 'sku_S005']
 */

import React, { useState, useEffect } from 'react';
import { Table, Card } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface InventoryData {
  key: string;
  sku: string;
  item: string;
  stock: number;
}

const inventoryData: InventoryData[] = [
  { key: 'sku_S001', sku: 'SKU-S001', item: 'Widget Alpha', stock: 150 },
  { key: 'sku_S002', sku: 'SKU-S002', item: 'Widget Beta', stock: 85 },
  { key: 'sku_S003', sku: 'SKU-S003', item: 'Gadget Pro', stock: 200 },
  { key: 'sku_S004', sku: 'SKU-S004', item: 'Gadget Basic', stock: 42 },
  { key: 'sku_S005', sku: 'SKU-S005', item: 'Tool Standard', stock: 63 },
];

const allRowKeys = inventoryData.map(d => d.key);

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<InventoryData> = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Item', dataIndex: 'item', key: 'item' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
  ];

  const rowSelection: TableRowSelection<InventoryData> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedRowKeys as string[], allRowKeys)) {
      onSuccess();
    }
  }, [selectedRowKeys, onSuccess]);

  return (
    <Card style={{ width: 500 }}>
      <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 16 }}>Inventory</div>
      <Table
        dataSource={inventoryData}
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        size="middle"
        rowKey="key"
        data-testid="inventory-table"
        data-selected-row-ids={JSON.stringify(selectedRowKeys)}
      />
    </Card>
  );
}
