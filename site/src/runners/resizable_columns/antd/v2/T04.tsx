'use client';

/**
 * Task ID: resizable_columns-antd-v2-T04
 * Task Name: Middle table only: align Service and Owner to the reference ruler
 *
 * Setup Description:
 * dashboard_panel: three stacked preview tables — Inbox, Regional triage, Archive. Ruler above the
 * middle table only. Target instance: Regional triage. No numeric targets in UI for the middle table
 * beyond the ruler (canonical: service 175px, owner 209px ±6).
 *
 * Success Trigger: Regional triage — service ±6 of 175, owner ±6 of 209. require_confirm: false.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography } from 'antd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

const { Title } = Typography;

interface ColumnType {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
}

interface TriageRow {
  key: string;
  ticket: string;
  service: string;
  owner: string;
  status: string;
}

const RULER_TICKET = 120;
const RULER_SERVICE = 175;
const RULER_OWNER = 209;
const RULER_STATUS = 100;

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
      <th {...restProps} style={{ ...restProps.style, position: 'relative' }} />
    </Resizable>
  );
};

const rows: TriageRow[] = [
  { key: '1', ticket: 'TK-12', service: 'Billing', owner: 'S. Ali', status: 'Queued' },
  { key: '2', ticket: 'TK-15', service: 'Auth', owner: 'R. Diaz', status: 'Active' },
];

function RulerBar() {
  const segments = [
    { label: 'Ticket', w: RULER_TICKET, bg: '#e6f4ff' },
    { label: 'Service', w: RULER_SERVICE, bg: '#f6ffed' },
    { label: 'Owner', w: RULER_OWNER, bg: '#fff7e6' },
    { label: 'Status', w: RULER_STATUS, bg: '#f9f0ff' },
  ];
  return (
    <table
      aria-label="Reference ruler for Regional triage"
      data-testid="rc-v2-t04-ruler"
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
              border: '1px solid #91caff',
              padding: '4px 8px',
              fontSize: 11,
              height: 26,
            }}>
              {s.label}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const aligned: ColumnType[] = [
    { title: 'Ticket', dataIndex: 'ticket', key: 'ticket', width: RULER_TICKET },
    { title: 'Service', dataIndex: 'service', key: 'service', width: RULER_SERVICE },
    { title: 'Owner', dataIndex: 'owner', key: 'owner', width: RULER_OWNER },
    { title: 'Status', dataIndex: 'status', key: 'status', width: RULER_STATUS },
  ];

  const [inboxCols, setInboxCols] = useState<ColumnType[]>(aligned);
  const [midCols, setMidCols] = useState<ColumnType[]>([
    { title: 'Ticket', dataIndex: 'ticket', key: 'ticket', width: RULER_TICKET },
    { title: 'Service', dataIndex: 'service', key: 'service', width: 130 },
    { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 155 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: RULER_STATUS },
  ]);
  const [archiveCols, setArchiveCols] = useState<ColumnType[]>(aligned);

  const successFired = useRef(false);

  const serviceW = midCols.find(c => c.key === 'service')?.width ?? 0;
  const ownerW = midCols.find(c => c.key === 'owner')?.width ?? 0;

  useEffect(() => {
    const ok =
      isWithinTolerance(serviceW, 175, 6) && isWithinTolerance(ownerW, 209, 6);
    if (!successFired.current && ok) {
      successFired.current = true;
      onSuccess();
    }
  }, [serviceW, ownerW, onSuccess]);

  const bind =
    (setter: React.Dispatch<React.SetStateAction<ColumnType[]>>) => (index: number) =>
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
    <Card title="Preview layouts" size="small" style={{ width: 620 }} data-testid="rc-v2-t04-dashboard">
      <div style={{ marginBottom: 20 }} data-testid="rc-v2-t04-inbox">
        <Title level={5} style={{ marginTop: 0, fontSize: 14 }}>
          Inbox
        </Title>
        <Table<TriageRow>
          bordered
          size="small"
          tableLayout="fixed"
          components={{ header: { cell: ResizableTitle } }}
          columns={merge(inboxCols, bind(setInboxCols))}
          dataSource={rows}
          pagination={false}
          style={{ width: inboxCols.reduce((s, c) => s + c.width, 0) }}
        />
      </div>

      <div style={{ marginBottom: 20 }} data-testid="rc-v2-t04-regional">
        <Title level={5} style={{ fontSize: 14 }}>
          Regional triage
        </Title>
        <RulerBar />
        <Table<TriageRow>
          bordered
          size="small"
          tableLayout="fixed"
          components={{ header: { cell: ResizableTitle } }}
          columns={merge(midCols, bind(setMidCols))}
          dataSource={rows}
          pagination={false}
          style={{ width: midCols.reduce((s, c) => s + c.width, 0) }}
        />
      </div>

      <div data-testid="rc-v2-t04-archive">
        <Title level={5} style={{ fontSize: 14 }}>
          Archive
        </Title>
        <Table<TriageRow>
          bordered
          size="small"
          tableLayout="fixed"
          components={{ header: { cell: ResizableTitle } }}
          columns={merge(archiveCols, bind(setArchiveCols))}
          dataSource={rows}
          pagination={false}
          style={{ width: archiveCols.reduce((s, c) => s + c.width, 0) }}
        />
      </div>
    </Card>
  );
}
