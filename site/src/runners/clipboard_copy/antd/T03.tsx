'use client';

/**
 * clipboard_copy-antd-T03: Copy Secondary API key (two fields)
 *
 * Layout: isolated_card, centered.
 * The card title is "API keys". It contains two stacked rows:
 * 1) "Primary API key" with value "KEY-PRIMARY-4C9"
 * 2) "Secondary API key" with value "KEY-SECONDARY-7F2"
 *
 * Each value is rendered as Ant Design Typography.Text with the copyable icon at the end of the line.
 * Component behavior: clicking a row's copy icon writes that row's value to the clipboard and shows a short "Copied" tooltip near the icon.
 *
 * Distractors: a short help paragraph below explaining what API keys are. Initial state: neither key has been copied.
 * Requirement: there are 2 instances of the clipboard_copy component; the target is the "Secondary API key" row.
 *
 * Success: Clipboard text equals "KEY-SECONDARY-7F2".
 */

import React, { useState } from 'react';
import { Card, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const { Text, Paragraph } = Typography;

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);

  const handleCopyPrimary = async () => {
    await copyToClipboard('KEY-PRIMARY-4C9', 'Primary API key');
    // Primary key copy does NOT complete the task
  };

  const handleCopySecondary = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('KEY-SECONDARY-7F2', 'Secondary API key');
    if (success) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card title="API keys" style={{ width: 450 }} data-testid="api-keys-card">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Primary API key row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text>Primary API key:</Text>
          <Text
            copyable={{
              text: 'KEY-PRIMARY-4C9',
              onCopy: handleCopyPrimary,
              tooltips: ['Copy', 'Copied'],
            }}
            code
            style={{ fontFamily: 'monospace' }}
            data-testid="copy-primary"
          >
            KEY-PRIMARY-4C9
          </Text>
        </div>

        {/* Secondary API key row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text>Secondary API key:</Text>
          <Text
            copyable={{
              text: 'KEY-SECONDARY-7F2',
              onCopy: handleCopySecondary,
              tooltips: ['Copy', 'Copied'],
            }}
            code
            style={{ fontFamily: 'monospace' }}
            data-testid="copy-secondary"
          >
            KEY-SECONDARY-7F2
          </Text>
        </div>

        <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8, marginBottom: 0 }}>
          API keys are used to authenticate requests to your application. Keep them secure and never share them publicly.
        </Paragraph>
      </Space>
    </Card>
  );
}
