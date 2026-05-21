'use client';

/**
 * breadcrumb-antd-T03: Select user from breadcrumb dropdown
 * 
 * Centered isolated card titled "User Profile".
 * The "Users" item has a dropdown with Alice, Bob, Charlie.
 * Selecting "Bob" updates the card to show "Selected user: Bob".
 */

import React, { useState } from 'react';
import { Breadcrumb, Card, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleSelectUser = (user: string) => {
    if (selectedUser) return;
    setSelectedUser(user);
    if (user === 'Bob') {
      onSuccess();
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'alice',
      label: 'Alice',
      onClick: () => handleSelectUser('Alice'),
      'data-testid': 'antd-menu-item-alice',
    },
    {
      key: 'bob',
      label: 'Bob',
      onClick: () => handleSelectUser('Bob'),
      'data-testid': 'antd-menu-item-bob',
    },
    {
      key: 'charlie',
      label: 'Charlie',
      onClick: () => handleSelectUser('Charlie'),
      'data-testid': 'antd-menu-item-charlie',
    },
  ];

  return (
    <Card title="User Profile" style={{ width: 400 }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: <span data-testid="antd-breadcrumb-dashboard">Dashboard</span>,
          },
          {
            title: (
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={['click']}
                overlayStyle={{ minWidth: 120 }}
              >
                <a
                  onClick={(e) => e.preventDefault()}
                  data-testid="antd-breadcrumb-users-dropdown"
                  style={{ cursor: 'pointer' }}
                >
                  Users <DownOutlined style={{ fontSize: 10 }} />
                </a>
              </Dropdown>
            ),
          },
          {
            title: <span data-testid="antd-breadcrumb-profile">Profile</span>,
          },
        ]}
      />
      {selectedUser ? (
        <p style={{ color: '#52c41a', fontWeight: 500 }}>
          Selected user: {selectedUser}
        </p>
      ) : (
        <p>
          Click "Users" to open the dropdown and select a user.
        </p>
      )}
    </Card>
  );
}
