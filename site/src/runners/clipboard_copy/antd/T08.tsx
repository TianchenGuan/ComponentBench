'use client';

/**
 * clipboard_copy-antd-T08: Copy STAGING webhook URL from table
 *
 * Layout: table_cell, anchored near the bottom-right of the viewport.
 * The page shows an Ant Design Table titled "Environments". The table has 3 rows:
 * - DEV (green tag)
 * - STAGING (orange tag)
 * - PROD (red tag)
 *
 * Columns:
 * 1) Environment (tag + label)
 * 2) Webhook URL (long URL rendered with ellipsis)
 * 3) Action (a small copyable icon at the end of the URL text)
 *
 * Each row's Webhook URL is an Ant Design Typography.Text with copyable icon. URLs are distinct:
 * - DEV: https://hooks.example.com/dev/2b7c0e
 * - STAGING: https://hooks.example.com/stg/9f2c1a
 * - PROD: https://hooks.example.com/prod/51aa0d
 *
 * Component behavior:
 * - Clicking the copy icon for a given row copies that row's FULL URL.
 * - A brief "Copied" tooltip appears near the clicked icon.
 *
 * Distractors: column sorting arrows and a search input above the table (not required). Initial state: no copies performed.
 * Requirement: instances=3 (one per row). Target instance is the STAGING row.
 *
 * Success: Clipboard text equals "https://hooks.example.com/stg/9f2c1a".
 */

import React, { useState } from 'react';
import { Card, Typography, Table, Tag, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const { Text } = Typography;

interface EnvRow {
  key: string;
  environment: string;
  color: string;
  webhookUrl: string;
}

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);

  const data: EnvRow[] = [
    { key: 'dev', environment: 'DEV', color: 'green', webhookUrl: 'https://hooks.example.com/dev/2b7c0e' },
    { key: 'staging', environment: 'STAGING', color: 'orange', webhookUrl: 'https://hooks.example.com/stg/9f2c1a' },
    { key: 'prod', environment: 'PROD', color: 'red', webhookUrl: 'https://hooks.example.com/prod/51aa0d' },
  ];

  const handleCopy = async (url: string, envKey: string) => {
    await copyToClipboard(url, `${envKey} row`);
    
    // Only complete if STAGING was copied
    if (envKey === 'staging' && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const columns = [
    {
      title: 'Environment',
      dataIndex: 'environment',
      key: 'environment',
      sorter: true,
      render: (text: string, record: EnvRow) => (
        <Tag color={record.color}>{text}</Tag>
      ),
    },
    {
      title: 'Webhook URL',
      dataIndex: 'webhookUrl',
      key: 'webhookUrl',
      render: (url: string, record: EnvRow) => (
        <Text
          copyable={{
            text: url,
            onCopy: () => handleCopy(url, record.key),
            tooltips: ['Copy', 'Copied'],
          }}
          ellipsis={{ tooltip: url }}
          style={{ fontFamily: 'monospace', maxWidth: 250 }}
          data-testid={`copy-${record.key}-url`}
        >
          {url}
        </Text>
      ),
    },
  ];

  return (
    <Card title="Environments" style={{ width: 550 }} data-testid="environments-table-card">
      <Input
        placeholder="Search environments..."
        prefix={<SearchOutlined />}
        style={{ marginBottom: 16, width: 200 }}
      />
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        size="middle"
        data-testid="environments-table"
      />
    </Card>
  );
}
