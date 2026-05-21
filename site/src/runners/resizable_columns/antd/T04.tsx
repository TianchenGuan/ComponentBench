'use client';

/**
 * Task ID: resizable_columns-antd-T04
 * Task Name: Set Type column to 140px (dark theme)
 *
 * Setup Description:
 * Layout: isolated_card in dark theme, centered.
 * One Ant Design Table with resizable columns.
 * - Headers: Date, Type, Note, Amount, Action.
 * - Dark header background; resize handles appear as lighter vertical grips on hover.
 * - A "Width Monitor" line under the header displays "Type width: ###px".
 *
 * Initial state: Type column starts at 110px.
 *
 * Success Trigger: Type column width is within ±12px of 140px.
 *
 * Theme: dark, Spacing: comfortable, Layout: isolated_card, Placement: center
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
            background: 'rgba(255,255,255,0.1)',
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

export default function T04({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<ColumnType[]>([
    { title: 'Date', dataIndex: 'date', key: 'date', width: 140 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 110 },
    { title: 'Note', dataIndex: 'note', key: 'note', width: 200 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120 },
    { title: 'Action', dataIndex: 'action', key: 'action', width: 100 },
  ]);
  const successFired = useRef(false);

  const typeWidth = columns.find(c => c.key === 'type')?.width ?? 0;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(typeWidth, 140, 12)) {
      successFired.current = true;
      onSuccess();
    }
  }, [typeWidth, onSuccess]);

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
      style={{ width: 770, background: '#1f1f1f' }}
      styles={{ header: { color: '#fff' }, body: { background: '#1f1f1f' } }}
      data-testid="rc-table-payments"
    >
      <div
        style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}
        data-testid="rc-width-type"
      >
        Type width: {typeWidth}px
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
