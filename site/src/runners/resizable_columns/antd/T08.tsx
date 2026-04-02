'use client';

/**
 * Task ID: resizable_columns-antd-T08
 * Task Name: Compact small table: set 3 column widths precisely
 *
 * Setup Description:
 * Layout: isolated_card, centered. Spacing is compact and scale is small.
 * One resizable Ant Design Table ("Inventory", compact density):
 * - Columns: SKU, Product, Qty, Location.
 * - Header padding is reduced; resize handles are thinner.
 * - Width Monitor shows: "SKU: ###px • Product: ###px • Qty: ###px".
 * - Min widths: SKU min 60px, Product min 140px, Qty min 60px.
 *
 * Initial state: SKU 120px, Product 180px, Qty 90px, Location 160px.
 *
 * Success Trigger: SKU within ±4px of 90px, Product within ±4px of 220px, Qty within ±4px of 70px.
 *
 * Theme: light, Spacing: compact, Layout: isolated_card, Placement: center, Scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table } from 'antd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

interface ColumnType {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
  minWidth?: number;
}

const ResizableTitle = (
  props: React.HTMLAttributes<HTMLElement> & {
    onResize: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    width: number;
    minWidth?: number;
  }
) => {
  const { onResize, width, minWidth, ...restProps } = props;
  const [resizing, setResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      minConstraints={minWidth ? [minWidth, 0] : undefined}
      handle={
        <span
          className="react-resizable-handle"
          style={{
            position: 'absolute',
            right: -3,
            bottom: 0,
            top: 0,
            width: 6,
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
      <th {...restProps} style={{ ...restProps.style, position: 'relative', padding: '4px 8px' }}>
        {restProps.children}
        {resizing && (
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: 0,
              background: '#1677ff',
              color: '#fff',
              padding: '1px 4px',
              borderRadius: 3,
              fontSize: 10,
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
  { key: '1', sku: 'SKU-001', product: 'Widget A', qty: 150, location: 'Warehouse A' },
  { key: '2', sku: 'SKU-002', product: 'Widget B', qty: 75, location: 'Warehouse B' },
  { key: '3', sku: 'SKU-003', product: 'Gadget X', qty: 200, location: 'Warehouse A' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<ColumnType[]>([
    { title: 'SKU', dataIndex: 'sku', key: 'sku', width: 120, minWidth: 60 },
    { title: 'Product', dataIndex: 'product', key: 'product', width: 180, minWidth: 140 },
    { title: 'Qty', dataIndex: 'qty', key: 'qty', width: 90, minWidth: 60 },
    { title: 'Location', dataIndex: 'location', key: 'location', width: 160 },
  ]);
  const successFired = useRef(false);

  const skuWidth = columns.find(c => c.key === 'sku')?.width ?? 0;
  const productWidth = columns.find(c => c.key === 'product')?.width ?? 0;
  const qtyWidth = columns.find(c => c.key === 'qty')?.width ?? 0;

  useEffect(() => {
    const skuOk = isWithinTolerance(skuWidth, 90, 4);
    const productOk = isWithinTolerance(productWidth, 220, 4);
    const qtyOk = isWithinTolerance(qtyWidth, 70, 4);
    
    if (!successFired.current && skuOk && productOk && qtyOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [skuWidth, productWidth, qtyWidth, onSuccess]);

  const handleResize = (index: number) => (
    _e: React.SyntheticEvent,
    { size }: ResizeCallbackData
  ) => {
    setColumns((prev) => {
      const next = [...prev];
      const minW = next[index].minWidth ?? 0;
      next[index] = { ...next[index], width: Math.max(size.width, minW) };
      return next;
    });
  };

  const mergedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: () => ({
      width: col.width,
      minWidth: col.minWidth,
      onResize: handleResize(index),
    }),
  }));

  return (
    <Card
      title="Inventory"
      size="small"
      style={{ width: 580 }}
      styles={{ body: { padding: 12 } }}
      data-testid="rc-table-inventory"
    >
      <div
        style={{ fontSize: 11, color: '#666', marginBottom: 8 }}
        data-testid="rc-width-monitor"
      >
        SKU: {skuWidth}px • Product: {productWidth}px • Qty: {qtyWidth}px
      </div>
      <Table
        bordered
        size="small"
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
        columns={mergedColumns}
        dataSource={tableData}
        pagination={false}
      />
    </Card>
  );
}
