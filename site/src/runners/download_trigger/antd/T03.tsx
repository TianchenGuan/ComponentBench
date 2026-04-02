'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Card, Typography, message } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

const { Link } = Typography;

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('welcome-packet.pdf', 'Welcome Packet PDF Content');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleDownload = () => {
    if (completed) return;
    message.success('Download started: welcome-packet.pdf');
    setCompleted(true);
    onSuccess();
  };

  const columns = [
    { title: 'Document', dataIndex: 'document', key: 'document' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Download', key: 'download', render: () => (
      <Link 
        onClick={(e: React.MouseEvent) => { e.preventDefault(); handleDownload(); }} 
        data-testid="download-link"
        style={{ cursor: 'pointer' }}
      >
        Download
      </Link>
    )},
  ];

  const data = [{ key: '1', document: 'Welcome packet', type: 'PDF' }];

  return (
    <Card title="Attachments" style={{ width: 500 }}>
      <div style={{ marginBottom: 16 }}>
        <Input prefix={<SearchOutlined />} placeholder="Search..." disabled style={{ width: 200, marginRight: 8 }} />
        <Button icon={<ReloadOutlined />}>Refresh</Button>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} size="small" />
    </Card>
  );
}
