'use client';

/**
 * Task ID: resizable_columns-antd-v2-T02
 * Task Name: Drawer preview: resize Resolution in the Escalations layout and save
 *
 * Setup Description:
 * drawer_flow: queue summary card and "Column layouts" opens a Drawer. Inside: three Collapse sections
 * with resizable preview tables — Primary — Inbox, Secondary — Escalations, Archived — Review.
 * Secondary table: Ticket, Owner, Resolution, Age. Resolution starts at 168px. Footer: Cancel, Save layouts.
 * Draft widths update live; commit on Save layouts.
 *
 * Success Trigger: Resolution width within ±4px of 228px AND Save layouts clicked (committed state).
 * require_confirm: true.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Collapse, Drawer, Space, Table, Typography } from 'antd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

const { Text } = Typography;

interface ColumnType {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
}

interface InboxRow {
  key: string;
  ticket: string;
  subject: string;
  status: string;
  age: string;
}

interface EscRow {
  key: string;
  ticket: string;
  owner: string;
  resolution: string;
  age: string;
}

interface ArchRow {
  key: string;
  ticket: string;
  batch: string;
  outcome: string;
  age: string;
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

const primaryRows: InboxRow[] = [
  { key: 'p1', ticket: 'IN-901', subject: 'Latency spike', status: 'New', age: '2d' },
  { key: 'p2', ticket: 'IN-899', subject: 'SSL warning', status: 'Triage', age: '3d' },
];

const secondaryRows: EscRow[] = [
  { key: 's1', ticket: 'ES-120', owner: 'N. Kim', resolution: 'Escalated', age: '5h' },
  { key: 's2', ticket: 'ES-118', owner: 'L. Wu', resolution: 'Vendor', age: '1d' },
];

const archivedRows: ArchRow[] = [
  { key: 'a1', ticket: 'AR-77', batch: 'Q3', outcome: 'Signed', age: '14d' },
  { key: 'a2', ticket: 'AR-76', batch: 'Q3', outcome: 'Waived', age: '20d' },
];

const primaryColsInit: ColumnType[] = [
  { title: 'Ticket', dataIndex: 'ticket', key: 'ticket', width: 88 },
  { title: 'Subject', dataIndex: 'subject', key: 'subject', width: 160 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 92 },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 56 },
];

const secondaryColsInit: ColumnType[] = [
  { title: 'Ticket', dataIndex: 'ticket', key: 'ticket', width: 96 },
  { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 88 },
  { title: 'Resolution', dataIndex: 'resolution', key: 'resolution', width: 168 },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 64 },
];

const archivedColsInit: ColumnType[] = [
  { title: 'Ticket', dataIndex: 'ticket', key: 'ticket', width: 88 },
  { title: 'Batch', dataIndex: 'batch', key: 'batch', width: 72 },
  { title: 'Outcome', dataIndex: 'outcome', key: 'outcome', width: 120 },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 56 },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [primaryCols, setPrimaryCols] = useState<ColumnType[]>(primaryColsInit);
  const [secondaryCols, setSecondaryCols] = useState<ColumnType[]>(secondaryColsInit);
  const [archivedCols, setArchivedCols] = useState<ColumnType[]>(archivedColsInit);
  const [committedResolution, setCommittedResolution] = useState<number | null>(null);
  const successFired = useRef(false);

  const draftResolution = secondaryCols.find(c => c.key === 'resolution')?.width ?? 0;

  useEffect(() => {
    if (
      !successFired.current &&
      committedResolution !== null &&
      isWithinTolerance(committedResolution, 228, 4)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedResolution, onSuccess]);

  const bindResize = (setter: React.Dispatch<React.SetStateAction<ColumnType[]>>) => (index: number) =>
    (_e: React.SyntheticEvent, { size }: ResizeCallbackData) => {
      setter(prev => {
        const next = [...prev];
        next[index] = { ...next[index], width: size.width };
        return next;
      });
    };

  const merge = (cols: ColumnType[], handle: (i: number) => (e: React.SyntheticEvent, d: ResizeCallbackData) => void) =>
    cols.map((col, index) => ({
      ...col,
      onHeaderCell: () => ({
        width: col.width,
        onResize: handle(index),
      }),
    }));

  const handleSaveLayouts = () => {
    const w = secondaryCols.find(c => c.key === 'resolution')?.width ?? 0;
    setCommittedResolution(w);
  };

  return (
    <div style={{ padding: 12, maxWidth: 560 }} data-testid="rc-v2-t02-page">
      <Card size="small" style={{ marginBottom: 12 }} title="Queue summary">
        <Text type="secondary" style={{ fontSize: 12 }}>
          12 escalations awaiting layout review.
        </Text>
      </Card>
      <Button type="primary" onClick={() => setDrawerOpen(true)} data-testid="rc-v2-t02-open-drawer">
        Column layouts
      </Button>

      <Drawer
        title="Column layouts"
        placement="right"
        width={440}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        styles={{ body: { paddingTop: 8 } }}
        footer={
          <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSaveLayouts} data-testid="rc-v2-t02-save-layouts">
              Save layouts
            </Button>
          </Space>
        }
      >
        <Collapse
          defaultActiveKey={['secondary']}
          size="small"
          items={[
            {
              key: 'primary',
              label: 'Primary — Inbox',
              children: (
                <div data-testid="rc-v2-t02-primary">
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>
                    Subject width: {primaryCols.find(c => c.key === 'subject')?.width ?? 0}px
                  </div>
                  <Table<InboxRow>
                    bordered
                    size="small"
                    tableLayout="fixed"
                    components={{ header: { cell: ResizableTitle } }}
                    columns={merge(primaryCols, bindResize(setPrimaryCols))}
                    dataSource={primaryRows}
                    pagination={false}
                    scroll={{ x: primaryCols.reduce((s, c) => s + c.width, 0) }}
                  />
                </div>
              ),
            },
            {
              key: 'secondary',
              label: 'Secondary — Escalations',
              children: (
                <div data-testid="rc-v2-t02-secondary">
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }} data-testid="rc-v2-t02-resolution-monitor">
                    Resolution width: {draftResolution}px
                  </div>
                  <Table<EscRow>
                    bordered
                    size="small"
                    tableLayout="fixed"
                    components={{ header: { cell: ResizableTitle } }}
                    columns={merge(secondaryCols, bindResize(setSecondaryCols))}
                    dataSource={secondaryRows}
                    pagination={false}
                    scroll={{ x: secondaryCols.reduce((s, c) => s + c.width, 0) }}
                  />
                </div>
              ),
            },
            {
              key: 'archived',
              label: 'Archived — Review',
              children: (
                <div data-testid="rc-v2-t02-archived">
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>
                    Outcome width: {archivedCols.find(c => c.key === 'outcome')?.width ?? 0}px
                  </div>
                  <Table<ArchRow>
                    bordered
                    size="small"
                    tableLayout="fixed"
                    components={{ header: { cell: ResizableTitle } }}
                    columns={merge(archivedCols, bindResize(setArchivedCols))}
                    dataSource={archivedRows}
                    pagination={false}
                    scroll={{ x: archivedCols.reduce((s, c) => s + c.width, 0) }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Drawer>
    </div>
  );
}
