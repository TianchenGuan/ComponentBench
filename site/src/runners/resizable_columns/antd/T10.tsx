'use client';

/**
 * Task ID: resizable_columns-antd-T10
 * Task Name: Dashboard: resize Revenue to 200px and apply
 *
 * Setup Description:
 * Layout: dashboard with high clutter.
 * Multiple widgets: KPI tiles, date range picker, refresh button (distractors).
 * A card titled "Sales" containing a resizable Ant Design Table (target).
 * - Columns: Region, Orders, Revenue, Trend.
 * - Inline readout shows "Revenue width (pending): ###px".
 * - The table has pending/saved state: resizing updates preview, Save commits.
 *
 * Controls: "Apply layout" (primary), "Cancel" (secondary).
 *
 * Initial state: Revenue starts at 160px, no pending changes.
 *
 * Success Trigger: Revenue within ±5px of 200px AND user clicked "Apply layout".
 *
 * Theme: light, Spacing: comfortable, Layout: dashboard, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, Space, Statistic, DatePicker, message, Row, Col } from 'antd';
import { ReloadOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
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
  { key: '1', region: 'North', orders: 245, revenue: '$12,450', trend: '+15%' },
  { key: '2', region: 'South', orders: 189, revenue: '$9,320', trend: '+8%' },
  { key: '3', region: 'East', orders: 312, revenue: '$15,890', trend: '+22%' },
  { key: '4', region: 'West', orders: 156, revenue: '$7,650', trend: '-5%' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [draftColumns, setDraftColumns] = useState<ColumnType[]>([
    { title: 'Region', dataIndex: 'region', key: 'region', width: 120 },
    { title: 'Orders', dataIndex: 'orders', key: 'orders', width: 100 },
    { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', width: 160 },
    { title: 'Trend', dataIndex: 'trend', key: 'trend', width: 100 },
  ]);
  const [savedColumns, setSavedColumns] = useState<ColumnType[]>([...draftColumns]);
  const successFired = useRef(false);

  const draftRevenueWidth = draftColumns.find(c => c.key === 'revenue')?.width ?? 0;
  const savedRevenueWidth = savedColumns.find(c => c.key === 'revenue')?.width ?? 0;
  const hasPendingChanges = JSON.stringify(draftColumns) !== JSON.stringify(savedColumns);

  const handleApply = () => {
    setSavedColumns([...draftColumns]);
    message.success('Layout applied');
    
    // Check success after applying
    const revenueWidth = draftColumns.find(c => c.key === 'revenue')?.width ?? 0;
    if (!successFired.current && isWithinTolerance(revenueWidth, 200, 5)) {
      successFired.current = true;
      onSuccess();
    }
  };

  const handleCancel = () => {
    setDraftColumns([...savedColumns]);
    message.info('Changes cancelled');
  };

  const handleResize = (index: number) => (
    _e: React.SyntheticEvent,
    { size }: ResizeCallbackData
  ) => {
    setDraftColumns((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], width: size.width };
      return next;
    });
  };

  const mergedColumns = draftColumns.map((col, index) => ({
    ...col,
    onHeaderCell: () => ({
      width: col.width,
      onResize: handleResize(index),
    }),
  }));

  return (
    <div style={{ width: 900 }} data-testid="rc-dashboard">
      {/* Dashboard header */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Revenue"
              value={45310}
              prefix="$"
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Orders"
              value={902}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Conversion"
              value={3.2}
              suffix="%"
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Space>
            <DatePicker.RangePicker size="small" />
            <Button icon={<ReloadOutlined />} size="small">Refresh</Button>
          </Space>
        </Col>
      </Row>

      {/* Sales table card */}
      <Card
        title="Sales"
        data-testid="rc-dashboard-sales"
        extra={
          <span style={{ fontSize: 12, color: hasPendingChanges ? '#faad14' : '#666' }}>
            Revenue width (pending): {Math.round(draftRevenueWidth)}px
            {hasPendingChanges && ' (unsaved)'}
          </span>
        }
      >
        <Table
          bordered
          components={{ header: { cell: ResizableTitle } }}
          columns={mergedColumns}
          dataSource={tableData}
          pagination={false}
          size="small"
          tableLayout="fixed"
          style={{ width: draftColumns.reduce((s, c) => s + c.width, 0) }}
        />
        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={handleCancel} disabled={!hasPendingChanges}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleApply}
            disabled={!hasPendingChanges}
            data-testid="rc-apply-layout"
          >
            Apply layout
          </Button>
        </div>
      </Card>
    </div>
  );
}
