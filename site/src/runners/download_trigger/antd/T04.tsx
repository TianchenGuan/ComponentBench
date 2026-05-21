'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Input, Typography, message, Image, Space } from 'antd';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

const { Link, Title } = Typography;

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('brand-logo.png', 'PNG image data');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleDownload = () => {
    if (completed) return;
    message.success('Download started: brand-logo.png');
    setCompleted(true);
    onSuccess();
  };

  return (
    <Card title="Company Settings" style={{ width: 450 }}>
      <Form layout="vertical">
        <Form.Item label="Company name"><Input defaultValue="Acme Corp" /></Form.Item>
        <Form.Item label="Website"><Input defaultValue="https://acme.com" /></Form.Item>
        <Form.Item label="Support email"><Input defaultValue="support@acme.com" /></Form.Item>
      </Form>
      <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <Title level={5}>Brand assets</Title>
        <Space direction="vertical">
          <div style={{ width: 64, height: 64, background: '#1890ff', borderRadius: 8 }} />
          <Link onClick={(e: React.MouseEvent) => { e.preventDefault(); handleDownload(); }} data-testid="download-logo" style={{ cursor: 'pointer' }}>
            Download logo
          </Link>
          <Link href="#" target="_blank">Guidelines (opens in new tab)</Link>
        </Space>
      </div>
    </Card>
  );
}
