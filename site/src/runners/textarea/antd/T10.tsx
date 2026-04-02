'use client';

/**
 * textarea-antd-T10: Webhook payload JSON in compact small mode
 *
 * A centered card titled "Webhooks" contains one Ant Design Input.TextArea labeled "Webhook payload".
 * - Light theme with compact spacing and small component scale (dense UI).
 * - The textarea is monospace-styled, starts empty, and shows a faint placeholder "Paste JSON here".
 * - A read-only validity indicator below the field updates to "Valid JSON" when the content parses.
 * - No other textarea instances on the page, and no required buttons.
 *
 * Success: Value equals exactly (whitespace=exact):
 *   {
 *     "event": "order.created",
 *     "id": 1042,
 *     "priority": "high"
 *   }
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Typography, ConfigProvider } from 'antd';
import type { TaskComponentProps } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

const TARGET_VALUE = `{
  "event": "order.created",
  "id": 1042,
  "priority": "high"
}`;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [isValidJson, setIsValidJson] = useState(false);

  useEffect(() => {
    // Check if valid JSON
    try {
      if (value.trim()) {
        JSON.parse(value);
        setIsValidJson(true);
      } else {
        setIsValidJson(false);
      }
    } catch {
      setIsValidJson(false);
    }

    // Check success: compare parsed JSON objects, not raw strings
    try {
      const parsed = JSON.parse(value);
      const target = JSON.parse(TARGET_VALUE);
      if (JSON.stringify(parsed) === JSON.stringify(target)) {
        onSuccess();
      }
    } catch {
      // not valid JSON yet
    }
  }, [value, onSuccess]);

  return (
    <ConfigProvider componentSize="small">
      <Card
        title="Webhooks"
        style={{ width: 400 }}
        bodyStyle={{ padding: '12px 16px' }}
      >
        <div style={{ marginBottom: 8 }}>
          <label
            htmlFor="webhook-payload"
            style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 12 }}
          >
            Webhook payload
          </label>
          <TextArea
            id="webhook-payload"
            placeholder="Paste JSON here"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={6}
            data-testid="textarea-webhook-payload"
            style={{ fontFamily: 'monospace', fontSize: 11 }}
          />
          <div style={{ marginTop: 4, fontSize: 11 }}>
            {value.trim() ? (
              isValidJson ? (
                <Text type="success">Valid JSON</Text>
              ) : (
                <Text type="danger">Invalid JSON</Text>
              )
            ) : (
              <Text type="secondary">Enter JSON payload</Text>
            )}
          </div>
        </div>
      </Card>
    </ConfigProvider>
  );
}
