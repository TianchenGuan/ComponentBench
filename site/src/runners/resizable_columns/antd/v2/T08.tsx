'use client';

/**
 * Task ID: resizable_columns-antd-v2-T08
 * Task Name: Lower budget table: match three boundaries to the strip
 *
 * Setup Description:
 * dashboard_panel: two stacked finance tables — Global budget (distractor), Regional budget (target).
 * Colored boundary strip aligned to the lower table only. Target: budget 144, forecast 183, variance 118 (±5).
 *
 * Success Trigger: Regional budget — budget ±5 of 144, forecast ±5 of 183, variance ±5 of 118. require_confirm: false.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography } from 'antd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../../types';
import { allWidthsMatch } from '../../types';

const { Title } = Typography;

interface ColumnType {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
}

interface BudgetRow {
  key: string;
  unit: string;
  budget: string;
  forecast: string;
  variance: string;
  updated: string;
}

const B_UNIT = 83;
const T_BUDGET = 161;
const T_FORECAST = 209;
const T_VAR = 133;
const B_UPDATED = 96;

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
            zIndex: 2,
          }}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th
        {...restProps}
        style={{
          ...restProps.style,
          position: 'relative',
        }}
      />
    </Resizable>
  );
};

const rows: BudgetRow[] = [
  { key: '1', unit: 'EU-1', budget: '120k', forecast: '118k', variance: '-2k', updated: 'Mon' },
  { key: '2', unit: 'US-3', budget: '240k', forecast: '251k', variance: '+11k', updated: 'Mon' },
];

function Strip() {
  const segments = [
    { label: 'Unit', w: B_UNIT, bg: '#fafafa' },
    { label: 'Budget', w: T_BUDGET, bg: '#fff1f0' },
    { label: 'Forecast', w: T_FORECAST, bg: '#e6f7ff' },
    { label: 'Variance', w: T_VAR, bg: '#f6ffed' },
    { label: 'Updated', w: B_UPDATED, bg: '#fafafa' },
  ];
  return (
    <table
      data-testid="rc-v2-t08-strip"
      style={{ borderCollapse: 'collapse', tableLayout: 'fixed', marginBottom: 8 }}
    >
      <colgroup>
        {segments.map(s => <col key={s.label} style={{ width: s.w }} />)}
      </colgroup>
      <tbody>
        <tr>
          {segments.map(s => (
            <td key={s.label} style={{
              background: s.bg,
              border: '1px solid #adc6ff',
              padding: '4px 8px',
              fontSize: 10,
              height: 24,
            }}>
              {s.label}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const globalInit: ColumnType[] = [
    { title: 'Unit', dataIndex: 'unit', key: 'unit', width: B_UNIT },
    { title: 'Budget', dataIndex: 'budget', key: 'budget', width: T_BUDGET },
    { title: 'Forecast', dataIndex: 'forecast', key: 'forecast', width: T_FORECAST },
    { title: 'Variance', dataIndex: 'variance', key: 'variance', width: T_VAR },
    { title: 'Updated', dataIndex: 'updated', key: 'updated', width: B_UPDATED },
  ];

  const [globalCols, setGlobalCols] = useState<ColumnType[]>(globalInit);
  const [regionalCols, setRegionalCols] = useState<ColumnType[]>([
    { title: 'Unit', dataIndex: 'unit', key: 'unit', width: B_UNIT },
    { title: 'Budget', dataIndex: 'budget', key: 'budget', width: 110 },
    { title: 'Forecast', dataIndex: 'forecast', key: 'forecast', width: 160 },
    { title: 'Variance', dataIndex: 'variance', key: 'variance', width: 100 },
    { title: 'Updated', dataIndex: 'updated', key: 'updated', width: B_UPDATED },
  ]);

  const successFired = useRef(false);

  const b = regionalCols.find(c => c.key === 'budget')?.width ?? 0;
  const f = regionalCols.find(c => c.key === 'forecast')?.width ?? 0;
  const v = regionalCols.find(c => c.key === 'variance')?.width ?? 0;

  useEffect(() => {
    const ok = allWidthsMatch(
      { budget: b, forecast: f, variance: v },
      { budget: 144, forecast: 183, variance: 118 },
      5
    );
    if (!successFired.current && ok) {
      successFired.current = true;
      onSuccess();
    }
  }, [b, f, v, onSuccess]);

  const bind = (setter: React.Dispatch<React.SetStateAction<ColumnType[]>>) => (index: number) =>
    (_e: React.SyntheticEvent, { size }: ResizeCallbackData) => {
      setter(prev => {
        const next = [...prev];
        next[index] = { ...next[index], width: size.width };
        return next;
      });
    };

  const merge = (cols: ColumnType[], handler: (i: number) => (e: React.SyntheticEvent, d: ResizeCallbackData) => void) =>
    cols.map((col, index) => ({
      ...col,
      onHeaderCell: () => ({
        width: col.width,
        onResize: handler(index),
      }),
    }));

  return (
    <Card title="Finance overview" size="small" style={{ width: 640 }} data-testid="rc-v2-t08-dashboard">
      <div style={{ marginBottom: 18 }} data-testid="rc-v2-t08-global">
        <Title level={5} style={{ marginTop: 0, fontSize: 14 }}>
          Global budget
        </Title>
        <Table<BudgetRow>
          bordered
          size="small"
          tableLayout="fixed"
          components={{ header: { cell: ResizableTitle } }}
          columns={merge(globalCols, bind(setGlobalCols))}
          dataSource={rows}
          pagination={false}
          style={{ width: globalCols.reduce((s, c) => s + c.width, 0) }}
        />
      </div>

      <div data-testid="rc-v2-t08-regional">
        <Title level={5} style={{ fontSize: 14 }}>
          Regional budget
        </Title>
        <Strip />
        <Table<BudgetRow>
          bordered
          size="small"
          tableLayout="fixed"
          components={{ header: { cell: ResizableTitle } }}
          columns={merge(regionalCols, bind(setRegionalCols))}
          dataSource={rows}
          pagination={false}
          style={{ width: regionalCols.reduce((s, c) => s + c.width, 0) }}
        />
      </div>
    </Card>
  );
}
