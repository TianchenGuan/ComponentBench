'use client';

/**
 * segmented_control-antd-T05: Project Beta status → Paused (table cell)
 *
 * Layout: table cell editor in a dashboard-style card ("Projects").
 * The main element is an Ant Design Table with three rows:
 * - Project Alpha
 * - Project Beta
 * - Project Gamma
 *
 * One column is "Status". Each row's Status cell contains an Ant Design Segmented control with options:
 * "Active", "Paused", "Archived".
 *
 * Initial states:
 * - Project Alpha: Active
 * - Project Beta: Active
 * - Project Gamma: Paused
 *
 * Clutter (medium): Above the table there is a search input ("Search projects…") and a non-required "Filter" dropdown.
 * The segmented controls update the cell immediately (no Apply button).
 *
 * Success: In the row labeled "Project Beta", the Status segmented control selected value = Paused.
 */

import React, { useState } from 'react';
import { Card, Table, Input, Select, Space } from 'antd';
import { Segmented } from 'antd';
import type { TaskComponentProps } from '../types';

const statusOptions = ['Active', 'Paused', 'Archived'];

interface Project {
  key: string;
  name: string;
  status: string;
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [projects, setProjects] = useState<Project[]>([
    { key: 'alpha', name: 'Project Alpha', status: 'Active' },
    { key: 'beta', name: 'Project Beta', status: 'Active' },
    { key: 'gamma', name: 'Project Gamma', status: 'Paused' },
  ]);

  const handleStatusChange = (key: string, value: string | number) => {
    const val = String(value);
    setProjects(prev => prev.map(p => p.key === key ? { ...p, status: val } : p));
    if (key === 'beta' && val === 'Paused') {
      onSuccess();
    }
  };

  const columns = [
    {
      title: 'Project',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_: string, record: Project) => (
        <Segmented
          data-testid={`status-${record.key}`}
          data-canonical-type="segmented_control"
          data-selected-value={record.status}
          size="small"
          options={statusOptions}
          value={record.status}
          onChange={(value) => handleStatusChange(record.key, value)}
        />
      ),
    },
  ];

  return (
    <Card title="Projects" style={{ width: 600 }}>
      <Space style={{ marginBottom: 16, width: '100%' }}>
        <Input placeholder="Search projects…" style={{ width: 200 }} />
        <Select placeholder="Filter" style={{ width: 120 }}>
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="paused">Paused</Select.Option>
        </Select>
      </Space>
      <Table
        dataSource={projects}
        columns={columns}
        pagination={false}
        rowKey="key"
      />
    </Card>
  );
}
