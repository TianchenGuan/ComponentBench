'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, message, Button, Space } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

const { Title, Paragraph, Link } = Typography;

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const blobUrlRef = useRef<Record<string, string>>({});

  useEffect(() => {
    blobUrlRef.current = {
      pdf: createMockBlobUrl('release-notes.pdf', 'Release notes PDF'),
      csv: createMockBlobUrl('changelog.csv', 'Version,Date,Changes'),
      zip: createMockBlobUrl('release-notes-appendix.zip', 'ZIP archive'),
    };
    return () => { Object.values(blobUrlRef.current).forEach(url => URL.revokeObjectURL(url)); };
  }, []);

  const handleDownload = (type: string) => {
    if (type === 'zip' && !completed) {
      message.success('Download started: release-notes-appendix.zip');
      setCompleted(true);
      onSuccess();
    } else if (type !== 'zip') {
      message.info(`Downloaded ${type} file`);
    }
  };

  return (
    <div style={{ height: 800, overflow: 'auto', position: 'relative' }}>
      <Card title="Release Notes v2.5.0" style={{ minHeight: 1200 }}>
        <Title level={4}>What's New</Title>
        <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</Paragraph>
        <Paragraph>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</Paragraph>
        <Title level={4}>Bug Fixes</Title>
        <Paragraph>Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</Paragraph>
        <div style={{ marginTop: 400, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <Title level={5}>Attachments</Title>
          <Space direction="vertical">
            <Link onClick={(e: React.MouseEvent) => { e.preventDefault(); handleDownload('pdf'); }} style={{ cursor: 'pointer' }}>
              Release notes PDF
            </Link>
            <Link onClick={(e: React.MouseEvent) => { e.preventDefault(); handleDownload('csv'); }} style={{ cursor: 'pointer' }}>
              Changelog CSV
            </Link>
            <Link onClick={(e: React.MouseEvent) => { e.preventDefault(); handleDownload('zip'); }} data-testid="download-appendix" style={{ cursor: 'pointer' }}>
              Release notes appendix
            </Link>
          </Space>
        </div>
      </Card>
      <Button icon={<ArrowUpOutlined />} style={{ position: 'fixed', bottom: 20, right: 20 }} onClick={() => window.scrollTo(0, 0)}>Back to top</Button>
    </div>
  );
}
