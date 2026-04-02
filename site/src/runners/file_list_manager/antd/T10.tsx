'use client';

/**
 * file_list_manager-antd-T10: Sort attachments by size inside a table cell
 *
 * setup_description: The main page is a simple Projects table (table_cell layout) with several rows ("Q1 Audit",
 * "Website refresh", "Vendor onboarding", etc.) and columns like Owner, Status, Due date, and Attachments. Only
 * the "Q1 Audit" row has an interactive Attachments control: a small "3 files" pill button. Clicking that pill
 * opens a popover anchored to the cell, showing a mini file list manager as a table with sortable headers
 * (Name, Size, Modified). Clicking the Size header cycles: ascending → descending → none.
 *
 * Success: In the "Q1 Audit" attachments popover, the file list is sorted by Size in descending order (largest first).
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Popover, Typography } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import type { TaskComponentProps, SortConfig, FileItem } from '../types';
import { formatFileSize } from '../types';

const { Text } = Typography;

interface Project {
  id: string;
  name: string;
  owner: string;
  status: string;
  dueDate: string;
  attachmentCount: number;
}

const projects: Project[] = [
  { id: 'p1', name: 'Q1 Audit', owner: 'Alice', status: 'In Progress', dueDate: '2026-03-15', attachmentCount: 3 },
  { id: 'p2', name: 'Website refresh', owner: 'Bob', status: 'Planning', dueDate: '2026-04-01', attachmentCount: 5 },
  { id: 'p3', name: 'Vendor onboarding', owner: 'Carol', status: 'Completed', dueDate: '2026-02-28', attachmentCount: 2 },
  { id: 'p4', name: 'Budget review', owner: 'Dan', status: 'Pending', dueDate: '2026-03-30', attachmentCount: 1 },
];

const q1AuditAttachments: FileItem[] = [
  { id: 'a1', name: 'audit-checklist.pdf', type: 'PDF', size: 245000 },
  { id: 'a2', name: 'financial-summary.xlsx', type: 'XLSX', size: 512000 },
  { id: 'a3', name: 'notes.txt', type: 'TXT', size: 4500 },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    if (sortConfig.key === 'size' && sortConfig.direction === 'desc') {
      setCompleted(true);
      onSuccess();
    }
  }, [sortConfig, completed, onSuccess]);

  const handleSortClick = (key: 'name' | 'size') => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key: null, direction: null };
    });
  };

  const sortedAttachments = [...q1AuditAttachments].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'size') {
      return (a.size - b.size) * multiplier;
    }
    return a.name.localeCompare(b.name) * multiplier;
  });

  const renderSortIcon = (key: 'name' | 'size') => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === 'asc') return <SortAscendingOutlined />;
    if (sortConfig.direction === 'desc') return <SortDescendingOutlined />;
    return null;
  };

  const attachmentPopover = (
    <div style={{ width: 300 }} data-testid="flm-Q1 Audit Attachments">
      <Table
        dataSource={sortedAttachments}
        rowKey="id"
        size="small"
        pagination={false}
        columns={[
          {
            title: (
              <div
                onClick={() => handleSortClick('name')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                Name {renderSortIcon('name')}
              </div>
            ),
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: (
              <div
                onClick={() => handleSortClick('size')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                data-testid="flm-sort-size"
              >
                Size {renderSortIcon('size')}
              </div>
            ),
            dataIndex: 'size',
            key: 'size',
            width: 80,
            render: (size: number) => formatFileSize(size),
          },
        ]}
      />
      <div style={{ marginTop: 8, fontSize: 11, color: '#999' }}>
        Sort: {sortConfig.key || 'none'} {sortConfig.direction || ''}
      </div>
    </div>
  );

  const projectColumns = [
    {
      title: 'Project',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
    },
    {
      title: 'Due date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
    },
    {
      title: 'Attachments',
      key: 'attachments',
      width: 100,
      render: (_: unknown, record: Project) => {
        if (record.id === 'p1') {
          return (
            <Popover
              content={attachmentPopover}
              trigger="click"
              open={popoverOpen}
              onOpenChange={setPopoverOpen}
              placement="bottom"
            >
              <Button size="small" data-testid="flm-attachments-trigger">
                {record.attachmentCount} files
              </Button>
            </Popover>
          );
        }
        return <Text type="secondary">{record.attachmentCount} files</Text>;
      },
    },
  ];

  return (
    <Card title="Projects" style={{ width: 700 }} data-testid="flm-root">
      <Table
        dataSource={projects}
        columns={projectColumns}
        rowKey="id"
        size="small"
        pagination={false}
      />
    </Card>
  );
}
