'use client';

/**
 * Task ID: resizable_columns-antd-T01
 * Task Name: Set Amount column to 160px (single table)
 *
 * Setup Description:
 * Layout: isolated_card centered in the viewport with a single "Payments" table.
 * The table is an Ant Design Table configured with resizable columns using a composed header cell (react-resizable).
 * - Column headers: Date, Type, Note, Amount, Action.
 * - Each header has a thin vertical resize handle on its right edge (visible on hover).
 * - While dragging, a small tooltip near the pointer shows the current width in pixels.
 * - Under the table title there is a small "Width Monitor" line showing the current width of Amount.
 *
 * Initial state: Amount column starts at 120px.
 *
 * Success Trigger: Amount column width is within ±12px of 160px.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
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
  { key: '1', date: '2024-01-15', type: 'Credit', note: 'Invoice #1234', amount: '$250.00', action: 'View' },
  { key: '2', date: '2024-01-14', type: 'Debit', note: 'Refund #5678', amount: '$75.50', action: 'View' },
  { key: '3', date: '2024-01-13', type: 'Credit', note: 'Payment received', amount: '$1,200.00', action: 'View' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<ColumnType[]>([
    { title: 'Date', dataIndex: 'date', key: 'date', width: 140 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 120 },
    { title: 'Note', dataIndex: 'note', key: 'note', width: 200 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120 },
    { title: 'Action', dataIndex: 'action', key: 'action', width: 100 },
  ]);
  const successFired = useRef(false);

  const amountWidth = columns.find(c => c.key === 'amount')?.width ?? 0;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(amountWidth, 160, 12)) {
      successFired.current = true;
      onSuccess();
    }
  }, [amountWidth, onSuccess]);

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
      title="Payments"
      style={{ width: 780 }}
      data-testid="rc-table-payments"
    >
      <div
        style={{ fontSize: 12, color: '#666', marginBottom: 12 }}
        data-testid="rc-width-amount"
      >
        Amount width: {amountWidth}px
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
      />
    </Card>
  );
}
