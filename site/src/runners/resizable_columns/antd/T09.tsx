'use client';

/**
 * Task ID: resizable_columns-antd-T09
 * Task Name: Match Primary table widths to visual reference (2 instances)
 *
 * Setup Description:
 * Layout: isolated_card, centered, containing a reference ruler and two resizable tables.
 * Reference layout: A horizontal bar with labeled segments "Plan", "Usage", "Price".
 * Table 1 label: "Primary (Plan pricing)" (target) - Columns: Plan, Usage, Price, Action.
 * Table 2 label: "Secondary (Plan pricing)" (distractor) - Same columns.
 *
 * Target widths: Plan 160px, Usage 220px, Price 140px.
 * Initial state: Primary column widths are slightly off from the reference.
 *
 * Success Trigger: In Primary table, Plan ±6px of 160px, Usage ±6px of 220px, Price ±6px of 140px.
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

const tableData = [
  { key: '1', plan: 'Basic', usage: '100 GB', price: '$9.99', action: 'Select' },
  { key: '2', plan: 'Pro', usage: '500 GB', price: '$19.99', action: 'Select' },
  { key: '3', plan: 'Enterprise', usage: 'Unlimited', price: '$49.99', action: 'Select' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [primaryColumns, setPrimaryColumns] = useState<ColumnType[]>([
    { title: 'Plan', dataIndex: 'plan', key: 'plan', width: 200 },
    { title: 'Usage', dataIndex: 'usage', key: 'usage', width: 160 },
    { title: 'Price', dataIndex: 'price', key: 'price', width: 180 },
    { title: 'Action', dataIndex: 'action', key: 'action', width: 100 },
  ]);

  const [secondaryColumns, setSecondaryColumns] = useState<ColumnType[]>([
    { title: 'Plan', dataIndex: 'plan', key: 'plan', width: 160 },
    { title: 'Usage', dataIndex: 'usage', key: 'usage', width: 220 },
    { title: 'Price', dataIndex: 'price', key: 'price', width: 140 },
    { title: 'Action', dataIndex: 'action', key: 'action', width: 100 },
  ]);

  const successFired = useRef(false);

  const primaryPlan = primaryColumns.find(c => c.key === 'plan')?.width ?? 0;
  const primaryUsage = primaryColumns.find(c => c.key === 'usage')?.width ?? 0;
  const primaryPrice = primaryColumns.find(c => c.key === 'price')?.width ?? 0;

  useEffect(() => {
    const planOk = isWithinTolerance(primaryPlan, 160, 6);
    const usageOk = isWithinTolerance(primaryUsage, 220, 6);
    const priceOk = isWithinTolerance(primaryPrice, 140, 6);
    
    if (!successFired.current && planOk && usageOk && priceOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [primaryPlan, primaryUsage, primaryPrice, onSuccess]);

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
      {/* Reference layout bar */}
      <div
        aria-label="Reference widths: Plan 160px, Usage 220px, Price 140px"
        style={{
          display: 'flex',
          marginBottom: 24,
          border: '1px solid #d9d9d9',
          borderRadius: 4,
          overflow: 'hidden',
        }}
        data-testid="rc-reference-bar"
      >
        <div style={{ width: 160, background: '#e6f7ff', padding: '8px 12px', borderRight: '1px solid #91d5ff' }}>
          Plan
        </div>
        <div style={{ width: 220, background: '#f6ffed', padding: '8px 12px', borderRight: '1px solid #b7eb8f' }}>
          Usage
        </div>
        <div style={{ width: 140, background: '#fff7e6', padding: '8px 12px' }}>
          Price
        </div>
      </div>

      {/* Primary table (target) */}
      <div data-testid="rc-table-primary" style={{ marginBottom: 32 }}>
        <Title level={5}>Primary (Plan pricing)</Title>
        <Table
          bordered
          components={{ header: { cell: ResizableTitle } }}
          columns={mergedPrimaryColumns}
          dataSource={tableData}
          pagination={false}
          size="small"
          tableLayout="fixed"
          style={{ width: primaryColumns.reduce((s, c) => s + c.width, 0) }}
        />
      </div>

      {/* Secondary table (distractor) */}
      <div data-testid="rc-table-secondary">
        <Title level={5}>Secondary (Plan pricing)</Title>
        <Table
          bordered
          components={{ header: { cell: ResizableTitle } }}
          columns={mergedSecondaryColumns}
          dataSource={tableData}
          pagination={false}
          size="small"
          tableLayout="fixed"
          style={{ width: secondaryColumns.reduce((s, c) => s + c.width, 0) }}
        />
      </div>
    </Card>
  );
}
