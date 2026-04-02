'use client';

/**
 * notification_center-antd-T02: Show only unread notifications
 *
 * setup_description:
 * Baseline isolated card centered in the viewport. The Notification Center is rendered inline (no drawer in this task): a card titled "Notification Center"
 * with Tabs along the top: "All", "Unread", and "Archived". The "All" tab is selected initially.
 * 
 * The list below shows 8 notifications; unread items have a blue dot indicator on the left and also contribute to the unread badge count ("3") shown in the card title.
 * Switching to the "Unread" tab filters the list to only unread items and updates the tab underline/active style.
 * 
 * Distractors: below the card there is an unrelated "Activity Log" table and a "Refresh" button; neither affects the notification list.
 * Feedback: tab switch is immediate and does not require an Apply/OK button.
 *
 * success_trigger: The active Notification Center view/tab is set to 'Unread'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tabs, List, Badge, Button, Table, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const notifications = [
  { id: '1', title: 'New deployment ready', time: '5 min ago', unread: true },
  { id: '2', title: 'Security scan completed', time: '20 min ago', unread: false },
  { id: '3', title: 'Invoice generated', time: '1 hour ago', unread: true },
  { id: '4', title: 'User feedback received', time: '2 hours ago', unread: false },
  { id: '5', title: 'Performance alert', time: '3 hours ago', unread: true },
  { id: '6', title: 'Backup completed', time: '5 hours ago', unread: false },
  { id: '7', title: 'API rate limit warning', time: '6 hours ago', unread: false },
  { id: '8', title: 'License renewal reminder', time: '1 day ago', unread: false },
];

const activityLogData = [
  { key: '1', event: 'Login', user: 'admin', time: '10:30 AM' },
  { key: '2', event: 'File upload', user: 'user1', time: '10:15 AM' },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState('All');
  const successCalledRef = useRef(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    if (activeTab === 'Unread' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeTab, onSuccess]);

  const filteredNotifications = activeTab === 'Unread' 
    ? notifications.filter(n => n.unread)
    : activeTab === 'Archived'
    ? []
    : notifications;

  return (
    <div>
      <Card 
        title={
          <span>
            Notification Center <Badge count={unreadCount} style={{ marginLeft: 8 }} />
          </span>
        }
        style={{ width: 500, marginBottom: 24 }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'All', label: 'All' },
            { key: 'Unread', label: 'Unread', children: null },
            { key: 'Archived', label: 'Archived' },
          ]}
          data-testid="notif-tabs"
        />
        <List
          dataSource={filteredNotifications}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {item.unread && (
                  <div 
                    style={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      background: '#1677ff' 
                    }} 
                  />
                )}
                <div>
                  <Text strong={item.unread}>{item.title}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                </div>
              </div>
            </List.Item>
          )}
          locale={{ emptyText: 'No notifications' }}
        />
      </Card>

      <Card title="Activity Log" style={{ width: 500 }}>
        <Table
          dataSource={activityLogData}
          columns={[
            { title: 'Event', dataIndex: 'event', key: 'event' },
            { title: 'User', dataIndex: 'user', key: 'user' },
            { title: 'Time', dataIndex: 'time', key: 'time' },
          ]}
          pagination={false}
          size="small"
        />
        <Button style={{ marginTop: 12 }}>Refresh</Button>
      </Card>
    </div>
  );
}
