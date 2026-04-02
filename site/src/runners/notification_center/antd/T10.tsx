'use client';

/**
 * notification_center-antd-T10: Scroll to archive a specific security alert
 *
 * setup_description:
 * The Notification Center launcher is anchored in the bottom-right corner of the viewport (not centered) and rendered at small scale (smaller icon and tighter hit targets).
 * A bell icon with a numeric Badge opens the Notification Center Drawer from the right.
 * 
 * Inside the drawer, the notification list is long (~50 items) and requires scrolling; virtualization may be enabled so only a subset of rows is in the DOM at once.
 * Each row has an icon-only "Archive" action (box/arrow icon) aligned to the far right.
 * 
 * The target row:
 *   - visible title text: "Security alert: new login"
 *   - canonical id: 'security_new_login'
 *   - initially unread
 * 
 * Distractors:
 *   - "Security alert: new device" (id 'security_new_device') appears near the top and should NOT be archived.
 *   - Several other "Security alert: ..." rows exist.
 * 
 * Feedback: when the archive action is triggered, the target row is removed from the current list and the Archived tab count increases by 1.
 * No confirmation dialog is shown for single-item archive.
 *
 * success_trigger: Notification 'security_new_login' is archived (removed from active list and present in Archived).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Drawer, List, Tooltip, Typography } from 'antd';
import { BellOutlined, InboxOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface Notification {
  id: string;
  title: string;
  archived: boolean;
}

// Generate 50 notifications with the target buried in the middle
const generateNotifications = (): Notification[] => {
  const items: Notification[] = [];
  
  // Top items (distractors)
  items.push({ id: 'security_new_device', title: 'Security alert: new device', archived: false });
  items.push({ id: 'security_failed_login', title: 'Security alert: failed login attempt', archived: false });
  
  for (let i = 1; i <= 15; i++) {
    items.push({ id: `alert_${i}`, title: `System alert ${i}`, archived: false });
  }
  
  items.push({ id: 'security_password_change', title: 'Security alert: password changed', archived: false });
  
  for (let i = 16; i <= 25; i++) {
    items.push({ id: `alert_${i}`, title: `System alert ${i}`, archived: false });
  }
  
  // Target in the middle
  items.push({ id: 'security_new_login', title: 'Security alert: new login', archived: false });
  
  for (let i = 26; i <= 35; i++) {
    items.push({ id: `alert_${i}`, title: `System alert ${i}`, archived: false });
  }
  
  items.push({ id: 'security_2fa_disabled', title: 'Security alert: 2FA disabled', archived: false });
  items.push({ id: 'security_ip_change', title: 'Security alert: IP address change', archived: false });
  
  for (let i = 36; i <= 48; i++) {
    items.push({ id: `alert_${i}`, title: `System alert ${i}`, archived: false });
  }
  
  return items;
};

const initialNotifications = generateNotifications();

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const successCalledRef = useRef(false);

  const activeNotifications = notifications.filter(n => !n.archived);
  const archivedCount = notifications.filter(n => n.archived).length;

  useEffect(() => {
    const targetNotification = notifications.find(n => n.id === 'security_new_login');
    if (targetNotification?.archived && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [notifications, onSuccess]);

  const handleArchive = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, archived: true } : n)
    );
  };

  return (
    <>
      <Card
        size="small"
        style={{ width: 200 }}
        styles={{ body: { padding: 8 } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 12 }}>Alerts</Text>
          <Badge count={activeNotifications.length} size="small">
            <Button
              type="text"
              size="small"
              icon={<BellOutlined style={{ fontSize: 14 }} />}
              onClick={() => setDrawerOpen(true)}
              aria-label="Notifications"
              data-testid="notif-bell-primary"
            />
          </Badge>
        </div>
      </Card>

      <Drawer
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Notification Center</span>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Archived: {archivedCount}
            </Text>
          </div>
        }
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={360}
        data-testid="notif-drawer-primary"
      >
        <div style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <List
            size="small"
            dataSource={activeNotifications}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                data-notif-id={item.id}
                actions={[
                  <Tooltip key="archive" title="Archive notification">
                    <Button
                      type="text"
                      size="small"
                      icon={<InboxOutlined />}
                      onClick={() => handleArchive(item.id)}
                      aria-label="Archive notification"
                      data-testid={`archive-${item.id}`}
                    />
                  </Tooltip>
                ]}
                style={{ padding: '6px 0' }}
              >
                <Text style={{ fontSize: 12 }}>{item.title}</Text>
              </List.Item>
            )}
          />
        </div>
      </Drawer>
    </>
  );
}
