'use client';

/**
 * notification_center-antd-T04: Reset notification filters
 *
 * setup_description:
 * Baseline isolated card centered in the viewport with an inline Notification Center.
 * Above the list is a small filter bar:
 *   - a Search input labeled "Search notifications"
 *   - a Type Select labeled "Type" with options All, Info, Warning, Error, Success
 *   - a text button labeled "Reset filters"
 * 
 * Initial state is intentionally non-default:
 *   - the search input contains the text "invoice"
 *   - the Type Select is set to "Error"
 *   - the list is filtered down to 2 items that match both constraints
 * 
 * Clicking "Reset filters" clears the search input back to empty and sets Type back to "All", restoring the full list.
 * Distractors: elsewhere on the page (below the card) there is an unrelated "Reset layout" button for the dashboard; it must not be used.
 * Feedback: the list count increases and the filter chips/inputs return to default immediately; no Apply button.
 *
 * success_trigger: Notification Center search query is empty AND Notification Center type filter is set to 'All' AND Active view/tab is 'All'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Select, Button, List, Typography, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const notifications = [
  { id: '1', title: 'Invoice #1234 paid', type: 'success', time: '5 min ago' },
  { id: '2', title: 'Payment failed for invoice #5678', type: 'error', time: '10 min ago' },
  { id: '3', title: 'New user registered', type: 'info', time: '30 min ago' },
  { id: '4', title: 'Server CPU warning', type: 'warning', time: '1 hour ago' },
  { id: '5', title: 'Invoice #9012 error', type: 'error', time: '2 hours ago' },
  { id: '6', title: 'Backup completed', type: 'success', time: '3 hours ago' },
  { id: '7', title: 'API rate limit exceeded', type: 'error', time: '4 hours ago' },
  { id: '8', title: 'Maintenance scheduled', type: 'info', time: '5 hours ago' },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [searchQuery, setSearchQuery] = useState('invoice');
  const [typeFilter, setTypeFilter] = useState('Error');
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (searchQuery === '' && typeFilter === 'All' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [searchQuery, typeFilter, onSuccess]);

  const handleReset = () => {
    setSearchQuery('');
    setTypeFilter('All');
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = searchQuery === '' || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || 
      n.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <Card
        title="Notification Center"
        style={{ width: 550, marginBottom: 24 }}
      >
        <Space style={{ marginBottom: 16, width: '100%' }} wrap>
          <Input
            placeholder="Search notifications"
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 200 }}
            data-testid="notif-search"
            aria-label="Search notifications"
          />
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 120 }}
            options={[
              { value: 'All', label: 'All' },
              { value: 'Info', label: 'Info' },
              { value: 'Warning', label: 'Warning' },
              { value: 'Error', label: 'Error' },
              { value: 'Success', label: 'Success' },
            ]}
            data-testid="notif-type-filter"
          />
          <Button type="link" onClick={handleReset} data-testid="notif-reset">
            Reset filters
          </Button>
        </Space>

        <List
          dataSource={filteredNotifications}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <div>
                <Text>{item.title}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.type} · {item.time}
                </Text>
              </div>
            </List.Item>
          )}
          locale={{ emptyText: 'No notifications match your filters' }}
        />
        <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </Text>
      </Card>

      <Button>Reset layout</Button>
    </div>
  );
}
