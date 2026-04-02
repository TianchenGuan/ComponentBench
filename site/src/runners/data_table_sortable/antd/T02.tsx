'use client';

/**
 * data_table_sortable-antd-T02: Customers - sort Name Z→A
 *
 * Single Ant Design Table in an isolated card titled "Customers".
 * - Center placement, default scale, comfortable spacing.
 * - Columns: Name, City, Segment, Sign-up date.
 * - The Name header is sortable (clicking cycles through unsorted → ascend → descend).
 * - Initial state: unsorted.
 *
 * Distractors: a non-interactive "Export CSV" button above the table (disabled).
 * Success: Name column sorted descending (Z→A).
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Button } from 'antd';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../types';

interface CustomerData {
  key: string;
  name: string;
  city: string;
  segment: string;
  signUpDate: string;
}

const customersData: CustomerData[] = [
  { key: '1', name: 'Alice Thompson', city: 'Boston', segment: 'Enterprise', signUpDate: '2023-06-15' },
  { key: '2', name: 'Bob Martinez', city: 'Chicago', segment: 'SMB', signUpDate: '2023-08-22' },
  { key: '3', name: 'Carol White', city: 'Denver', segment: 'Enterprise', signUpDate: '2023-04-10' },
  { key: '4', name: 'Daniel Kim', city: 'Seattle', segment: 'Startup', signUpDate: '2023-11-05' },
  { key: '5', name: 'Emma Davis', city: 'Austin', segment: 'SMB', signUpDate: '2023-07-30' },
  { key: '6', name: 'Frank Wilson', city: 'Portland', segment: 'Enterprise', signUpDate: '2023-03-18' },
  { key: '7', name: 'Grace Lee', city: 'Miami', segment: 'Startup', signUpDate: '2023-09-12' },
  { key: '8', name: 'Henry Brown', city: 'Atlanta', segment: 'SMB', signUpDate: '2023-05-25' },
  { key: '9', name: 'Iris Johnson', city: 'Phoenix', segment: 'Enterprise', signUpDate: '2023-10-08' },
  { key: '10', name: 'Jack Smith', city: 'Dallas', segment: 'Startup', signUpDate: '2023-02-14' },
  { key: '11', name: 'Karen Miller', city: 'San Diego', segment: 'SMB', signUpDate: '2023-12-01' },
  { key: '12', name: 'Liam Taylor', city: 'Nashville', segment: 'Enterprise', signUpDate: '2023-01-20' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [sortedInfo, setSortedInfo] = useState<SorterResult<CustomerData>>({});

  const columns: ColumnsType<CustomerData> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
    },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'Segment', dataIndex: 'segment', key: 'segment' },
    {
      title: 'Sign-up date',
      dataIndex: 'signUpDate',
      key: 'signUpDate',
      sorter: (a, b) => new Date(a.signUpDate).getTime() - new Date(b.signUpDate).getTime(),
      sortOrder: sortedInfo.columnKey === 'signUpDate' ? sortedInfo.order : null,
    },
  ];

  const handleChange = (_pagination: unknown, _filters: unknown, sorter: SorterResult<CustomerData> | SorterResult<CustomerData>[]) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo(singleSorter || {});
  };

  // Check success condition
  useEffect(() => {
    if (sortedInfo.columnKey === 'name' && sortedInfo.order === 'descend') {
      onSuccess();
    }
  }, [sortedInfo, onSuccess]);

  const sortModel: SortModel = sortedInfo.columnKey && sortedInfo.order
    ? [{ column_key: String(sortedInfo.columnKey), direction: sortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <Card style={{ width: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>Customers</span>
        <Button disabled>Export CSV</Button>
      </div>
      <Table
        dataSource={customersData}
        columns={columns}
        pagination={false}
        size="middle"
        rowKey="key"
        onChange={handleChange}
        data-testid="table-customers"
        data-sort-model={JSON.stringify(sortModel)}
      />
    </Card>
  );
}
