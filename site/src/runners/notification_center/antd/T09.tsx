'use client';

/**
 * notification_center-antd-T09: Match unread badge count to a reference
 *
 * setup_description:
 * Two Notification Center widgets are displayed side-by-side in an isolated card layout:
 *   - Left instance label: "Primary"
 *   - Right instance label: "Secondary"
 * 
 * Each instance shows its own unread Badge in the header and a list of notifications with per-row read/unread toggle actions.
 * Above the Primary instance there is a small, non-interactive reference preview titled "Target for Primary".
 * The preview contains a static bell + badge showing the desired unread count (it shows the number 2).
 * 
 * Initial state:
 *   - Primary unread badge shows "4" (4 unread items in its list).
 *   - Secondary unread badge shows "1".
 *   - Each Primary row has a "Mark as read"/"Mark as unread" icon action that toggles the row state immediately.
 * 
 * The goal is only to make the Primary unread badge equal the target preview number (2). The Secondary instance should be left unchanged.
 * Distractors: the two instances have similar layouts and both support read/unread toggles.
 * Feedback: toggling Primary items updates only the Primary badge number in the header immediately.
 *
 * success_trigger: In the Primary Notification Center instance, the unread badge count equals the reference target value (2).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Badge, Button, Tooltip, Typography } from 'antd';
import { BellOutlined, CheckOutlined, UndoOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

interface Notification {
  id: string;
  title: string;
  read: boolean;
}

const initialPrimaryNotifications: Notification[] = [
  { id: 'p1', title: 'Primary alert 1', read: false },
  { id: 'p2', title: 'Primary alert 2', read: false },
  { id: 'p3', title: 'Primary alert 3', read: false },
  { id: 'p4', title: 'Primary alert 4', read: false },
  { id: 'p5', title: 'Primary info 5', read: true },
  { id: 'p6', title: 'Primary info 6', read: true },
];

const initialSecondaryNotifications: Notification[] = [
  { id: 's1', title: 'Secondary alert 1', read: false },
  { id: 's2', title: 'Secondary info 2', read: true },
  { id: 's3', title: 'Secondary info 3', read: true },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [primaryNotifications, setPrimaryNotifications] = useState(initialPrimaryNotifications);
  const [secondaryNotifications, setSecondaryNotifications] = useState(initialSecondaryNotifications);
  const successCalledRef = useRef(false);

  const primaryUnreadCount = primaryNotifications.filter(n => !n.read).length;
  const secondaryUnreadCount = secondaryNotifications.filter(n => !n.read).length;

  useEffect(() => {
    if (primaryUnreadCount === 2 && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [primaryUnreadCount, onSuccess]);

  const togglePrimaryRead = (id: string) => {
    setPrimaryNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
    );
  };

  const toggleSecondaryRead = (id: string) => {
    setSecondaryNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
    );
  };

  const NotificationList = ({ 
    notifications, 
    onToggle,
    testIdPrefix
  }: { 
    notifications: Notification[]; 
    onToggle: (id: string) => void;
    testIdPrefix: string;
  }) => (
    <List
      size="small"
      dataSource={notifications}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          actions={[
            <Tooltip key="toggle" title={item.read ? 'Mark as unread' : 'Mark as read'}>
              <Button
                type="text"
                size="small"
                icon={item.read ? <UndoOutlined /> : <CheckOutlined />}
                onClick={() => onToggle(item.id)}
                data-testid={`${testIdPrefix}-toggle-${item.id}`}
              />
            </Tooltip>
          ]}
        >
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
  );

  return (
    <div>
      {/* Reference preview */}
      <Card 
        size="small" 
        style={{ width: 200, marginBottom: 16 }}
        styles={{ body: { padding: 12 } }}
      >
        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
          Target for Primary
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge count={2}>
            <BellOutlined style={{ fontSize: 20 }} />
          </Badge>
          <Text>Unread: 2</Text>
        </div>
      </Card>

      {/* Two notification centers side by side */}
      <div style={{ display: 'flex', gap: 24 }}>
        <Card
          title={
            <span>
              Primary <Badge count={primaryUnreadCount} style={{ marginLeft: 8 }} />
            </span>
          }
          style={{ width: 320 }}
          data-testid="notif-center-primary"
        >
          <NotificationList
            notifications={primaryNotifications}
            onToggle={togglePrimaryRead}
            testIdPrefix="primary"
          />
        </Card>

        <Card
          title={
            <span>
              Secondary <Badge count={secondaryUnreadCount} style={{ marginLeft: 8 }} />
            </span>
          }
          style={{ width: 320 }}
          data-testid="notif-center-secondary"
        >
          <NotificationList
            notifications={secondaryNotifications}
            onToggle={toggleSecondaryRead}
            testIdPrefix="secondary"
          />
        </Card>
      </div>
    </div>
  );
}
