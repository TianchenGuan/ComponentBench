'use client';

/**
 * clipboard_copy-antd-T01: Copy invite code (inline text)
 *
 * Layout: isolated_card, centered in the viewport.
 * The card title is "Team invitations". Under the title there is a single row labeled "Invite code".
 * To the right of the invite code value (shown as monospace text "INV-48219") there is an Ant Design Typography copy icon (copyable Text).
 *
 * Component behavior:
 * - Clicking the copy icon writes the full invite code to the clipboard and shows a small "Copied" tooltip/toast near the icon for ~2 seconds.
 * - No additional confirmation is required.
 *
 * Distractors: none (only explanatory text below the row). Initial state: nothing has been copied yet (no "Copied" tooltip visible).
 *
 * Success: Clipboard text equals "INV-48219".
 */

import React, { useState } from 'react';
import { Card, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const { Text, Paragraph } = Typography;

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('INV-48219', 'Invite code');
    if (success) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card title="Team invitations" style={{ width: 400 }} data-testid="invite-card">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text>Invite code:</Text>
          <Text
            copyable={{
              text: 'INV-48219',
              onCopy: handleCopy,
              tooltips: ['Copy', 'Copied'],
            }}
            code
            style={{ fontFamily: 'monospace' }}
            data-testid="copy-invite-code"
          >
            INV-48219
          </Text>
        </div>
        <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8, marginBottom: 0 }}>
          Share this code with your teammates to invite them to your workspace.
        </Paragraph>
      </Space>
    </Card>
  );
}
