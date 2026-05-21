'use client';

/**
 * Task ID: resizable_columns-antd-T07
 * Task Name: Keep Order ID column within 120–140px (bottom-right)
 *
 * Setup Description:
 * Layout: isolated_card anchored to the bottom-right of the viewport.
 * One resizable Ant Design Table ("Recent orders"):
 * - Columns: Order ID, Customer, Total, Status.
 * - A small "Order ID width: ###px" readout is shown above the table.
 *
 * Initial state: Order ID starts at 180px (too wide).
 *
 * Success Trigger: Order ID column width is between 120px and 140px (inclusive).
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: bottom_right
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table } from 'antd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../types';
import { isInRange } from '../types';

interface ColumnType {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
}

const ResizableTitle = (
  props: React.HTMLAttributes<HTMLElement> & {
    onResize: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    width: number;
  }
) => {
  const { onResize, width, ...restProps } = props;
  const [resizing, setResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);

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
      onResizeStart={() => setResizing(true)}
      onResize={(e, data) => {
        setCurrentWidth(data.size.width);
        onResize(e, data);
      }}
      onResizeStop={() => setResizing(false)}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} style={{ ...restProps.style, position: 'relative' }}>
        {restProps.children}
        {resizing && (
          <div
            style={{
              position: 'absolute',
              top: -24,
              right: 0,
              background: '#1677ff',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 11,
              zIndex: 100,
            }}
          >
            {Math.round(currentWidth)}px
          </div>
        )}
      </th>
    </Resizable>
  );
};

const tableData = [
  { key: '1', orderId: 'ORD-001', customer: 'John Doe', total: '$250.00', status: 'Shipped' },
  { key: '2', orderId: 'ORD-002', customer: 'Jane Smith', total: '$175.50', status: 'Processing' },
  { key: '3', orderId: 'ORD-003', customer: 'Bob Wilson', total: '$89.99', status: 'Delivered' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<ColumnType[]>([
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 180 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 160 },
    { title: 'Total', dataIndex: 'total', key: 'total', width: 120 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120 },
  ]);
  const successFired = useRef(false);

  const orderIdWidth = columns.find(c => c.key === 'orderId')?.width ?? 0;

  useEffect(() => {
    if (!successFired.current && isInRange(orderIdWidth, 120, 140)) {
      successFired.current = true;
      onSuccess();
    }
  }, [orderIdWidth, onSuccess]);

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
    <Card
      title="Recent orders"
      style={{ width: 620 }}
      data-testid="rc-table-recent-orders"
    >
      <div
        style={{ fontSize: 12, color: '#666', marginBottom: 12 }}
        data-testid="rc-width-order-id"
      >
        Order ID width: {orderIdWidth}px
      </div>
      <Table
        bordered
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
        columns={mergedColumns}
        dataSource={tableData}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
