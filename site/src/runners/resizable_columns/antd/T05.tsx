'use client';

/**
 * Task ID: resizable_columns-antd-T05
 * Task Name: Resize Reason column in Secondary table to 220px
 *
 * Setup Description:
 * Layout: isolated_card, centered, containing two stacked resizable tables (instances=2).
 * Table A label: "Primary (Payments)" - Columns: Date, Customer, Amount, Status.
 * Table B label: "Secondary (Refunds)" (target instance) - Columns: Date, Amount, Reason, Agent.
 * Each table has its own Width Monitor line.
 *
 * Initial state: Secondary.Reason starts at 160px.
 *
 * Success Trigger: In Secondary (Refunds), Reason column width is within ±8px of 220px.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography } from 'antd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

const { Title } = Typography;

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

const primaryData = [
  { key: '1', date: '2024-01-15', customer: 'John Doe', amount: '$250.00', status: 'Completed' },
  { key: '2', date: '2024-01-14', customer: 'Jane Smith', amount: '$75.50', status: 'Pending' },
];

const secondaryData = [
  { key: '1', date: '2024-01-15', amount: '$50.00', reason: 'Defective product', agent: 'Mike' },
  { key: '2', date: '2024-01-14', amount: '$25.00', reason: 'Wrong item shipped', agent: 'Sarah' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryColumns, setPrimaryColumns] = useState<ColumnType[]>([
    { title: 'Date', dataIndex: 'date', key: 'date', width: 140 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 160 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120 },
  ]);

  const [secondaryColumns, setSecondaryColumns] = useState<ColumnType[]>([
    { title: 'Date', dataIndex: 'date', key: 'date', width: 140 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120 },
    { title: 'Reason', dataIndex: 'reason', key: 'reason', width: 160 },
    { title: 'Agent', dataIndex: 'agent', key: 'agent', width: 120 },
  ]);

  const successFired = useRef(false);

  const reasonWidth = secondaryColumns.find(c => c.key === 'reason')?.width ?? 0;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(reasonWidth, 220, 8)) {
      successFired.current = true;
      onSuccess();
    }
  }, [reasonWidth, onSuccess]);

  const handlePrimaryResize = (index: number) => (
    _e: React.SyntheticEvent,
    { size }: ResizeCallbackData
  ) => {
    setPrimaryColumns((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], width: size.width };
      return next;
    });
  };

  const handleSecondaryResize = (index: number) => (
    _e: React.SyntheticEvent,
    { size }: ResizeCallbackData
  ) => {
    setSecondaryColumns((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], width: size.width };
      return next;
    });
  };

  const mergedPrimaryColumns = primaryColumns.map((col, index) => ({
    ...col,
    onHeaderCell: () => ({
      width: col.width,
      onResize: handlePrimaryResize(index),
    }),
  }));

  const mergedSecondaryColumns = secondaryColumns.map((col, index) => ({
    ...col,
    onHeaderCell: () => ({
      width: col.width,
      onResize: handleSecondaryResize(index),
    }),
  }));

  return (
    <Card style={{ width: 680 }} data-testid="rc-container">
      <div data-testid="rc-table-primary" style={{ marginBottom: 32 }}>
        <Title level={5}>Primary (Payments)</Title>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
          Customer width: {primaryColumns.find(c => c.key === 'customer')?.width}px
        </div>
        <Table
          bordered
          components={{ header: { cell: ResizableTitle } }}
          columns={mergedPrimaryColumns}
          dataSource={primaryData}
          pagination={false}
          size="small"
        />
      </div>

      <div data-testid="rc-table-secondary">
        <Title level={5}>Secondary (Refunds)</Title>
        <div
          style={{ fontSize: 12, color: '#666', marginBottom: 8 }}
          data-testid="rc-width-reason"
        >
          Reason width: {reasonWidth}px
        </div>
        <Table
          bordered
          components={{ header: { cell: ResizableTitle } }}
          columns={mergedSecondaryColumns}
          dataSource={secondaryData}
          pagination={false}
          size="small"
        />
      </div>
    </Card>
  );
}
