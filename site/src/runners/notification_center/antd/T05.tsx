'use client';

/**
 * notification_center-antd-T05: Search and open a specific invoice notification
 *
 * setup_description:
 * Isolated card anchored near the top-right of the viewport (not centered). A bell icon with a Badge sits in the card header.
 * Clicking the bell opens a right-side Drawer titled "Notification Center".
 * 
 * Inside the drawer, a Search input (AntD Input.Search) is pinned at the top and the notification list is scrollable below it.
 * The list contains ~20 notifications with similar finance-related titles (e.g., "Invoice #1839", "Invoice #1840", "Invoice #1842 (overdue)").
 * Each row is expandable: clicking the row body opens an inline details panel beneath that row (showing a longer message and action buttons).
 * 
 * Initial state:
 *   - Drawer is closed.
 *   - Search box is empty.
 *   - No rows are expanded.
 * 
 * The target notification has id 'invoice_1842' and the visible title text is exactly "Invoice #1842".
 * Distractors: "Invoice #1842 (overdue)" is a different notification id ('invoice_1842_overdue') and must NOT be opened.
 * Feedback: when a row is expanded, its details section appears and the row shows an "expanded" chevron state.
 *
 * success_trigger: Notification Center drawer is open AND The notification with id 'invoice_1842' is expanded/opened in the list (details visible).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Drawer, Input, List, Typography, Collapse } from 'antd';
import { BellOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;
const { Search } = Input;

const notifications = [
  { id: 'invoice_1838', title: 'Invoice #1838', message: 'Payment received for Invoice #1838. Amount: $450.00' },
  { id: 'invoice_1839', title: 'Invoice #1839', message: 'Invoice #1839 has been sent to client.' },
  { id: 'invoice_1840', title: 'Invoice #1840', message: 'Invoice #1840 payment pending.' },
  { id: 'invoice_1841', title: 'Invoice #1841', message: 'Reminder: Invoice #1841 due in 3 days.' },
  { id: 'invoice_1842', title: 'Invoice #1842', message: 'Invoice #1842 requires your attention. Payment amount: $1,200.00' },
  { id: 'invoice_1842_overdue', title: 'Invoice #1842 (overdue)', message: 'URGENT: Invoice #1842 is 30 days overdue!' },
  { id: 'invoice_1843', title: 'Invoice #1843', message: 'New invoice created for client ABC Corp.' },
  { id: 'invoice_1844', title: 'Invoice #1844', message: 'Invoice #1844 has been approved.' },
  { id: 'invoice_1845', title: 'Invoice #1845', message: 'Payment plan set up for Invoice #1845.' },
  { id: 'invoice_1846', title: 'Invoice #1846', message: 'Invoice #1846 cancelled by client request.' },
  { id: 'invoice_1847', title: 'Invoice #1847', message: 'Invoice #1847 sent via email.' },
  { id: 'invoice_1848', title: 'Invoice #1848', message: 'Partial payment received for Invoice #1848.' },
  { id: 'invoice_1849', title: 'Invoice #1849', message: 'Invoice #1849 marked as paid.' },
  { id: 'invoice_1850', title: 'Invoice #1850', message: 'Invoice #1850 created.' },
  { id: 'expense_001', title: 'Expense Report #001', message: 'Expense report submitted for approval.' },
  { id: 'expense_002', title: 'Expense Report #002', message: 'Expense report approved.' },
  { id: 'budget_alert', title: 'Budget Alert', message: 'Q4 budget is 80% utilized.' },
  { id: 'payment_reminder', title: 'Payment Reminder', message: 'Outstanding balance reminder for client XYZ.' },
  { id: 'tax_notice', title: 'Tax Notice', message: 'Quarterly tax payment due next week.' },
  { id: 'reconciliation', title: 'Reconciliation Complete', message: 'Bank reconciliation for October completed.' },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (drawerOpen && expandedId === 'invoice_1842' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [drawerOpen, expandedId, onSuccess]);

  const filteredNotifications = notifications.filter(n =>
    searchQuery === '' || n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <>
      <Card
        title="Finance Dashboard"
        style={{ width: 400 }}
        extra={
          <Badge count={5}>
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
          <Text type="secondary">Financial overview content</Text>
        </div>
      </Card>

      <Drawer
        title="Notification Center"
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={400}
        data-testid="notif-drawer-primary"
      >
        <Search
          placeholder="Search notifications"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 16 }}
          data-testid="notif-search"
        />
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <List
            dataSource={filteredNotifications}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                data-notif-id={item.id}
                style={{ 
                  flexDirection: 'column', 
                  alignItems: 'stretch',
                  cursor: 'pointer',
                  background: expandedId === item.id ? '#fafafa' : 'transparent',
                }}
                onClick={() => toggleExpand(item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Text strong>{item.title}</Text>
                  {expandedId === item.id ? <DownOutlined /> : <RightOutlined />}
                </div>
                {expandedId === item.id && (
                  <div 
                    style={{ 
                      marginTop: 12, 
                      padding: 12, 
                      background: '#f5f5f5', 
                      borderRadius: 4,
                      width: '100%'
                    }}
                    aria-expanded="true"
                  >
                    <Text type="secondary">{item.message}</Text>
                    <div style={{ marginTop: 12 }}>
                      <Button size="small" type="primary" style={{ marginRight: 8 }}>View Details</Button>
                      <Button size="small">Dismiss</Button>
                    </div>
                  </div>
                )}
              </List.Item>
            )}
          />
        </div>
      </Drawer>
    </>
  );
}
