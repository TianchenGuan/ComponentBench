'use client';

/**
 * notification_center-antd-T03: Mark a single notification as read
 *
 * setup_description:
 * Baseline isolated card centered in the viewport with an inline Notification Center (no drawer).
 * The list shows 6 notifications with left-side status dots: unread items have a blue dot, read items have no dot.
 * 
 * The notification titled "Build completed" appears near the top of the list and is currently unread (blue dot shown).
 * On the right side of each row is a small icon-only action button with tooltip "Mark as read" (check icon) when the row is unread;
 * when the row becomes read, the action changes to "Mark as unread".
 * 
 * Distractors: two other notifications have similar wording ("Build started", "Build queued") but only "Build completed" should be changed.
 * Feedback: when toggled, the blue dot disappears and the unread badge count in the card header decreases by 1.
 *
 * success_trigger: Notification 'build_completed' is in the read state.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Badge, Button, Tooltip, Typography } from 'antd';
import { CheckOutlined, UndoOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface Notification {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 'build_completed', title: 'Build completed', time: '5 min ago', read: false },
  { id: 'build_started', title: 'Build started', time: '10 min ago', read: false },
  { id: 'build_queued', title: 'Build queued', time: '15 min ago', read: true },
  { id: 'deploy_success', title: 'Deployment successful', time: '1 hour ago', read: true },
  { id: 'test_passed', title: 'All tests passed', time: '2 hours ago', read: false },
  { id: 'pr_merged', title: 'PR merged to main', time: '3 hours ago', read: true },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const successCalledRef = useRef(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const buildCompleted = notifications.find(n => n.id === 'build_completed');
    if (buildCompleted?.read && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [notifications, onSuccess]);

  const toggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );
  };

  return (
    <Card
      title={
        <span>
          Notification Center <Badge count={unreadCount} style={{ marginLeft: 8 }} />
        </span>
      }
      style={{ width: 500 }}
    >
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            data-notif-id={item.id}
            data-read={item.read}
            actions={[
              <Tooltip
                key="toggle"
                title={item.read ? 'Mark as unread' : 'Mark as read'}
              >
                <Button
                  type="text"
                  size="small"
                  icon={item.read ? <UndoOutlined /> : <CheckOutlined />}
                  onClick={() => toggleRead(item.id)}
                  aria-label={item.read ? 'Mark as unread' : 'Mark as read'}
                  data-testid={`mark-read-${item.id}`}
                />
              </Tooltip>
            ]}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: item.read ? 'transparent' : '#1677ff',
                  border: item.read ? '1px solid #d9d9d9' : 'none',
                }}
              />
              <div>
                <Text strong={!item.read}>{item.title}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
