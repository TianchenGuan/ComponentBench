'use client';

/**
 * data_table_sortable-antd-T04: Employees - sort Start date newest→oldest (top-right card)
 *
 * Single Ant Design Table in an isolated card titled "Employees", anchored near the top-right.
 * - Columns: Employee, Team, Start date, Location.
 * - Start date is sortable; clicking the header toggles sort direction.
 * - Initial state: unsorted.
 *
 * Distractors: a small "Search" input above the table (present but not required).
 * Success: Start date sorted descending (newest first).
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../types';

interface EmployeeData {
  key: string;
  employee: string;
  team: string;
  startDate: string;
  location: string;
}

const employeesData: EmployeeData[] = [
  { key: '1', employee: 'Sarah Chen', team: 'Engineering', startDate: '2024-01-15', location: 'San Francisco' },
  { key: '2', employee: 'Mike Johnson', team: 'Product', startDate: '2023-06-20', location: 'New York' },
  { key: '3', employee: 'Lisa Park', team: 'Design', startDate: '2023-11-08', location: 'Seattle' },
  { key: '4', employee: 'Tom Williams', team: 'Engineering', startDate: '2022-03-12', location: 'Austin' },
  { key: '5', employee: 'Amy Rodriguez', team: 'Marketing', startDate: '2023-09-01', location: 'Los Angeles' },
  { key: '6', employee: 'James Lee', team: 'Sales', startDate: '2024-02-01', location: 'Chicago' },
  { key: '7', employee: 'Emma Davis', team: 'Engineering', startDate: '2023-04-18', location: 'Denver' },
  { key: '8', employee: 'Chris Brown', team: 'Product', startDate: '2022-08-25', location: 'Boston' },
  { key: '9', employee: 'Nina Patel', team: 'Design', startDate: '2023-07-10', location: 'Portland' },
  { key: '10', employee: 'David Kim', team: 'Engineering', startDate: '2022-12-05', location: 'Miami' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [sortedInfo, setSortedInfo] = useState<SorterResult<EmployeeData>>({});

  const columns: ColumnsType<EmployeeData> = [
    { title: 'Employee', dataIndex: 'employee', key: 'employee' },
    { title: 'Team', dataIndex: 'team', key: 'team' },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      key: 'start_date',
      sorter: (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      sortOrder: sortedInfo.columnKey === 'start_date' ? sortedInfo.order : null,
    },
    { title: 'Location', dataIndex: 'location', key: 'location' },
  ];

  const handleChange = (_pagination: unknown, _filters: unknown, sorter: SorterResult<EmployeeData> | SorterResult<EmployeeData>[]) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo(singleSorter || {});
  };

  // Check success condition
  useEffect(() => {
    if (sortedInfo.columnKey === 'start_date' && sortedInfo.order === 'descend') {
      onSuccess();
    }
  }, [sortedInfo, onSuccess]);

  const sortModel: SortModel = sortedInfo.columnKey && sortedInfo.order
    ? [{ column_key: String(sortedInfo.columnKey), direction: sortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <Card style={{ width: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>Employees</span>
        <Input placeholder="Search" prefix={<SearchOutlined />} style={{ width: 200 }} disabled />
      </div>
      <Table
        dataSource={employeesData}
        columns={columns}
        pagination={false}
        size="middle"
        rowKey="key"
        onChange={handleChange}
        data-testid="table-employees"
        data-sort-model={JSON.stringify(sortModel)}
      />
    </Card>
  );
}
