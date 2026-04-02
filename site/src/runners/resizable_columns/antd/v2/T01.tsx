'use client';

/**
 * Task ID: resizable_columns-antd-v2-T01
 * Task Name: Dense queue: resize Assignee without triggering header controls
 *
 * Setup Description:
 * Layout uses settings_panel with compact spacing, small scale, and high clutter. A left navigation
 * rail and two status cards sit beside the main content. The main content contains one Ant Design
 * incident queue table with resizable header grips on the right edge of each header cell.
 * The Assignee header has a sorter icon, a filter dropdown icon, and the thin resize grip adjacent.
 * A persistent width monitor above the table reads `Assignee width: ###px`. Assignee starts at 132px.
 * Columns: Ticket, Severity, Service, Assignee, Updated.
 *
 * Success Trigger: Assignee column width is within ±4px of 176px. require_confirm: false.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu, Card, Table, Tag, Space, Button, Input } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

const { Sider, Content } = Layout;

interface ColumnType {
  title: React.ReactNode;
  dataIndex: string;
  key: string;
  width: number;
  sorter?: boolean | ((a: IncidentRow, b: IncidentRow) => number);
  filters?: { text: string; value: string }[];
  filterDropdown?: (props: FilterDropdownProps) => React.ReactNode;
  onFilter?: (value: boolean | React.Key, record: IncidentRow) => boolean;
  render?: (value: unknown, record: IncidentRow, index: number) => React.ReactNode;
}

interface IncidentRow {
  key: string;
  ticket: string;
  severity: string;
  service: string;
  assignee: string;
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
            opacity: 0.35,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.opacity = '1';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.opacity = resizing ? '1' : '0.35';
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

const incidentData: IncidentRow[] = [
  { key: '1', ticket: 'INC-4412', severity: 'P1', service: 'Payments', assignee: 'A. Chen', updated: '09:12' },
  { key: '2', ticket: 'INC-4410', severity: 'P2', service: 'Auth', assignee: 'M. Patel', updated: '08:55' },
  { key: '3', ticket: 'INC-4408', severity: 'P3', service: 'Search', assignee: 'J. Ortiz', updated: '08:40' },
  { key: '4', ticket: 'INC-4405', severity: 'P2', service: 'API', assignee: 'A. Chen', updated: '08:22' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [columns, setColumns] = useState<ColumnType[]>([
    { title: 'Ticket', dataIndex: 'ticket', key: 'ticket', width: 108 },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 96,
      sorter: (a: IncidentRow, b: IncidentRow) => a.severity.localeCompare(b.severity),
      render: (v: unknown) => <Tag color={v === 'P1' ? 'red' : v === 'P2' ? 'orange' : 'default'}>{String(v)}</Tag>,
    },
    { title: 'Service', dataIndex: 'service', key: 'service', width: 124, sorter: (a: IncidentRow, b: IncidentRow) => a.service.localeCompare(b.service) },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 132,
      sorter: (a: IncidentRow, b: IncidentRow) => a.assignee.localeCompare(b.assignee),
      filters: [
        { text: 'A. Chen', value: 'A. Chen' },
        { text: 'M. Patel', value: 'M. Patel' },
        { text: 'J. Ortiz', value: 'J. Ortiz' },
      ],
      onFilter: (value, record) => record.assignee === value,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
          <Input
            placeholder="Filter assignee"
            value={selectedKeys[0] as string | undefined}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={() => confirm()} size="small">
              Filter
            </Button>
            <Button onClick={() => clearFilters?.()} size="small">
              Reset
            </Button>
          </Space>
        </div>
      ),
    },
    { title: 'Updated', dataIndex: 'updated', key: 'updated', width: 88, sorter: (a: IncidentRow, b: IncidentRow) => a.updated.localeCompare(b.updated) },
  ]);
  const successFired = useRef(false);

  const assigneeWidth = columns.find(c => c.key === 'assignee')?.width ?? 0;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(assigneeWidth, 176, 4)) {
      successFired.current = true;
      onSuccess();
    }
  }, [assigneeWidth, onSuccess]);

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
    <Layout style={{ minHeight: 420, background: '#f5f5f5' }} data-testid="rc-v2-t01-layout">
      <Sider width={160} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '12px 8px', fontSize: 11, fontWeight: 600, color: '#888' }}>NAV</div>
        <Menu mode="inline" selectedKeys={['queue']} items={[{ key: 'dash', label: 'Dashboard' }, { key: 'queue', label: 'Queue' }, { key: 'post', label: 'Postmortems' }]} style={{ fontSize: 12 }} />
      </Sider>
      <Content style={{ padding: 12 }}>
        <Space wrap size={8} style={{ marginBottom: 10 }}>
          <Card size="small" styles={{ body: { padding: '6px 10px' } }}>
            <span style={{ fontSize: 11, color: '#888' }}>Open</span> <strong style={{ fontSize: 14 }}>38</strong>
          </Card>
          <Card size="small" styles={{ body: { padding: '6px 10px' } }}>
            <span style={{ fontSize: 11, color: '#888' }}>SLA risk</span> <strong style={{ fontSize: 14 }}>6</strong>
          </Card>
          <Tag color="gold" style={{ marginInlineEnd: 0 }}>
            maintenance
          </Tag>
          <Tag color="blue" style={{ marginInlineEnd: 0 }}>
            shift B
          </Tag>
        </Space>
        <Card
          title={<span style={{ fontSize: 13 }}>Incident queue</span>}
          size="small"
          styles={{ body: { padding: 10 } }}
          style={{ maxWidth: 720 }}
          data-testid="rc-v2-t01-incidents"
        >
          <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }} data-testid="rc-v2-t01-assignee-monitor">
            Assignee width: {assigneeWidth}px
          </div>
          <Table<IncidentRow>
            bordered
            size="small"
            tableLayout="fixed"
            components={{ header: { cell: ResizableTitle } }}
            columns={mergedColumns}
            dataSource={incidentData}
            pagination={false}
            scroll={{ x: columns.reduce((s, c) => s + c.width, 0) }}
          />
        </Card>
      </Content>
    </Layout>
  );
}
