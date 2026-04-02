'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Typography, message, Tag, Space } from 'antd';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

const { Link } = Typography;

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<'not_downloaded' | 'started'>('not_downloaded');
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('statement-2026-01.csv', 'Date,Description,Amount');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleDownload = () => {
    if (completed) return;
    message.success('Download started: statement-2026-01.csv');
    setStatus('started');
    setCompleted(true);
    onSuccess();
  };

  return (
    <Card title="Account statement — January 2026" style={{ width: 400 }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Button type="link" onClick={(e) => { e.preventDefault(); handleDownload(); }} style={{ padding: 0 }} data-testid="download-link">Download CSV</Button>
        <Link onClick={() => message.info('Opening online viewer...')} data-testid="view-online-link">View online</Link>
        <Tag color={status === 'started' ? 'green' : 'default'}>{status === 'started' ? 'Download started' : 'Not downloaded'}</Tag>
      </Space>
    </Card>
  );
}
