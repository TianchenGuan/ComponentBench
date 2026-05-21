'use client';

/**
 * textarea-antd-T08: Canned response from a reference image
 *
 * A centered card titled "Macros" contains:
 * - Dark theme (dark background, light text) with comfortable spacing and default scale.
 * - One Ant Design Input.TextArea labeled "Canned response", initially empty, fixed 5 rows.
 * - To the right of the label is a small "Reference" panel that shows an IMAGE (not selectable text)
 *   of the exact message to copy (3 lines with hyphen bullets).
 * - No other textareas are present. The only distractor is a non-interactive "Recent macros" list below.
 *
 * Success: Value equals exactly (with newlines, whitespace=exact):
 *   Hi Alex,
 *   - We received your request.
 *   - We'll respond within 2 business days.
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

const TARGET_VALUE = `Hi Alex,
- We received your request.
- We'll respond within 2 business days.`;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const normalized = value.replace(/\r\n/g, '\n');
    if (normalized === TARGET_VALUE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card
      title="Macros"
      style={{ width: 550, background: '#1f1f1f', borderColor: '#303030' }}
      headStyle={{ color: '#fff', borderColor: '#303030' }}
      bodyStyle={{ background: '#1f1f1f' }}
    >
      <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="canned-response" style={{ fontWeight: 500, marginBottom: 4, display: 'block', color: '#fff' }}>
            Canned response
          </label>
          <TextArea
            id="canned-response"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={5}
            data-testid="textarea-canned-response"
            style={{ background: '#141414', borderColor: '#434343', color: '#fff' }}
          />
        </div>
        <div style={{ width: 200 }}>
          <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block', color: '#888' }}>
            Reference
          </Text>
          {/* Reference shown as an image-like box (simulating non-selectable text) */}
          <div
            style={{
              padding: 12,
              background: '#2a2a2a',
              borderRadius: 4,
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#888',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            data-testid="reference-image"
          >
            <div style={{ marginBottom: 4 }}>Hi Alex,</div>
            <div style={{ marginBottom: 4 }}>- We received your request.</div>
            <div>- We'll respond within 2 business days.</div>
          </div>
        </div>
      </div>

      {/* Distractor: Recent macros list */}
      <div style={{ borderTop: '1px solid #303030', paddingTop: 12 }}>
        <Text type="secondary" style={{ fontSize: 11, color: '#666' }}>Recent macros</Text>
        <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
          • Greeting template<br />
          • Refund confirmation<br />
          • Shipping delay notice
        </div>
      </div>
    </Card>
  );
}
