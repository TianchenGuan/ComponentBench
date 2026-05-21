'use client';

/**
 * Task ID: resizable_columns-antd-v2-T05
 * Task Name: Compact convergence: set three widths in one dense inventory table
 *
 * Setup Description:
 * inline_surface: quick-filter chips, bulk toolbar, compact inventory table. Columns ID, Customer,
 * Status, Updated, Owner. Grips always visible. Monitor: `ID: ###px • Customer: ###px • Status: ###px`.
 * Initial: ID 120, Customer 170, Status 144.
 *
 * Success Trigger: ID ±4 of 84, Customer ±4 of 206, Status ±4 of 118. require_confirm: false.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Space, Button, Tag } from 'antd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../../types';
import { allWidthsMatch } from '../../types';

interface ColumnType {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
}

interface InvRow {
  key: string;
  id: string;
  customer: string;
  status: string;
  updated: string;
  owner: string;
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
            zIndex: 2,
            borderRight: '2px solid rgba(0, 0, 0, 0.22)',
            background: 'rgba(22, 119, 255, 0.06)',
          }}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
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
              top: -22,
              right: 0,
              background: '#1677ff',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: 4,
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

const invData: InvRow[] = [
  { key: '1', id: 'SKU-8821', customer: 'Northwind', status: 'Low', updated: 'Mon', owner: 'A' },
  { key: '2', id: 'SKU-8820', customer: 'Contoso', status: 'Ok', updated: 'Mon', owner: 'B' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<ColumnType[]>([
    { title: 'ID', dataIndex: 'id', key: 'id', width: 120 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 170 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 144 },
    { title: 'Updated', dataIndex: 'updated', key: 'updated', width: 88 },
    { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 72 },
  ]);
  const successFired = useRef(false);

  const idW = columns.find(c => c.key === 'id')?.width ?? 0;
  const custW = columns.find(c => c.key === 'customer')?.width ?? 0;
  const statW = columns.find(c => c.key === 'status')?.width ?? 0;

  useEffect(() => {
    const ok = allWidthsMatch(
      { id: idW, customer: custW, status: statW },
      { id: 84, customer: 206, status: 118 },
      4
    );
    if (!successFired.current && ok) {
      successFired.current = true;
      onSuccess();
    }
  }, [idW, custW, statW, onSuccess]);

  const handleResize = (index: number) => (_e: React.SyntheticEvent, { size }: ResizeCallbackData) => {
    setColumns(prev => {
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
    <div style={{ padding: 10, maxWidth: 520, border: '1px solid #f0f0f0' }} data-testid="rc-v2-t05-surface">
      <Space wrap size={[4, 4]} style={{ marginBottom: 8 }}>
        <Tag>active</Tag>
        <Tag>backorder</Tag>
        <Tag>eu-west</Tag>
        <Tag>v2 catalog</Tag>
      </Space>
      <Space style={{ marginBottom: 8 }}>
        <Button size="small">Export</Button>
        <Button size="small">Archive</Button>
        <Button size="small" type="primary">
          Reconcile
        </Button>
      </Space>
      <Card size="small" title={<span style={{ fontSize: 13 }}>Inventory</span>} styles={{ body: { padding: 8 } }}>
        <div style={{ fontSize: 10, color: '#555', marginBottom: 6 }} data-testid="rc-v2-t05-monitor">
          ID: {idW}px • Customer: {custW}px • Status: {statW}px
        </div>
        <Table<InvRow>
          bordered
          size="small"
          tableLayout="fixed"
          components={{ header: { cell: ResizableTitle } }}
          columns={mergedColumns}
          dataSource={invData}
          pagination={false}
          scroll={{ x: columns.reduce((s, c) => s + c.width, 0) }}
        />
      </Card>
    </div>
  );
}
