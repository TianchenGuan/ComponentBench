'use client';

/**
 * clipboard_copy-antd-T02: Copy tracking number from reference badge
 *
 * Layout: isolated_card, centered.
 * The card is titled "Shipment summary". At the top of the card there is a colored badge labeled "Reference" that displays the target tracking number in large monospace text: "TRK-90817".
 *
 * Below the badge there is one row labeled "Tracking number". The same value "TRK-90817" is displayed as Ant Design Typography.Text with the copyable icon at the end.
 *
 * Component behavior:
 * - Clicking the copy icon copies the full tracking number.
 * - A small tooltip "Copied" appears next to the icon briefly. No Apply/OK step.
 *
 * Distractors: none. Initial state: not copied.
 *
 * Success: Clipboard text equals "TRK-90817" (the tracking number shown in the Reference badge).
 */

import React, { useState } from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const { Text } = Typography;

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('TRK-90817', 'Tracking number');
    if (success) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card title="Shipment summary" style={{ width: 450 }} data-testid="shipment-card">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Reference badge */}
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Tag color="blue" style={{ fontSize: 12, marginBottom: 8 }}>Reference</Tag>
          <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 600 }} data-testid="reference-badge">
            TRK-90817
          </div>
        </div>

        {/* Tracking number row with copy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text>Tracking number:</Text>
          <Text
            copyable={{
              text: 'TRK-90817',
              onCopy: handleCopy,
              tooltips: ['Copy', 'Copied'],
            }}
            code
            style={{ fontFamily: 'monospace' }}
            data-testid="copy-tracking-number"
          >
            TRK-90817
          </Text>
        </div>
      </Space>
    </Card>
  );
}
