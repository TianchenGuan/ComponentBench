'use client';

/**
 * data_table_sortable-antd-T08: Tasks - sort by Priority (High→Low), then Due date (earliest first)
 *
 * Single Ant Design Table in an isolated card titled "Tasks".
 * - Columns: Task, Priority, Due date, Owner, Status.
 * - Priority and Due date are both sortable with multi-column sorting enabled.
 * - Initial state: unsorted.
 *
 * Distractors: a "New task" button above the table.
 * Success: Multi-sort with Priority descending (priority 1) and Due date ascending (priority 2).
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType, SorterResult, SortOrder } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../types';

interface TaskData {
  key: string;
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  owner: string;
  status: string;
}

const priorityOrder = { High: 3, Medium: 2, Low: 1 };

const tasksData: TaskData[] = [
  { key: '1', task: 'Complete API integration', priority: 'High', dueDate: '2024-02-20', owner: 'Alice', status: 'In Progress' },
  { key: '2', task: 'Write unit tests', priority: 'Medium', dueDate: '2024-02-18', owner: 'Bob', status: 'Not Started' },
  { key: '3', task: 'Update documentation', priority: 'Low', dueDate: '2024-02-25', owner: 'Carol', status: 'Not Started' },
  { key: '4', task: 'Fix critical bug', priority: 'High', dueDate: '2024-02-15', owner: 'David', status: 'In Progress' },
  { key: '5', task: 'Code review', priority: 'Medium', dueDate: '2024-02-22', owner: 'Emma', status: 'Not Started' },
  { key: '6', task: 'Deploy to staging', priority: 'High', dueDate: '2024-02-17', owner: 'Frank', status: 'Blocked' },
  { key: '7', task: 'Performance testing', priority: 'Medium', dueDate: '2024-02-19', owner: 'Grace', status: 'Not Started' },
  { key: '8', task: 'UI polish', priority: 'Low', dueDate: '2024-02-28', owner: 'Henry', status: 'Not Started' },
  { key: '9', task: 'Security audit', priority: 'High', dueDate: '2024-02-16', owner: 'Iris', status: 'In Progress' },
  { key: '10', task: 'Database migration', priority: 'Medium', dueDate: '2024-02-21', owner: 'Jack', status: 'Blocked' },
];

const priorityColors: Record<TaskData['priority'], string> = {
  High: 'red',
  Medium: 'orange',
  Low: 'green',
};

export default function T08({ onSuccess }: TaskComponentProps) {
  const [sortedInfo, setSortedInfo] = useState<Record<string, SortOrder | undefined>>({});

  const columns: ColumnsType<TaskData> = [
    { title: 'Task', dataIndex: 'task', key: 'task' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      sorter: {
        compare: (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
        multiple: 1,
      },
      sortOrder: sortedInfo['priority'],
      render: (priority: TaskData['priority']) => <Tag color={priorityColors[priority]}>{priority}</Tag>,
    },
    {
      title: 'Due date',
      dataIndex: 'dueDate',
      key: 'due_date',
      sorter: {
        compare: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        multiple: 2,
      },
      sortOrder: sortedInfo['due_date'],
    },
    { title: 'Owner', dataIndex: 'owner', key: 'owner' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const handleChange = (_pagination: unknown, _filters: unknown, sorter: SorterResult<TaskData> | SorterResult<TaskData>[]) => {
    if (Array.isArray(sorter)) {
      const newSortedInfo: Record<string, SortOrder | undefined> = {};
      sorter.forEach((s) => {
        if (s.columnKey) {
          newSortedInfo[String(s.columnKey)] = s.order ?? undefined;
        }
      });
      setSortedInfo(newSortedInfo);
    } else if (sorter.columnKey) {
      setSortedInfo({ [String(sorter.columnKey)]: sorter.order ?? undefined });
    } else {
      setSortedInfo({});
    }
  };

  // Check success condition: Priority desc + Due date asc
  useEffect(() => {
    const priorityCorrect = sortedInfo['priority'] === 'descend';
    const dueDateCorrect = sortedInfo['due_date'] === 'ascend';
    const onlyTwoKeys = Object.keys(sortedInfo).filter(k => sortedInfo[k]).length === 2;
    
    if (priorityCorrect && dueDateCorrect && onlyTwoKeys) {
      onSuccess();
    }
  }, [sortedInfo, onSuccess]);

  const sortModel: SortModel = [];
  if (sortedInfo['priority']) {
    sortModel.push({ column_key: 'priority', direction: sortedInfo['priority'] === 'ascend' ? 'asc' : 'desc', priority: 1 });
  }
  if (sortedInfo['due_date']) {
    sortModel.push({ column_key: 'due_date', direction: sortedInfo['due_date'] === 'ascend' ? 'asc' : 'desc', priority: 2 });
  }

  return (
    <Card style={{ width: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>Tasks</span>
        <Button type="primary" icon={<PlusOutlined />} disabled>New task</Button>
      </div>
      <Table
        dataSource={tasksData}
        columns={columns}
        pagination={false}
        size="middle"
        rowKey="key"
        onChange={handleChange}
        data-testid="table-tasks"
        data-sort-model={JSON.stringify(sortModel)}
      />
    </Card>
  );
}
