'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, message, Row, Col, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

const { Title, Text } = Typography;

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('pattern-logo.svg', '<svg></svg>');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleDownload = (assetId: string) => {
    if (assetId === 'B' && !completed) {
      message.success('Download started: pattern-logo.svg');
      setCompleted(true);
      onSuccess();
    } else if (assetId !== 'B') {
      message.info('Wrong asset downloaded');
    }
  };

  const patternA = { background: 'linear-gradient(45deg, #ff6b6b, #feca57)', width: 60, height: 60, borderRadius: 8 };
  const patternB = { background: 'linear-gradient(135deg, #48dbfb, #ff9ff3)', width: 60, height: 60, borderRadius: 8 };
  const referencePattern = patternB;

  return (
    <Card title="Asset downloader" style={{ width: 400 }} size="small">
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Reference preview:</Text>
        <div style={{ ...referencePattern, marginTop: 8 }} />
      </div>
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="Asset A">
            <div style={patternA} />
            <Button size="small" icon={<DownloadOutlined />} onClick={(e) => { e.preventDefault(); handleDownload('A'); }} style={{ marginTop: 8 }} data-testid="download-asset-a" />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="Asset B">
            <div style={patternB} />
            <Button size="small" icon={<DownloadOutlined />} onClick={(e) => { e.preventDefault(); handleDownload('B'); }} style={{ marginTop: 8 }} data-testid="download-asset-b" />
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
