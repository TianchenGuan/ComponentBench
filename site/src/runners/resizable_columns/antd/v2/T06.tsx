'use client';

/**
 * Task ID: resizable_columns-antd-v2-T06
 * Task Name: Audit row table-cell: keep Reviewer in the allowed range
 *
 * Setup Description:
 * table_cell: resizable mini-table "Review overrides" in lower cell of audit matrix; headers
 * Review ID, Reviewer (sort chevron), Decision, Updated. Reviewer starts 176px. Monitor: Reviewer width.
 *
 * Success Trigger: Reviewer width between 134px and 142px inclusive. require_confirm: false.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Tag, Select, Space } from 'antd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../../types';
import { isInRange } from '../../types';

interface ColumnType {
  title: React.ReactNode;
  dataIndex: string;
  key: string;
  width: number;
  sorter?: (a: ReviewRow, b: ReviewRow) => number;
}

interface ReviewRow {
  key: string;
  reviewId: string;
  reviewer: string;
  decision: string;
  updated: string;
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
            zIndex: 3,
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

const reviewRows: ReviewRow[] = [
  { key: '1', reviewId: 'RV-01', reviewer: 'Q. Lane', decision: 'Hold', updated: '10:02' },
  { key: '2', reviewId: 'RV-02', reviewer: 'T. Ng', decision: 'Approve', updated: '10:18' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<ColumnType[]>([
    { title: 'Review ID', dataIndex: 'reviewId', key: 'reviewId', width: 96 },
    {
      title: 'Reviewer',
      dataIndex: 'reviewer',
      key: 'reviewer',
      width: 176,
      sorter: (a, b) => a.reviewer.localeCompare(b.reviewer),
    },
    { title: 'Decision', dataIndex: 'decision', key: 'decision', width: 104 },
    { title: 'Updated', dataIndex: 'updated', key: 'updated', width: 88 },
  ]);
  const successFired = useRef(false);

  const reviewerW = columns.find(c => c.key === 'reviewer')?.width ?? 0;

  useEffect(() => {
    if (!successFired.current && isInRange(reviewerW, 134, 142)) {
      successFired.current = true;
      onSuccess();
    }
  }, [reviewerW, onSuccess]);

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

  const matrixStyle: React.CSSProperties = {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: 12,
    background: '#fff',
  };

  return (
    <div style={{ padding: 10 }} data-testid="rc-v2-t06-audit">
      <table style={matrixStyle}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #e8e8e8', padding: 8, width: '38%', verticalAlign: 'top' }}>
              <Space direction="vertical" size={4}>
                <span style={{ color: '#888' }}>Control</span>
                <Tag color="blue">verified</Tag>
                <Tag>scope A</Tag>
              </Space>
            </td>
            <td style={{ border: '1px solid #e8e8e8', padding: 8, verticalAlign: 'top' }}>
              <Select size="small" defaultValue="weekly" style={{ width: 140 }} options={[{ value: 'weekly', label: 'Weekly' }]} />
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #e8e8e8', padding: 8, verticalAlign: 'top' }}>
              <Tag color="gold">pending</Tag>
              <div style={{ marginTop: 6, color: '#888' }}>Exceptions</div>
            </td>
            <td style={{ border: '1px solid #e8e8e8', padding: 8, verticalAlign: 'top' }} data-testid="rc-v2-t06-cell-table">
              <Card size="small" title={<span style={{ fontSize: 12 }}>Review overrides</span>} styles={{ body: { padding: 6 } }}>
                <div style={{ fontSize: 10, color: '#666', marginBottom: 4 }} data-testid="rc-v2-t06-reviewer-monitor">
                  Reviewer width: {reviewerW}px
                </div>
                <Table<ReviewRow>
                  bordered
                  size="small"
                  tableLayout="fixed"
                  components={{ header: { cell: ResizableTitle } }}
                  columns={mergedColumns}
                  dataSource={reviewRows}
                  pagination={false}
                  scroll={{ x: columns.reduce((s, c) => s + c.width, 0) }}
                />
              </Card>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
