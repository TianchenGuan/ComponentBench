'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Popconfirm, message, Space } from 'antd';
import { DownloadOutlined, LinkOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('audit-log-redacted.csv', 'timestamp,action,user');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleConfirm = () => {
    if (completed) return;
    message.success('Download started: audit-log-redacted.csv');
    setCompleted(true);
    onSuccess();
  };

  return (
    <Card title="Audit log export" style={{ width: 380 }}>
      <Space>
        <Popconfirm
          title="This file contains sensitive data. Continue?"
          onConfirm={handleConfirm}
          okText="Download"
          cancelText="Cancel"
        >
          <Button type="primary" icon={<DownloadOutlined />} data-testid="download-audit-log">
            Download audit log
          </Button>
        </Popconfirm>
        <Button icon={<LinkOutlined />} onClick={() => message.info('Link copied!')}>
          Copy share link
        </Button>
      </Space>
    </Card>
  );
}
