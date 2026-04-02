'use client';

/**
 * download_trigger-antd-T01: Download invoice PDF from primary button
 *
 * Layout: isolated_card centered on the page.
 * The card is titled "Invoice #1042" and shows a short summary (amount, date).
 * Primary action area contains a large AntD primary Button labeled "Download invoice PDF" with a download icon.
 * A secondary default Button labeled "Preview" sits to the right as a distractor.
 * Initial state text below the buttons reads "Last download: never".
 * When the correct button is clicked, a toast appears: "Download started: invoice-1042.pdf".
 *
 * Success: A download is initiated for file_id=invoice_1042_pdf with suggested filename "invoice-1042.pdf".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Typography, message, Space } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

const { Text, Title } = Typography;

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('Last download: never');
  const [showPreview, setShowPreview] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('invoice-1042.pdf', 'Invoice #1042 Content');
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const handleDownload = () => {
    if (completed) return;
    
    message.success('Download started: invoice-1042.pdf');
    setDownloadStatus('Last download: just now');
    setCompleted(true);
    onSuccess();
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <Card 
      title="Invoice #1042" 
      style={{ width: 450 }}
      data-testid="invoice-card"
    >
      <div style={{ marginBottom: 16 }}>
        <Text>Amount: $1,250.00</Text>
        <br />
        <Text type="secondary">Date: January 15, 2026</Text>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          size="large"
          onClick={(e) => { e.preventDefault(); handleDownload(); }}
          data-testid="download-button"
        >
          Download invoice PDF
        </Button>
        <Button
          icon={<EyeOutlined />}
          onClick={handlePreview}
          data-testid="preview-button"
        >
          Preview
        </Button>
      </Space>

      <div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {downloadStatus}
        </Text>
      </div>

      {showPreview && (
        <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
          <Title level={5}>Invoice Preview</Title>
          <Text>Invoice #1042 - $1,250.00</Text>
        </div>
      )}
    </Card>
  );
}
