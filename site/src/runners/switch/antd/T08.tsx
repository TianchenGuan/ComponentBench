'use client';

/**
 * switch-antd-T08: Table row toggle: Admin access for Taylor Reed
 *
 * Layout: table_cell view centered on the page with a heading "Team members".
 * An Ant Design Table is shown with columns: Name, Role, and "Admin access" (Switch controls in the last column).
 * Exactly three rows are visible without scrolling: "Jordan Kim", "Taylor Reed" (target), and "Sam Patel".
 * Each row has its own Ant Design Switch in the "Admin access" column; the switches are visually identical and aligned.
 * Initial state: "Taylor Reed" has Admin access OFF; the other rows may have mixed states.
 * Clutter: high — the table includes sortable column headers and a search input above the table, but only the switches affect task success.
 * Feedback: toggling a row's switch immediately changes its checked state; no confirmation modal appears.
 */

import React, { useState } from 'react';
import { Card, Table, Switch, Input } from 'antd';
import type { TaskComponentProps } from '../types';

interface TeamMember {
  key: string;
  name: string;
  role: string;
  adminAccess: boolean;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<TeamMember[]>([
    { key: 'jordan-kim', name: 'Jordan Kim', role: 'Designer', adminAccess: true },
    { key: 'taylor-reed', name: 'Taylor Reed', role: 'Developer', adminAccess: false },
    { key: 'sam-patel', name: 'Sam Patel', role: 'Manager', adminAccess: false },
  ]);

  const handleSwitchChange = (key: string, newChecked: boolean) => {
    setData(prev => prev.map(row => 
      row.key === key ? { ...row, adminAccess: newChecked } : row
    ));
    if (key === 'taylor-reed' && newChecked) {
      onSuccess();
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: TeamMember, b: TeamMember) => a.name.localeCompare(b.name),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: (a: TeamMember, b: TeamMember) => a.role.localeCompare(b.role),
    },
    {
      title: 'Admin access',
      key: 'adminAccess',
      render: (_: unknown, record: TeamMember) => (
        <Switch
          checked={record.adminAccess}
          onChange={(checked) => handleSwitchChange(record.key, checked)}
          data-testid={`admin-access-${record.key}`}
          data-rowkey={record.key}
          aria-checked={record.adminAccess}
        />
      ),
    },
  ];

  return (
    <Card title="Team members" style={{ width: 600 }}>
      <Input.Search
        placeholder="Search team members..."
        style={{ marginBottom: 16 }}
      />
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        rowKey="key"
      />
    </Card>
  );
}
