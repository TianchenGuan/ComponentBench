'use client';

/**
 * data_table_paginated-antd-v2-T03: Invite Manager modal — configure Invited users only
 *
 * Modal flow: "Invite Manager" button opens a dialog with two stacked Ant Design
 * tables — "Active users" and "Invited users". Each has footer pagination + size changer.
 * Initial: both page 1, size 25. Target: Invited users → size 10, page 2.
 * Active users must remain page 1, size 25.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Button, Modal, Tag, Space, Typography } from 'antd';
import { UserAddOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface UserRecord { key: string; userId: string; name: string; email: string; role: string; }

function generateUsers(count: number, prefix: string): UserRecord[] {
  const roles = ['Admin', 'Editor', 'Viewer', 'Contributor'];
  const names = ['Alice Kim', 'Bob Chen', 'Carol Wu', 'Dan Lee', 'Eve Patel', 'Frank Torres',
    'Grace Liu', 'Henry Nakamura', 'Ivy Singh', 'Jack Brown', 'Kate Davis', 'Leo Garcia',
    'Maria Johnson', 'Nick Williams', 'Olivia Martin', 'Paul Anderson', 'Quinn Thomas', 'Rose White',
    'Sam Harris', 'Tina Clark'];
  return Array.from({ length: count }, (_, i) => ({
    key: `${prefix}-${String(i + 1).padStart(3, '0')}`,
    userId: `${prefix}-${String(i + 1).padStart(3, '0')}`,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@co.io`,
    role: roles[i % roles.length],
  }));
}

const userColumns = [
  { title: 'ID', dataIndex: 'userId', key: 'userId', width: 90 },
  { title: 'Name', dataIndex: 'name', key: 'name', width: 140 },
  { title: 'Email', dataIndex: 'email', key: 'email', width: 180 },
  { title: 'Role', dataIndex: 'role', key: 'role', width: 100,
    render: (r: string) => <Tag>{r}</Tag> },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeUsers] = useState(() => generateUsers(80, 'ACT'));
  const [invitedUsers] = useState(() => generateUsers(60, 'INV'));

  const [activePage, setActivePage] = useState(1);
  const [activeSize, setActiveSize] = useState(25);
  const [invitedPage, setInvitedPage] = useState(1);
  const [invitedSize, setInvitedSize] = useState(25);

  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      invitedSize === 10 && invitedPage === 2 &&
      activeSize === 25 && activePage === 1
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [invitedSize, invitedPage, activeSize, activePage, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Card size="small">
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setModalOpen(true)}>
          Invite Manager
        </Button>
      </Card>

      <Modal
        title={<Space>Invite Manager <QuestionCircleOutlined style={{ color: '#999' }} /></Space>}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={720}
        data-testid="invite-modal"
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Active users</Text>
        <Table
          dataSource={activeUsers}
          columns={userColumns}
          size="small"
          pagination={{
            current: activePage,
            pageSize: activeSize,
            total: activeUsers.length,
            showSizeChanger: true,
            pageSizeOptions: ['10', '25', '50'],
            onChange: (p, s) => { setActivePage(p); setActiveSize(s); },
          }}
          data-testid="active-users-table"
          data-current-page={activePage}
          data-page-size={activeSize}
          style={{ marginBottom: 24 }}
        />

        <Text strong style={{ display: 'block', marginBottom: 8 }}>Invited users</Text>
        <Table
          dataSource={invitedUsers}
          columns={userColumns}
          size="small"
          pagination={{
            current: invitedPage,
            pageSize: invitedSize,
            total: invitedUsers.length,
            showSizeChanger: true,
            pageSizeOptions: ['10', '25', '50'],
            onChange: (p, s) => { setInvitedPage(p); setInvitedSize(s); },
          }}
          data-testid="invited-users-table"
          data-current-page={invitedPage}
          data-page-size={invitedSize}
        />
      </Modal>
    </div>
  );
}
