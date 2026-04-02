'use client';

/**
 * clipboard_copy-antd-T06: Copy token from modal details
 *
 * Layout: modal_flow, centered.
 * The page shows a card titled "Personal access". In the card there is a primary button labeled "View token".
 *
 * When "View token" is clicked, an Ant Design Modal opens (centered overlay). Inside the modal:
 * - A row labeled "Personal token" displays the value "PAT-44F8-19D2" in monospace Typography.Text.
 * - The value has a copyable icon at the end (clipboard_copy component).
 * - The modal has standard "Close" (X) in the corner and a footer button "Done" (both are distractors; either can close the modal).
 *
 * Component behavior:
 * - The copy action is performed by clicking the copy icon next to the token.
 * - After copying, a small "Copied" tooltip appears next to the icon; the modal remains open.
 *
 * Initial state: modal is closed; token is not visible until the modal is opened.
 *
 * Success: Clipboard text equals "PAT-44F8-19D2".
 */

import React, { useState } from 'react';
import { Card, Typography, Button, Modal, Space } from 'antd';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const { Text } = Typography;

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('PAT-44F8-19D2', 'Personal token');
    if (success) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <>
      <Card title="Personal access" style={{ width: 350 }} data-testid="personal-access-card">
        <Button type="primary" onClick={() => setModalOpen(true)} data-testid="view-token-button">
          View token
        </Button>
      </Card>

      <Modal
        title="Token details"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={
          <Button onClick={() => setModalOpen(false)}>Done</Button>
        }
        data-testid="token-modal"
      >
        <Space direction="vertical" style={{ width: '100%', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text>Personal token:</Text>
            <Text
              copyable={{
                text: 'PAT-44F8-19D2',
                onCopy: handleCopy,
                tooltips: ['Copy', 'Copied'],
              }}
              code
              style={{ fontFamily: 'monospace' }}
              data-testid="copy-personal-token"
            >
              PAT-44F8-19D2
            </Text>
          </div>
        </Space>
      </Modal>
    </>
  );
}
