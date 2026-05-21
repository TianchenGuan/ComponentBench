'use client';

/**
 * notification_center-antd-T06: Bulk mark two notifications as read
 *
 * setup_description:
 * Compact spacing mode is enabled (tighter paddings and smaller row height) but the component is still in an isolated card at the center.
 * The Notification Center is inline (no drawer). Each notification row has:
 *   - a checkbox on the left for multi-select
 *   - a title and timestamp
 *   - an unread dot if unread
 * 
 * Initial state:
 *   - "Server maintenance" (id 'server_maintenance') is unread.
 *   - "Policy update" (id 'policy_update') is unread.
 *   - Several other unread items exist; some have similar IT/admin wording (e.g., "Server status update").
 *   - No items are selected initially (checkboxes all unchecked).
 * 
 * When one or more items are selected, a sticky bulk action bar appears above the list with buttons:
 *   - "Mark as read"
 *   - "Archive"
 *   - "Cancel selection"
 * 
 * The task requires selecting exactly those two target notifications (selection can include others temporarily, but final state must have them marked read).
 * Feedback: clicking "Mark as read" removes the unread dots for the selected items and decreases the unread badge count in the header.
 *
 * success_trigger: Notification 'server_maintenance' is marked read AND Notification 'policy_update' is marked read.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Badge, Button, Checkbox, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface Notification {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 'server_maintenance', title: 'Server maintenance', time: '10 min ago', read: false },
  { id: 'server_status_update', title: 'Server status update', time: '15 min ago', read: false },
  { id: 'policy_update', title: 'Policy update', time: '30 min ago', read: false },
  { id: 'security_patch', title: 'Security patch applied', time: '1 hour ago', read: true },
  { id: 'network_alert', title: 'Network connectivity alert', time: '2 hours ago', read: false },
  { id: 'backup_complete', title: 'Backup completed', time: '3 hours ago', read: true },
  { id: 'user_access', title: 'New user access request', time: '4 hours ago', read: false },
  { id: 'system_update', title: 'System update available', time: '5 hours ago', read: true },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const successCalledRef = useRef(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const serverMaintenance = notifications.find(n => n.id === 'server_maintenance');
    const policyUpdate = notifications.find(n => n.id === 'policy_update');
    
    if (serverMaintenance?.read && policyUpdate?.read && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [notifications, onSuccess]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMarkAsRead = () => {
    setNotifications(prev =>
      prev.map(n =>
        selectedIds.includes(n.id) ? { ...n, read: true } : n
      )
    );
    setSelectedIds([]);
  };

  const handleCancelSelection = () => {
    setSelectedIds([]);
  };

  return (
    <Card
      title={
        <span>
          Notification Center <Badge count={unreadCount} style={{ marginLeft: 8 }} />
        </span>
      }
      style={{ width: 500 }}
      styles={{ body: { padding: '12px' } }}
    >
      {selectedIds.length > 0 && (
        <div 
          style={{ 
            padding: '8px 12px', 
            background: '#f0f5ff', 
            borderRadius: 4, 
            marginBottom: 12,
            display: 'flex',
            gap: 8,
            alignItems: 'center'
          }}
        >
          <Text>{selectedIds.length} selected</Text>
          <Button size="small" type="primary" onClick={handleMarkAsRead}>
            Mark as read
          </Button>
          <Button size="small">Archive</Button>
          <Button size="small" type="link" onClick={handleCancelSelection}>
            Cancel selection
          </Button>
        </div>
      )}

      <List
        size="small"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            data-notif-id={item.id}
            data-read={item.read}
            style={{ padding: '6px 0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
              <Checkbox
                checked={selectedIds.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                data-testid={`checkbox-${item.id}`}
              />
              {!item.read && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#1677ff',
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text 
                  strong={!item.read}
                  style={{ fontSize: 13 }}
                >
                  {item.title}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
