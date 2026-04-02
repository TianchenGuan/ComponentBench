'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Dropdown, message, Tooltip, ConfigProvider, theme } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('config-export.xml', '<?xml version="1.0"?><config></config>');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'xml' && !completed) {
      message.success('Download started: config-export.xml');
      setCompleted(true);
      onSuccess();
    } else if (e.key === 'csv') {
      message.info('CSV export triggered');
    } else if (e.key === 'json') {
      message.info('JSON export triggered');
    } else if (e.key === 'latest') {
      message.info('Download latest triggered');
    }
  };

  const items: MenuProps['items'] = [
    { key: 'latest', label: 'Download latest' },
    { key: 'export', label: 'Export', children: [
      { key: 'csv', label: 'CSV' },
      { key: 'json', label: 'JSON' },
      { key: 'xml', label: 'XML' },
    ]},
  ];

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Card title="Export tools" style={{ width: 350, background: '#1f1f1f' }} styles={{ header: { color: '#fff' }, body: { padding: '12px 16px' } }}>
        <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']}>
          <Tooltip title="Download">
            <Button icon={<DownloadOutlined />} data-testid="download-menu-icon" />
          </Tooltip>
        </Dropdown>
      </Card>
    </ConfigProvider>
  );
}
