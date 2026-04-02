'use client';

/**
 * Task ID: resizable_columns-antd-v2-T03
 * Task Name: Nested scroll: find Error summary off-screen and resize it
 *
 * Setup Description:
 * nested_scroll: outer scrollable column; card "Build failures" with table wider than container;
 * horizontal scrollbar always visible (overflow-x: scroll). Columns include Job … Error summary … Retry hint.
 * Error summary starts at 244px. Monitor above table: `Error summary width: ###px`.
 *
 * Success Trigger: Error summary width within ±6px of 312px. require_confirm: false.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table } from 'antd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

interface ColumnType {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
}

interface BuildRow {
  key: string;
  job: string;
  branch: string;
  sha: string;
  owner: string;
  stage: string;
  duration: string;
  errorSummary: string;
  retryHint: string;
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

const buildData: BuildRow[] = [
  {
    key: '1',
    job: 'svc-build',
    branch: 'main',
    sha: 'a1b2c3d',
    owner: 'CI',
    stage: 'test',
    duration: '12m',
    errorSummary: 'Integration timeout contacting ledger mock',
    retryHint: 'Retry after mock warm-up',
  },
  {
    key: '2',
    job: 'web-build',
    branch: 'release/42',
    sha: 'e4f5g6h',
    owner: 'CI',
    stage: 'lint',
    duration: '4m',
    errorSummary: 'ESLint rule react-hooks/exhaustive-deps',
    retryHint: 'Fix deps array',
  },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<ColumnType[]>([
    { title: 'Job', dataIndex: 'job', key: 'job', width: 104 },
    { title: 'Branch', dataIndex: 'branch', key: 'branch', width: 118 },
    { title: 'SHA', dataIndex: 'sha', key: 'sha', width: 132 },
    { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 96 },
    { title: 'Stage', dataIndex: 'stage', key: 'stage', width: 92 },
    { title: 'Duration', dataIndex: 'duration', key: 'duration', width: 96 },
    { title: 'Error summary', dataIndex: 'errorSummary', key: 'error_summary', width: 244 },
    { title: 'Retry hint', dataIndex: 'retryHint', key: 'retry_hint', width: 168 },
  ]);
  const successFired = useRef(false);

  const errorSummaryWidth = columns.find(c => c.key === 'error_summary')?.width ?? 0;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(errorSummaryWidth, 312, 6)) {
      successFired.current = true;
      onSuccess();
    }
  }, [errorSummaryWidth, onSuccess]);

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

  const tableScrollX = columns.reduce((s, c) => s + c.width, 0);

  return (
    <div
      style={{
        height: 380,
        overflowY: 'auto',
        padding: 12,
        background: '#fafafa',
        border: '1px solid #eee',
      }}
      data-testid="rc-v2-t03-outer-scroll"
    >
      <div style={{ height: 120, marginBottom: 12, background: '#fff', border: '1px dashed #ddd' }} />
      <Card
        title={<span style={{ fontSize: 13 }}>Build failures</span>}
        size="small"
        styles={{ body: { padding: 10 } }}
        style={{ width: 480 }}
        data-testid="rc-v2-t03-card"
      >
        <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }} data-testid="rc-v2-t03-error-monitor">
          Error summary width: {errorSummaryWidth}px
        </div>
        <div
          style={{
            overflowX: 'scroll',
            overflowY: 'hidden',
            maxWidth: '100%',
            border: '1px solid #f0f0f0',
          }}
          data-testid="rc-v2-t03-hscroll"
        >
          <Table<BuildRow>
            bordered
            size="small"
            tableLayout="fixed"
            style={{ minWidth: tableScrollX }}
            components={{ header: { cell: ResizableTitle } }}
            columns={mergedColumns}
            dataSource={buildData}
            pagination={false}
            scroll={{ x: tableScrollX }}
          />
        </div>
      </Card>
    </div>
  );
}
