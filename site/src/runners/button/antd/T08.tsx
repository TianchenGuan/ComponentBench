'use client';

/**
 * button-antd-T08: Download from table row (dense table cell icon button)
 * 
 * Dark theme compact table with three rows: Project Aurora, Borealis, Cirrus.
 * Rightmost column has download icon buttons (small).
 * Task: Click download button for "Project Aurora" row.
 */

import React, { useState } from 'react';
import { Button, Table, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import type { ColumnsType } from 'antd/es/table';

interface ProjectRow {
  key: string;
  name: string;
  status: string;
}

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [downloadedRows, setDownloadedRows] = useState<Set<string>>(new Set());

  const handleDownload = (rowKey: string) => {
    if (downloadedRows.has(rowKey)) return;
    
    setDownloadedRows((prev) => new Set(Array.from(prev).concat(rowKey)));
    
    if (rowKey === 'Project Aurora') {
      onSuccess();
    }
  };

  const dataSource: ProjectRow[] = [
    { key: 'Project Aurora', name: 'Project Aurora', status: 'Active' },
    { key: 'Project Borealis', name: 'Project Borealis', status: 'Pending' },
    { key: 'Project Cirrus', name: 'Project Cirrus', status: 'Active' },
  ];

  const columns: ColumnsType<ProjectRow> = [
    {
      title: 'Project',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        downloadedRows.has(record.key) ? (
          <Tag color="green">Downloaded</Tag>
        ) : (
          <Button
            type="text"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.key)}
            data-testid={`antd-btn-download-${record.key.toLowerCase().replace(/\s+/g, '-')}`}
          />
        )
      ),
    },
  ];

  return (
    <div style={{ width: 500 }}>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size="small"
        data-table-id="antd-downloads-table"
      />
    </div>
  );
}
