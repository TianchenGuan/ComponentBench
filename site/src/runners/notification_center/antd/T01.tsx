'use client';

/**
 * notification_center-antd-T01: Open notifications drawer
 *
 * setup_description:
 * Baseline isolated card centered in the viewport. At the top of the card is a small header row with a bell icon button labeled "Notifications".
 * The bell is wrapped in an Ant Design Badge showing the current unread count ("3"). No other badges on the page show a number.
 * 
 * The Notification Center itself is not visible until the bell is activated: clicking the bell opens an Ant Design Drawer that slides in from the right.
 * The drawer title is "Notification Center" and contains a scrollable list of notification rows (titles + timestamps), but the task only requires opening it.
 * 
 * Distractors: a non-functional "Help" link in the card footer and a "Messages" icon button (no badge) next to the bell. These do not open the drawer.
 * Feedback: the drawer opening animation is immediate; there is no confirmation button for opening/closing.
 *
 * success_trigger: The Notification Center drawer for the only instance is open (visible and interactive).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Drawer, List, Typography } from 'antd';
import { BellOutlined, MessageOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text, Link } = Typography;

const notifications = [
  { id: '1', title: 'System update available', time: '2 minutes ago' },
  { id: '2', title: 'New comment on your post', time: '15 minutes ago' },
  { id: '3', title: 'Meeting reminder', time: '1 hour ago' },
  { id: '4', title: 'Your report is ready', time: '2 hours ago' },
  { id: '5', title: 'Welcome to the platform', time: '1 day ago' },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (drawerOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [drawerOpen, onSuccess]);

  return (
    <>
      <Card
        title="Dashboard"
        style={{ width: 500 }}
        extra={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button
              type="text"
              icon={<MessageOutlined />}
              aria-label="Messages"
              data-testid="messages-btn"
            />
            <Badge count={3}>
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => setDrawerOpen(true)}
                aria-label="Notifications"
                data-testid="notif-bell-primary"
              />
            </Badge>
          </div>
        }
      >
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          <Text type="secondary">Your dashboard content goes here</Text>
        </div>
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
          <Link href="#" style={{ color: '#999' }}>Help</Link>
        </div>
      </Card>

      <Drawer
        title="Notification Center"
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={360}
        data-testid="notif-drawer-primary"
        aria-label="Notification Center"
      >
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={item.title}
                description={item.time}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
}
