'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Dropdown, message, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

const { Text } = Typography;

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState('No export started');
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('transactions-jan-2026.csv', 'Date,Amount,Description');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'csv' && !completed) {
      message.success('Download started: transactions-jan-2026.csv');
      setStatus('Export started');
      setCompleted(true);
      onSuccess();
    } else if (e.key === 'pdf') {
      message.info('PDF export triggered');
    } else if (e.key === 'json') {
      message.info('JSON export triggered');
    }
  };

  const items: MenuProps['items'] = [
    { key: 'csv', label: 'CSV' },
    { key: 'pdf', label: 'PDF' },
    { key: 'json', label: 'JSON' },
    { type: 'divider' },
    { key: 'email', label: 'Email me instead', disabled: true },
  ];

  return (
    <Card title="Export transactions (January 2026)" style={{ width: 400 }}>
      <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']}>
        <Button data-testid="download-menu">Download <DownOutlined /></Button>
      </Dropdown>
      <div style={{ marginTop: 16 }}>
        <Text type="secondary">{status}</Text>
      </div>
    </Card>
  );
}
