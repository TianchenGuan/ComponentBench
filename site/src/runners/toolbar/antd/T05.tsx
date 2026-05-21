'use client';

/**
 * toolbar-antd-T05: Choose Duplicate from More actions menu
 *
 * The page shows a realistic form_section titled "Edit invoice" with several disabled text 
 * inputs (Invoice #, Customer, Total) and helper text (clutter=low). In the top-right of 
 * this section sits a toolbar labeled "Invoice actions".
 * Toolbar contents (left to right): a "Send" Button, a "Download" Button, and a "More actions" 
 * Button that triggers an Ant Design Dropdown menu on click.
 * The dropdown menu contains 5 items: "Duplicate", "Archive", "Share", "Mark as paid", and "Delete".
 */

import React, { useState } from 'react';
import { Button, Card, Dropdown, Input, Space, Typography, MenuProps } from 'antd';
import {
  SendOutlined,
  DownloadOutlined,
  MoreOutlined,
  CopyOutlined,
  InboxOutlined,
  ShareAltOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [lastAction, setLastAction] = useState<string>('None');

  const handleAction = (action: string) => {
    setLastAction(action);
    if (action.toLowerCase() === 'duplicate') {
      onSuccess();
    }
  };

  const menuItems: MenuProps['items'] = [
    { key: 'duplicate', label: 'Duplicate', icon: <CopyOutlined />, onClick: () => handleAction('Duplicate') },
    { key: 'archive', label: 'Archive', icon: <InboxOutlined />, onClick: () => handleAction('Archive') },
    { key: 'share', label: 'Share', icon: <ShareAltOutlined />, onClick: () => handleAction('Share') },
    { key: 'mark-paid', label: 'Mark as paid', icon: <CheckCircleOutlined />, onClick: () => handleAction('Mark as paid') },
    { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true, onClick: () => handleAction('Delete') },
  ];

  return (
    <Card
      title="Edit invoice"
      style={{ width: 500 }}
      extra={
        <Space data-testid="toolbar-invoice-actions">
          <Button icon={<SendOutlined />} onClick={() => handleAction('Send')}>
            Send
          </Button>
          <Button icon={<DownloadOutlined />} onClick={() => handleAction('Download')}>
            Download
          </Button>
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button icon={<MoreOutlined />} data-testid="toolbar-invoice-more">
              More actions
            </Button>
          </Dropdown>
        </Space>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Invoice #
        </Text>
        <Input value="INV-2024-0042" disabled style={{ marginBottom: 12 }} />

        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Customer
        </Text>
        <Input value="Acme Corp" disabled style={{ marginBottom: 12 }} />

        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Total
        </Text>
        <Input value="$1,250.00" disabled />
      </div>

      <Text type="secondary">Last action: {lastAction}</Text>

      {/* Distractor dropdown */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
        <Dropdown
          menu={{
            items: [
              { key: 'help', label: 'Help' },
              { key: 'about', label: 'About' },
            ],
          }}
          trigger={['click']}
        >
          <Button size="small">Form options</Button>
        </Dropdown>
      </div>
    </Card>
  );
}
