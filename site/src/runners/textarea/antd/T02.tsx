'use client';

/**
 * textarea-antd-T02: Replace a draft reply with a final response
 *
 * A centered "Reply" card contains one Ant Design Input.TextArea labeled "Customer reply".
 * - Light theme, comfortable spacing, default scale.
 * - The textarea starts prefilled with: "Draft: TBD".
 * - Above it is a non-interactive status pill "Not sent".
 * - Below it is a grey "Preview" block that mirrors the textarea content live (read-only, not required for success).
 *
 * Success: Value equals "Thanks for reaching out. We'll reply tomorrow." (normalize_newlines=true, whitespace=trim)
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Draft: TBD');

  useEffect(() => {
    if (value.trim() === "Thanks for reaching out. We'll reply tomorrow.") {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Reply" style={{ width: 450 }}>
      <div style={{ marginBottom: 12 }}>
        <Tag color="default">Not sent</Tag>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label htmlFor="customer-reply" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Customer reply
        </label>
        <TextArea
          id="customer-reply"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="textarea-customer-reply"
          rows={3}
        />
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 12,
          background: '#f5f5f5',
          borderRadius: 4,
          fontSize: 13,
          color: '#666',
        }}
      >
        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>
          Preview
        </Text>
        <div style={{ whiteSpace: 'pre-wrap' }}>{value || '(empty)'}</div>
      </div>
    </Card>
  );
}
