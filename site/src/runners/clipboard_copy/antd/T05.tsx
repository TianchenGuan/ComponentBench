'use client';

/**
 * clipboard_copy-antd-T05: Reveal-on-hover copy for truncated token
 *
 * Card titled "Developer access" with a truncated access token.
 * The copy icon appears on hover. After copying, the user must paste
 * the full token into a verification input and click "Verify" to confirm.
 *
 * Success: The verification input matches the full token.
 */

import React, { useState, useRef } from 'react';
import { Card, Typography, Space, Input, Button, message } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pasteValue, setPasteValue] = useState('');
  const [copied, setCopied] = useState(false);
  const successFired = useRef(false);

  const fullToken = 'tok_live_7c8a1f3e9d2b';

  const handleCopy = () => {
    setCopied(true);
    message.success('Copied to clipboard!');
  };

  const handleVerify = () => {
    if (successFired.current) return;
    if (pasteValue.trim() === fullToken) {
      successFired.current = true;
      setCompleted(true);
      onSuccess();
    } else {
      message.error('Token does not match. Copy the full token and paste it here.');
    }
  };

  return (
    <Card title="Developer access" style={{ width: 400 }} data-testid="developer-card">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Text>Access token:</Text>
          <Text
            copyable={{
              text: fullToken,
              onCopy: handleCopy,
              tooltips: ['Copy', 'Copied'],
              icon: isHovered
                ? undefined
                : [
                    <span key="h1" style={{ opacity: 0, width: 0, display: 'inline-block' }} />,
                    <span key="h2" style={{ opacity: 0, width: 0, display: 'inline-block' }} />,
                  ],
            }}
            ellipsis={{ tooltip: fullToken }}
            code
            style={{ fontFamily: 'monospace', maxWidth: 150 }}
            data-testid="copy-access-token"
            data-full-value={fullToken}
          >
            {fullToken}
          </Text>
        </div>

        <div>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            Paste the full token below to verify:
          </Text>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="Paste token here"
              value={pasteValue}
              onChange={e => setPasteValue(e.target.value)}
              data-testid="verify-input"
              disabled={completed}
            />
            <Button
              type="primary"
              onClick={handleVerify}
              disabled={completed || !pasteValue}
              data-testid="verify-button"
            >
              Verify
            </Button>
          </Space.Compact>
        </div>
      </Space>
    </Card>
  );
}
