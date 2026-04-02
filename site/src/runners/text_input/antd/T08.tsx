'use client';

/**
 * text_input-antd-T08: Edit nickname in users table
 * 
 * Scene is a dashboard-like page with an AntD Table in the center (layout=table_cell, clutter=high). The
 * table has three rows with user names: "Alex Kim", "Sam Rivera", and "Jordan Lee". In the "Nickname" column,
 * each row contains an always-visible Ant Design Input (instances=3) pre-filled with a short nickname. Only
 * the Nickname inputs are of canonical_type text_input; other table columns contain non-editable text and
 * small icon buttons as distractors. Spacing is comfortable and scale is default. No modals or popovers are involved.
 * 
 * Success: In the Users table row labeled "Sam Rivera", the Input in the "Nickname" column has value "Sparrow" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

interface UserRow {
  key: string;
  name: string;
  nickname: string;
  email: string;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<UserRow[]>([
    { key: 'alex', name: 'Alex Kim', nickname: 'Ace', email: 'alex@example.com' },
    { key: 'sam', name: 'Sam Rivera', nickname: 'Flash', email: 'sam@example.com' },
    { key: 'jordan', name: 'Jordan Lee', nickname: 'Storm', email: 'jordan@example.com' },
  ]);

  useEffect(() => {
    const samRow = data.find(row => row.name === 'Sam Rivera');
    if (samRow && samRow.nickname.trim() === 'Sparrow') {
      onSuccess();
    }
  }, [data, onSuccess]);

  const handleNicknameChange = (key: string, value: string) => {
    setData(prev => prev.map(row => 
      row.key === key ? { ...row, nickname: value } : row
    ));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text: string, record: UserRow) => (
        <Input
          value={text}
          onChange={(e) => handleNicknameChange(record.key, e.target.value)}
          data-testid={`nickname-input-${record.key}`}
          data-rowid={record.key}
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" icon={<EditOutlined />} />
          <Button size="small" icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: 650 }}>
      <h3 style={{ marginBottom: 16 }}>Users</h3>
      <Table 
        dataSource={data} 
        columns={columns} 
        pagination={false}
        size="middle"
        data-testid="users-table"
      />
    </div>
  );
}
