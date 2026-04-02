'use client';

/**
 * notification_center-antd-T08: Clear all notifications with confirmation
 *
 * setup_description:
 * Dark theme is enabled (dark surfaces and light text). The page still uses an isolated card in the center with a bell icon + unread Badge.
 * Clicking the bell opens a right-side Notification Center Drawer.
 * 
 * In the drawer header, next to the title, there is a danger-styled text button labeled "Clear all".
 * Clicking "Clear all" opens a centered Ant Design confirmation modal with:
 *   - title: "Clear all notifications?"
 *   - body text warning that the action cannot be undone
 *   - buttons: "Cancel" (default) and "Clear" (danger)
 * 
 * Initial state:
 *   - The drawer is closed.
 *   - The list contains 12 notifications (mix of read/unread).
 * 
 * The task requires completing the full clear flow, including pressing the modal's confirm button.
 * Feedback: after confirming, the list becomes empty and the unread badge updates to "0".
 *
 * success_trigger: The Notification Center contains zero notifications after the clear operation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Drawer, List, Modal, Typography, ConfigProvider, theme } from 'antd';
import { BellOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const initialNotifications = [
  { id: '1', title: 'New message received', read: false },
  { id: '2', title: 'System update available', read: false },
  { id: '3', title: 'Report generated', read: true },
  { id: '4', title: 'Meeting reminder', read: false },
  { id: '5', title: 'Task completed', read: true },
  { id: '6', title: 'New comment', read: true },
  { id: '7', title: 'Password changed', read: true },
  { id: '8', title: 'Login from new device', read: false },
  { id: '9', title: 'File shared with you', read: true },
  { id: '10', title: 'Subscription renewed', read: true },
  { id: '11', title: 'Invoice available', read: false },
  { id: '12', title: 'Security alert', read: false },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const successCalledRef = useRef(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (notifications.length === 0 && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [notifications, onSuccess]);

  const handleClearAll = () => {
    setModalOpen(true);
  };

  const handleConfirmClear = () => {
    setNotifications([]);
    setModalOpen(false);
  };

  return (
    <>
      <Card
        title="Dashboard"
        style={{ width: 400 }}
        extra={
          <Badge count={unreadCount}>
            <Button
              type="text"
              icon={<BellOutlined />}
              onClick={() => setDrawerOpen(true)}
              aria-label="Notifications"
              data-testid="notif-bell-primary"
            />
          </Badge>
        }
      >
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          <Text>Dashboard content</Text>
        </div>
      </Card>

      <Drawer
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Notification Center</span>
            <Button 
              type="text" 
              danger 
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              Clear all
            </Button>
          </div>
        }
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={360}
        data-testid="notif-drawer-primary"
      >
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Text type="secondary">No notifications</Text>
          </div>
        ) : (
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {!item.read && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#1677ff',
                      }}
                    />
                  )}
                  <Text strong={!item.read}>{item.title}</Text>
                </div>
              </List.Item>
            )}
          />
        )}
      </Drawer>

      <Modal
        title="Clear all notifications?"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="clear" type="primary" danger onClick={handleConfirmClear}>
            Clear
          </Button>,
        ]}
      >
        <p>This action cannot be undone. All notifications will be permanently removed.</p>
      </Modal>
    </>
  );
}
