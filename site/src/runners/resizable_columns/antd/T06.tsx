'use client';

/**
 * Task ID: resizable_columns-antd-T06
 * Task Name: Resize Description column in invoice form section
 *
 * Setup Description:
 * Layout: form_section (Invoice editor) with low clutter.
 * - A short invoice header form (Invoice #, Customer, Currency) above the table.
 * - A section heading "Line items" followed by a resizable Ant Design Table.
 * - Columns: Item, Description, Qty, Unit price.
 * - The Description header includes a small "w=###px" badge that updates live.
 *
 * Initial state: Description starts at 240px.
 *
 * Success Trigger: Description column width is within ±8px of 320px.
 *
 * Theme: light, Spacing: comfortable, Layout: form_section, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Input, Select, Typography, Space } from 'antd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

const { Title } = Typography;

interface ColumnType {
  title: React.ReactNode;
  dataIndex: string;
  key: string;
  width: number;
  sorter?: boolean;
}

const ResizableTitle = (
  props: React.HTMLAttributes<HTMLElement> & {
    onResize: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    width: number;
  }
) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          style={{
            position: 'absolute',
            right: -5,
            bottom: 0,
            top: 0,
            width: 10,
            cursor: 'col-resize',
            zIndex: 1,
          }}
          onClick={(e) => e.stopPropagation()}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} style={{ ...restProps.style, position: 'relative' }} />
    </Resizable>
  );
};

const tableData = [
  { key: '1', item: 'Widget A', description: 'Standard widget with enhanced features', qty: 10, unitPrice: '$25.00' },
  { key: '2', item: 'Widget B', description: 'Premium widget with warranty', qty: 5, unitPrice: '$45.00' },
  { key: '3', item: 'Service Fee', description: 'Installation and setup service', qty: 1, unitPrice: '$100.00' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [descWidth, setDescWidth] = useState(240);
  const [columns, setColumns] = useState<ColumnType[]>([
    { title: 'Item', dataIndex: 'item', key: 'item', width: 120, sorter: true },
    { 
      title: <span>Description <span style={{ fontSize: 10, color: '#999' }} data-testid="rc-col-width-description">w={descWidth}px</span></span>, 
      dataIndex: 'description', 
      key: 'description', 
      width: 240,
      sorter: true,
    },
    { title: 'Qty', dataIndex: 'qty', key: 'qty', width: 80, sorter: true },
    { title: 'Unit price', dataIndex: 'unitPrice', key: 'unitPrice', width: 120, sorter: true },
  ]);
  const successFired = useRef(false);

  const currentDescWidth = columns.find(c => c.key === 'description')?.width ?? 0;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(currentDescWidth, 320, 8)) {
      successFired.current = true;
      onSuccess();
    }
  }, [currentDescWidth, onSuccess]);

  useEffect(() => {
    setDescWidth(currentDescWidth);
    setColumns(prev => prev.map(col => {
      if (col.key === 'description') {
        return {
          ...col,
          title: <span>Description <span style={{ fontSize: 10, color: '#999' }} data-testid="rc-col-width-description">w={currentDescWidth}px</span></span>,
        };
      }
      return col;
    }));
  }, [currentDescWidth]);

  const handleResize = (index: number) => (
    _e: React.SyntheticEvent,
    { size }: ResizeCallbackData
  ) => {
    setColumns((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], width: size.width };
      return next;
    });
  };

  const mergedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: () => ({
      width: col.width,
      onResize: handleResize(index),
    }),
  }));

  return (
    <Card style={{ width: 700 }} data-testid="rc-invoice-form">
      {/* Invoice header form */}
      <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
        <Space>
          <span>Invoice #:</span>
          <Input value="INV-2024-001" style={{ width: 150 }} readOnly />
        </Space>
        <Space>
          <span>Customer:</span>
          <Input value="Acme Corp" style={{ width: 200 }} readOnly />
        </Space>
        <Space>
          <span>Currency:</span>
          <Select value="USD" style={{ width: 100 }} options={[{ value: 'USD', label: 'USD' }]} />
        </Space>
      </Space>

      {/* Line items section */}
      <Title level={5}>Line items</Title>
      <Table
        bordered
        components={{ header: { cell: ResizableTitle } }}
        columns={mergedColumns}
        dataSource={tableData}
        pagination={false}
        size="small"
        data-testid="rc-table-line-items"
      />
    </Card>
  );
}
