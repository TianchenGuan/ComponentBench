'use client';

/**
 * Task ID: resizable_columns-antd-T03
 * Task Name: Reset table column widths to default
 *
 * Setup Description:
 * Layout: isolated_card, centered.
 * One resizable Ant Design Table with a small toolbar above it:
 * - Toolbar buttons: "Reset widths" (primary), "Export CSV" (secondary, distractor).
 * - Table headers: Date, Type, Note, Amount, Action.
 * - Width Monitor shows all five widths.
 *
 * Default layout: Date 140px, Type 120px, Note 200px, Amount 120px, Action 100px.
 * Initial state (customized): Date 140px, Type 120px, Note 280px, Amount 80px, Action 100px.
 *
 * Success Trigger: All column widths match the default layout exactly.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, Space, message } from 'antd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../types';
import { allWidthsExactMatch } from '../types';

interface ColumnType {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
}

const defaultWidths: Record<string, number> = {
  date: 140,
  type: 120,
  note: 200,
  amount: 120,
  action: 100,
};

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
  { key: '1', date: '2024-01-15', type: 'Credit', note: 'Invoice #1234', amount: '$250.00', action: 'View' },
  { key: '2', date: '2024-01-14', type: 'Debit', note: 'Refund #5678', amount: '$75.50', action: 'View' },
  { key: '3', date: '2024-01-13', type: 'Credit', note: 'Payment received', amount: '$1,200.00', action: 'View' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<ColumnType[]>([
    { title: 'Date', dataIndex: 'date', key: 'date', width: 140 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 120 },
    { title: 'Note', dataIndex: 'note', key: 'note', width: 280 }, // Customized
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 80 }, // Customized
    { title: 'Action', dataIndex: 'action', key: 'action', width: 100 },
  ]);
  const successFired = useRef(false);

  const currentWidths: Record<string, number> = {};
  columns.forEach(c => {
    currentWidths[c.key] = c.width;
  });

  useEffect(() => {
    if (!successFired.current && allWidthsExactMatch(currentWidths, defaultWidths)) {
      successFired.current = true;
      onSuccess();
    }
  }, [currentWidths, onSuccess]);

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

  const handleReset = () => {
    setColumns(prev => prev.map(col => ({
      ...col,
      width: defaultWidths[col.key] ?? col.width,
    })));
    message.success('Column widths reset');
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
      style={{ width: 820 }}
      data-testid="rc-table-payments"
    >
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={handleReset} data-testid="rc-reset-widths">
          Reset widths
        </Button>
        <Button data-testid="rc-export-csv">Export CSV</Button>
      </Space>
      <div style={{ fontSize: 11, color: '#999', marginBottom: 8 }}>
        Default: Date 140px, Type 120px, Note 200px, Amount 120px, Action 100px
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
      <div
        style={{ fontSize: 12, color: '#666', marginTop: 12 }}
        data-testid="rc-width-monitor"
      >
        Date: {currentWidths.date}px • Type: {currentWidths.type}px • Note: {currentWidths.note}px • Amount: {currentWidths.amount}px • Action: {currentWidths.action}px
      </div>
    </Card>
  );
}
