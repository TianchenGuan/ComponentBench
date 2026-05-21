'use client';

/**
 * notification_center-antd-T07: Filter Billing alerts to Errors
 *
 * setup_description:
 * The page shows a form_section layout titled "Billing settings" with one inline Notification Center widget labeled "Billing alerts".
 * The rest of the section contains typical billing form fields (card nickname input, invoice email toggle, timezone select) that act as low clutter,
 * but none are required for success.
 * 
 * The Billing alerts Notification Center contains:
 *   - a header with its label and an unread badge count
 *   - a filter row with a Type Select (All/Info/Warning/Error/Success)
 *   - a short list preview (5 items) under the filters
 * 
 * Initial state:
 *   - Type = "All"
 *   - The list contains mixed severities (some Error, some Warning).
 * 
 * Task intent: set the Type Select to "Error" so only error billing alerts remain visible.
 * Feedback: the selected option changes to "Error" and the list below filters immediately. No Apply/OK button.
 *
 * success_trigger: In the Billing alerts Notification Center, the Type filter is set to 'Error'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Input, Switch, Select, List, Badge, Typography, Divider } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

const notifications = [
  { id: '1', title: 'Payment failed', type: 'error', time: '5 min ago' },
  { id: '2', title: 'Card expiring soon', type: 'warning', time: '1 hour ago' },
  { id: '3', title: 'Invoice sent', type: 'info', time: '2 hours ago' },
  { id: '4', title: 'Subscription renewal failed', type: 'error', time: '3 hours ago' },
  { id: '5', title: 'New billing address added', type: 'success', time: '1 day ago' },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [typeFilter, setTypeFilter] = useState('All');
  const successCalledRef = useRef(false);

  const unreadCount = 3;

  useEffect(() => {
    if (typeFilter === 'Error' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [typeFilter, onSuccess]);

  const filteredNotifications = notifications.filter(n =>
    typeFilter === 'All' || n.type.toLowerCase() === typeFilter.toLowerCase()
  );

  return (
    <Card style={{ width: 600 }}>
      <Title level={4} style={{ marginBottom: 24 }}>Billing settings</Title>
      
      <Form layout="vertical">
        <Form.Item label="Card nickname">
          <Input placeholder="My card" style={{ maxWidth: 300 }} />
        </Form.Item>
        
        <Form.Item label="Send invoice emails">
          <Switch defaultChecked />
        </Form.Item>
        
        <Form.Item label="Timezone">
          <Select 
            defaultValue="utc" 
            style={{ maxWidth: 300 }}
            options={[
              { value: 'utc', label: 'UTC' },
              { value: 'est', label: 'Eastern Time' },
              { value: 'pst', label: 'Pacific Time' },
            ]}
          />
        </Form.Item>
      </Form>

      <Divider />

      <div data-testid="notif-center-billing">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text strong>
            Billing alerts <Badge count={unreadCount} style={{ marginLeft: 8 }} />
          </Text>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Text type="secondary" style={{ marginRight: 8 }}>Type:</Text>
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
            data-testid="billing-type-filter"
          />
        </div>

        <List
          size="small"
          dataSource={filteredNotifications}
          renderItem={(item) => (
            <List.Item key={item.id} style={{ padding: '8px 0' }}>
              <div>
                <Text>{item.title}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {item.type} · {item.time}
                </Text>
              </div>
            </List.Item>
          )}
          locale={{ emptyText: 'No alerts match this filter' }}
        />
      </div>
    </Card>
  );
}
