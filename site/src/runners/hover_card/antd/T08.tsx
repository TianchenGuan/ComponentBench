'use client';

/**
 * hover_card-antd-T08: Scroll to a table row and open its hover card
 *
 * Layout: table_cell scene with a compact, data-dense activity table (light theme, compact spacing, small scale).
 *
 * The page resembles an admin "Activity" panel:
 * - A scrollable table container with many rows (virtualized/scrollable) and columns (Time, User, Action, Status).
 * - The "User" column entries are hover targets that can open a single shared AntD Popover hover card (controlled open state).
 * - The hover card shows a small user profile snippet (role + last active date).
 *
 * The target row ("Jordan Patel") is not visible on initial load; it requires scrolling the table container.
 * Distractors:
 * - Sticky table header and a top toolbar with filters/search (not required for success).
 * - Other user names are similar in typography and spacing.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Popover, Typography, Input, Avatar } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const users = [
  { name: 'Emma Wilson', role: 'Admin', lastActive: '2 hours ago' },
  { name: 'Liam Chen', role: 'Editor', lastActive: '1 hour ago' },
  { name: 'Sophia Martinez', role: 'Viewer', lastActive: '30 mins ago' },
  { name: 'Noah Kim', role: 'Editor', lastActive: '4 hours ago' },
  { name: 'Olivia Brown', role: 'Admin', lastActive: '1 day ago' },
  { name: 'James Davis', role: 'Viewer', lastActive: '3 hours ago' },
  { name: 'Ava Garcia', role: 'Editor', lastActive: '5 hours ago' },
  { name: 'William Johnson', role: 'Viewer', lastActive: '2 days ago' },
  { name: 'Isabella Miller', role: 'Admin', lastActive: '6 hours ago' },
  { name: 'Benjamin Lee', role: 'Editor', lastActive: '1 week ago' },
  { name: 'Mia Anderson', role: 'Viewer', lastActive: '8 hours ago' },
  { name: 'Lucas Taylor', role: 'Editor', lastActive: '12 hours ago' },
  { name: 'Charlotte Thomas', role: 'Admin', lastActive: '2 weeks ago' },
  { name: 'Jordan Patel', role: 'Senior Admin', lastActive: 'Just now' },
  { name: 'Amelia White', role: 'Viewer', lastActive: '1 day ago' },
];

const activities = [
  'Logged in', 'Updated profile', 'Created document', 'Deleted file', 
  'Changed settings', 'Viewed report', 'Exported data', 'Added comment'
];

const statuses = ['Success', 'Pending', 'Failed'];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [openUser, setOpenUser] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (activeUser === 'Jordan Patel' && openUser === 'Jordan Patel' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeUser, openUser, onSuccess]);

  const createHoverCardContent = (user: typeof users[0]) => (
    <div style={{ width: 200 }} data-testid={`hover-card-${user.name.replace(' ', '-')}`} data-active-user={user.name.toLowerCase().replace(' ', '-')}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Avatar size={36} icon={<UserOutlined />} />
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{user.name}</div>
          <div style={{ fontSize: 11, color: '#666' }}>{user.role}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#999' }}>
        Last active: {user.lastActive}
      </div>
    </div>
  );

  return (
    <Card 
      title="Activity Log" 
      style={{ width: 600 }}
      extra={<Input size="small" placeholder="Search..." prefix={<SearchOutlined />} style={{ width: 150 }} />}
    >
      <div 
        style={{ 
          maxHeight: 300, 
          overflowY: 'auto',
          border: '1px solid #f0f0f0',
          borderRadius: 4
        }}
        data-testid="activity-table-scroll"
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fafafa' }}>
            <tr>
              <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Time</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>User</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Action</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.name} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid #f0f0f0' }}>
                  {`${9 + idx}:${String(idx * 3 % 60).padStart(2, '0')} AM`}
                </td>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid #f0f0f0' }}>
                  <Popover 
                    content={createHoverCardContent(user)}
                    trigger="hover"
                    open={openUser === user.name}
                    onOpenChange={(visible) => {
                      if (visible) {
                        setOpenUser(user.name);
                        setActiveUser(user.name);
                      } else {
                        setOpenUser(null);
                      }
                    }}
                  >
                    <span
                      data-testid={`user-${user.name.replace(' ', '-')}`}
                      data-cb-instance={`User: ${user.name}`}
                      style={{ color: '#1677ff', cursor: 'pointer' }}
                    >
                      {user.name}
                    </span>
                  </Popover>
                </td>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid #f0f0f0' }}>
                  {activities[idx % activities.length]}
                </td>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ 
                    padding: '2px 6px', 
                    borderRadius: 4, 
                    fontSize: 11,
                    backgroundColor: statuses[idx % 3] === 'Success' ? '#f6ffed' : 
                                    statuses[idx % 3] === 'Pending' ? '#fffbe6' : '#fff2e8',
                    color: statuses[idx % 3] === 'Success' ? '#52c41a' : 
                           statuses[idx % 3] === 'Pending' ? '#faad14' : '#ff4d4f'
                  }}>
                    {statuses[idx % 3]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
