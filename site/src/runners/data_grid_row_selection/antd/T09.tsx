'use client';

/**
 * data_grid_row_selection-antd-T09: Match a reference chip list to select SKUs
 *
 * The UI is an isolated card centered on the page in compact spacing mode (tighter row height and smaller
 * checkboxes).
 * The card is split into two columns:
 *   • Left: an Ant Design Table titled "SKUs" with checkbox row selection and 20 visible rows.
 *   • Right: a small reference panel titled "Pick these SKUs" that displays three colored chips (tags) with
 *     the exact SKU codes to select.
 * The table columns are SKU Code, Description, Category. Many rows share similar prefixes (e.g., SKU-1A6,
 * SKU-1A7, SKU-1A8), creating confusable distractors.
 * Initial state: no rows are selected. There is no pagination and no Apply step; selection updates
 * immediately and each selected row checkbox becomes checked.
 * Guidance is mixed: the user matches the visual chips to the textual SKU codes in the table.
 *
 * Success: selected_row_ids equals ['sku_1A7', 'sku_1B7', 'sku_2A7']
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Tag } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface SkuData {
  key: string;
  skuCode: string;
  description: string;
  category: string;
}

const skusData: SkuData[] = [
  { key: 'sku_1A5', skuCode: 'SKU-1A5', description: 'Widget Alpha 5', category: 'Electronics' },
  { key: 'sku_1A6', skuCode: 'SKU-1A6', description: 'Widget Alpha 6', category: 'Electronics' },
  { key: 'sku_1A7', skuCode: 'SKU-1A7', description: 'Widget Alpha 7', category: 'Electronics' },
  { key: 'sku_1A8', skuCode: 'SKU-1A8', description: 'Widget Alpha 8', category: 'Electronics' },
  { key: 'sku_1A9', skuCode: 'SKU-1A9', description: 'Widget Alpha 9', category: 'Electronics' },
  { key: 'sku_1B5', skuCode: 'SKU-1B5', description: 'Widget Beta 5', category: 'Electronics' },
  { key: 'sku_1B6', skuCode: 'SKU-1B6', description: 'Widget Beta 6', category: 'Electronics' },
  { key: 'sku_1B7', skuCode: 'SKU-1B7', description: 'Widget Beta 7', category: 'Electronics' },
  { key: 'sku_1B8', skuCode: 'SKU-1B8', description: 'Widget Beta 8', category: 'Electronics' },
  { key: 'sku_1B9', skuCode: 'SKU-1B9', description: 'Widget Beta 9', category: 'Electronics' },
  { key: 'sku_2A5', skuCode: 'SKU-2A5', description: 'Gadget Alpha 5', category: 'Accessories' },
  { key: 'sku_2A6', skuCode: 'SKU-2A6', description: 'Gadget Alpha 6', category: 'Accessories' },
  { key: 'sku_2A7', skuCode: 'SKU-2A7', description: 'Gadget Alpha 7', category: 'Accessories' },
  { key: 'sku_2A8', skuCode: 'SKU-2A8', description: 'Gadget Alpha 8', category: 'Accessories' },
  { key: 'sku_2A9', skuCode: 'SKU-2A9', description: 'Gadget Alpha 9', category: 'Accessories' },
  { key: 'sku_2B5', skuCode: 'SKU-2B5', description: 'Gadget Beta 5', category: 'Accessories' },
  { key: 'sku_2B6', skuCode: 'SKU-2B6', description: 'Gadget Beta 6', category: 'Accessories' },
  { key: 'sku_2B7', skuCode: 'SKU-2B7', description: 'Gadget Beta 7', category: 'Accessories' },
  { key: 'sku_2B8', skuCode: 'SKU-2B8', description: 'Gadget Beta 8', category: 'Accessories' },
  { key: 'sku_2B9', skuCode: 'SKU-2B9', description: 'Gadget Beta 9', category: 'Accessories' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<SkuData> = [
    { title: 'SKU Code', dataIndex: 'skuCode', key: 'skuCode', width: 100 },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 100 },
  ];

  const rowSelection: TableRowSelection<SkuData> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedRowKeys as string[], ['sku_1A7', 'sku_1B7', 'sku_2A7'])) {
      onSuccess();
    }
  }, [selectedRowKeys, onSuccess]);

  return (
    <Card style={{ width: 700 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        {/* SKUs Table */}
        <div style={{ flex: 2 }}>
          <div style={{ fontWeight: 500, marginBottom: 12 }}>SKUs</div>
          <Table
            dataSource={skusData}
            columns={columns}
            rowSelection={rowSelection}
            pagination={false}
            size="small"
            rowKey="key"
            scroll={{ y: 400 }}
            data-testid="skus-table"
            data-selected-row-ids={JSON.stringify(selectedRowKeys)}
          />
        </div>

        {/* Reference panel */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, marginBottom: 12 }}>Pick these SKUs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Tag color="blue">SKU-1A7</Tag>
            <Tag color="green">SKU-1B7</Tag>
            <Tag color="orange">SKU-2A7</Tag>
          </div>
        </div>
      </div>
    </Card>
  );
}
