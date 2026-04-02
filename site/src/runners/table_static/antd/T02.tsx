'use client';

/**
 * table_static-antd-T02: Select a specific cell (row × column)
 *
 * An isolated card contains a read-only Pricing table (Ant Design Table) centered on the page. Columns
 * are: Item, Seats, Price, and Billing. Rows include "Starter Plan", "Studio Plan", and "Enterprise". Clicking a cell sets
 * a visible focus ring around that cell and marks it as the table's active cell (data-cb-active-cell). The table is not
 * sortable and has no pagination. Initial state: the active cell is on the header row (none of the body cells are active).
 */

import React, { useState } from 'react';
import { Table, Card } from 'antd';
import type { TaskComponentProps } from '../types';

interface PricingData {
  key: string;
  item: string;
  seats: string;
  price: string;
  billing: string;
}

const pricingData: PricingData[] = [
  { key: 'Starter Plan', item: 'Starter Plan', seats: '1-5', price: '$29/mo', billing: 'Monthly' },
  { key: 'Studio Plan', item: 'Studio Plan', seats: '6-20', price: '$79/mo', billing: 'Monthly' },
  { key: 'Enterprise', item: 'Enterprise', seats: 'Unlimited', price: '$299/mo', billing: 'Annual' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [activeCell, setActiveCell] = useState<{ rowKey: string; columnKey: string } | null>(null);

  const handleCellClick = (rowKey: string, columnKey: string) => {
    setActiveCell({ rowKey, columnKey });
    if (rowKey === 'Studio Plan' && columnKey === 'price') {
      onSuccess();
    }
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      onCell: (record: PricingData) => ({
        onClick: () => handleCellClick(record.key, 'item'),
        style: {
          cursor: 'pointer',
          outline: activeCell?.rowKey === record.key && activeCell?.columnKey === 'item' ? '2px solid #1890ff' : undefined,
          outlineOffset: -2,
        },
      }),
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
      key: 'seats',
      onCell: (record: PricingData) => ({
        onClick: () => handleCellClick(record.key, 'seats'),
        style: {
          cursor: 'pointer',
          outline: activeCell?.rowKey === record.key && activeCell?.columnKey === 'seats' ? '2px solid #1890ff' : undefined,
          outlineOffset: -2,
        },
      }),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      onCell: (record: PricingData) => ({
        onClick: () => handleCellClick(record.key, 'price'),
        style: {
          cursor: 'pointer',
          outline: activeCell?.rowKey === record.key && activeCell?.columnKey === 'price' ? '2px solid #1890ff' : undefined,
          outlineOffset: -2,
        },
      }),
    },
    {
      title: 'Billing',
      dataIndex: 'billing',
      key: 'billing',
      onCell: (record: PricingData) => ({
        onClick: () => handleCellClick(record.key, 'billing'),
        style: {
          cursor: 'pointer',
          outline: activeCell?.rowKey === record.key && activeCell?.columnKey === 'billing' ? '2px solid #1890ff' : undefined,
          outlineOffset: -2,
        },
      }),
    },
  ];

  return (
    <Card style={{ width: 600 }} data-cb-active-cell={activeCell ? `${activeCell.rowKey}|${activeCell.columnKey}` : undefined}>
      <div style={{ marginBottom: 16, fontWeight: 500 }}>Pricing</div>
      <Table
        dataSource={pricingData}
        columns={columns}
        pagination={false}
        size="middle"
        rowKey="key"
      />
    </Card>
  );
}
