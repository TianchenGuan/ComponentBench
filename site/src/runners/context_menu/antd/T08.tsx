'use client';

/**
 * context_menu-antd-T08: Table cell menu: scroll to Export as CSV
 *
 * Scene: theme=light, spacing=comfortable, layout=table_cell, placement=center, scale=default, instances=1, clutter=medium.
 *
 * Layout: A small 3×4 data table is rendered near the center of the viewport.
 *
 * Target element: the first row has a row label "Row 1". In that row, the rightmost cell is labeled "Total".
 * Right-clicking the Total cell opens a custom context menu. Other cells do not open a custom menu.
 *
 * Context menu: AntD Dropdown trigger=['contextMenu'] anchored to the Total cell.
 * The menu is intentionally long (~22 items) and becomes scrollable within a fixed-height popover.
 * The target item "Export as CSV" appears near the bottom and is NOT visible without scrolling.
 *
 * Success: The activated item path equals ['Export as CSV'] for the Total cell context menu.
 */

import React, { useState, useEffect } from 'react';
import { Dropdown, Card, Table } from 'antd';
import type { MenuProps, TableColumnsType } from 'antd';
import type { TaskComponentProps } from '../types';

interface DataRow {
  key: string;
  row: string;
  col1: number;
  col2: number;
  col3: number;
  total: number;
}

const tableData: DataRow[] = [
  { key: '1', row: 'Row 1', col1: 120, col2: 85, col3: 45, total: 250 },
  { key: '2', row: 'Row 2', col1: 98, col2: 112, col3: 67, total: 277 },
  { key: '3', row: 'Row 3', col1: 156, col2: 43, col3: 89, total: 288 },
];

const longMenuItems: MenuProps['items'] = [
  { key: 'Copy', label: 'Copy' },
  { key: 'Copy as JSON', label: 'Copy as JSON' },
  { key: 'Copy as Markdown', label: 'Copy as Markdown' },
  { type: 'divider' },
  { key: 'Pin column', label: 'Pin column' },
  { key: 'Unpin column', label: 'Unpin column' },
  { key: 'Hide column', label: 'Hide column' },
  { key: 'Show all columns', label: 'Show all columns' },
  { type: 'divider' },
  { key: 'Sort ascending', label: 'Sort ascending' },
  { key: 'Sort descending', label: 'Sort descending' },
  { key: 'Clear sorting', label: 'Clear sorting' },
  { type: 'divider' },
  { key: 'Filter by value', label: 'Filter by value' },
  { key: 'Clear filter', label: 'Clear filter' },
  { type: 'divider' },
  { key: 'Group by column', label: 'Group by column' },
  { key: 'Aggregate values', label: 'Aggregate values' },
  { type: 'divider' },
  { key: 'Export as PDF', label: 'Export as PDF' },
  { key: 'Export as Excel', label: 'Export as Excel' },
  { key: 'Export as CSV', label: 'Export as CSV' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [lastActivatedItem, setLastActivatedItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (lastActivatedItem === 'Export as CSV' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastActivatedItem, successTriggered, onSuccess]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    setLastActivatedItem(key);
  };

  const columns: TableColumnsType<DataRow> = [
    { title: '', dataIndex: 'row', key: 'row', width: 80 },
    { title: 'Col 1', dataIndex: 'col1', key: 'col1', align: 'right' },
    { title: 'Col 2', dataIndex: 'col2', key: 'col2', align: 'right' },
    { title: 'Col 3', dataIndex: 'col3', key: 'col3', align: 'right' },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      render: (value: number) => value,
    },
  ];

  return (
    <Card style={{ width: 500 }}>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>
        Sales Data Summary
      </div>
      <Dropdown
        menu={{
          items: longMenuItems,
          onClick: handleMenuClick,
          style: { maxHeight: 300, overflowY: 'auto' },
        }}
        trigger={['contextMenu']}
      >
        <div data-testid="table-context-area">
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            size="small"
            bordered
            data-testid="data-table"
          />
        </div>
      </Dropdown>
      <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
        Last action: <strong data-testid="last-action">{lastActivatedItem || 'None'}</strong>
      </div>
      <div style={{ marginTop: 4, fontSize: 11, color: '#999' }}>
        Tip: Right-click the Total cell in Row 1 to open context menu, scroll to find &quot;Export as CSV&quot;
      </div>
    </Card>
  );
}
