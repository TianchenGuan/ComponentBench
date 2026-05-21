'use client';

/**
 * table_static-antd-T10: Select multiple users (multi-select rows)
 *
 * The page is a form_section titled "Invite Users". The main element is a read-only Users table (Ant Design
 * Table) embedded within the section. Spacing mode is compact, reducing row padding and making targets denser. The table
 * shows columns: User ID, Name, Team. Clicking a row toggles its selection state (multi-select), and selected rows are highlighted;
 * a small counter above the table reads "Selected: N". Initial state: one unrelated user (USR-005) starts selected to ensure
 * the agent can both add and keep selections. No pagination or sorting; ~20 rows are available, requiring scanning but not
 * scrolling.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Title, Text } = Typography;

interface UserData {
  key: string;
  userId: string;
  name: string;
  team: string;
}

const usersData: UserData[] = [
  { key: 'USR-001', userId: 'USR-001', name: 'Alice Adams', team: 'Engineering' },
  { key: 'USR-002', userId: 'USR-002', name: 'Bob Baker', team: 'Design' },
  { key: 'USR-003', userId: 'USR-003', name: 'Carol Chen', team: 'Marketing' },
  { key: 'USR-004', userId: 'USR-004', name: 'David Davis', team: 'Engineering' },
  { key: 'USR-005', userId: 'USR-005', name: 'Eva Edwards', team: 'Sales' },
  { key: 'USR-006', userId: 'USR-006', name: 'Frank Foster', team: 'Design' },
  { key: 'USR-007', userId: 'USR-007', name: 'Grace Garcia', team: 'Engineering' },
  { key: 'USR-008', userId: 'USR-008', name: 'Henry Huang', team: 'Marketing' },
  { key: 'USR-009', userId: 'USR-009', name: 'Iris Ibrahim', team: 'Sales' },
  { key: 'USR-010', userId: 'USR-010', name: 'Jack Johnson', team: 'Engineering' },
  { key: 'USR-011', userId: 'USR-011', name: 'Karen Kim', team: 'Design' },
  { key: 'USR-012', userId: 'USR-012', name: 'Leo Li', team: 'Marketing' },
  { key: 'USR-013', userId: 'USR-013', name: 'Maria Martinez', team: 'Engineering' },
  { key: 'USR-014', userId: 'USR-014', name: 'Nathan Nguyen', team: 'Sales' },
  { key: 'USR-015', userId: 'USR-015', name: 'Olivia O\'Brien', team: 'Design' },
  { key: 'USR-016', userId: 'USR-016', name: 'Peter Park', team: 'Engineering' },
  { key: 'USR-017', userId: 'USR-017', name: 'Quinn Quinn', team: 'Marketing' },
  { key: 'USR-018', userId: 'USR-018', name: 'Rachel Robinson', team: 'Sales' },
  { key: 'USR-019', userId: 'USR-019', name: 'Sam Smith', team: 'Engineering' },
  { key: 'USR-020', userId: 'USR-020', name: 'Tina Taylor', team: 'Design' },
];

const columns = [
  { title: 'User ID', dataIndex: 'userId', key: 'userId', width: 100 },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Team', dataIndex: 'team', key: 'team', width: 120 },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  // Initial state: USR-005 is pre-selected
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(new Set(['USR-005']));
  const successFiredRef = React.useRef(false);

  const handleRowClick = (record: UserData) => {
    setSelectedRowKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(record.key)) {
        newSet.delete(record.key);
      } else {
        newSet.add(record.key);
      }
      return newSet;
    });
  };

  // Check for success condition: must include USR-002, USR-014, USR-019
  useEffect(() => {
    const required = ['USR-002', 'USR-014', 'USR-019'];
    const hasAllRequired = required.every(key => selectedRowKeys.has(key));
    
    if (hasAllRequired && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [selectedRowKeys, onSuccess]);

  return (
    <Card style={{ width: 550 }}>
      <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>Invite Users</Title>
      
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong>Users</Text>
        <Text type="secondary">Selected: {selectedRowKeys.size}</Text>
      </div>
      
      <Table
        dataSource={usersData}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="key"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          'aria-selected': selectedRowKeys.has(record.key),
          'data-row-key': record.key,
          style: {
            cursor: 'pointer',
            background: selectedRowKeys.has(record.key) ? '#e6f7ff' : undefined,
          },
        })}
      />
    </Card>
  );
}
