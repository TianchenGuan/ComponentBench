'use client';

/**
 * clipboard_copy-antd-T10: Confirm copying recovery codes
 *
 * Layout: modal_flow, centered.
 * The page shows a "Security" card with a section titled "Recovery codes". The codes are displayed in a preformatted block (3 lines).
 * Next to the section header there is a small copy icon (clipboard_copy control) styled like Ant Design's copyable affordance.
 *
 * Confirmation flow (sensitive copy):
 * - Clicking the copy icon does NOT immediately write to the clipboard.
 * - Instead, an Ant Design Modal appears titled "Copy recovery codes?" with warning text.
 * - The modal has two buttons: "Cancel" and a primary "Copy anyway".
 * - Only clicking "Copy anyway" performs the clipboard write of the full multi-line recovery code block.
 * - After copying, a toast "Copied" appears; the modal auto-closes.
 *
 * Initial state: modal closed; nothing copied.
 * Target clipboard text (exact, including newlines):
 * RCV-9911-ALPHA
 * RCV-9912-BRAVO
 * RCV-9913-CHARLIE
 *
 * Success: User confirms the sensitive-copy dialog by clicking "Copy anyway", clipboard text equals the full recovery-code block exactly (3 lines).
 */

import React, { useState } from 'react';
import { Card, Typography, Button, Modal, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import { copyToClipboard, trackConfirmAction } from '../types';

const { Text, Title } = Typography;

const RECOVERY_CODES = `RCV-9911-ALPHA
RCV-9912-BRAVO
RCV-9913-CHARLIE`;

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCopyIconClick = () => {
    if (completed) return;
    setModalOpen(true);
  };

  const handleConfirmCopy = async () => {
    trackConfirmAction('Copy anyway');
    const success = await copyToClipboard(RECOVERY_CODES, 'Recovery codes');
    if (success) {
      message.success('Copied');
      setModalOpen(false);
      setCompleted(true);
      onSuccess();
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Card title="Security" style={{ width: 400 }} data-testid="security-card">
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Title level={5} style={{ margin: 0 }}>Recovery codes</Title>
            <Button
              type="text"
              icon={<CopyOutlined />}
              size="small"
              onClick={handleCopyIconClick}
              data-testid="copy-recovery-codes"
              aria-label="Copy recovery codes"
            />
          </div>
          <pre
            style={{
              background: '#f5f5f5',
              padding: 12,
              borderRadius: 4,
              fontFamily: 'monospace',
              fontSize: 14,
              margin: 0,
            }}
            data-testid="recovery-codes-block"
          >
            {RECOVERY_CODES}
          </pre>
        </div>
      </Card>

      <Modal
        title="Copy recovery codes?"
        open={modalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="copy" type="primary" onClick={handleConfirmCopy} data-testid="confirm-copy-button">
            Copy anyway
          </Button>,
        ]}
        data-testid="confirm-modal"
      >
        <Text type="warning">
          These recovery codes are sensitive. Make sure you store them securely and do not share them with anyone.
        </Text>
      </Modal>
    </>
  );
}
