'use client';

/**
 * dialog_modal-antd-T01: Open a basic modal dialog
 *
 * Layout: isolated_card centered in the viewport. The page shows a single card titled "Dialogs".
 * Inside the card there is a short paragraph and one primary button labeled "Newsletter settings".
 *
 * Clicking "Newsletter settings" opens an Ant Design Modal with:
 * - Title: "Newsletter settings"
 * - Body: a short static description (no form fields)
 * - Footer: two buttons: "Cancel" (secondary) and "OK" (primary)
 * - Standard close icon (×) in the top-right of the modal header
 *
 * Initial state: the modal is closed. No other modals exist on the page. No distractors.
 * Success: The AntD Modal instance labeled 'Newsletter settings' is open/visible.
 */

import React, { useState, useRef } from 'react';
import { Card, Button, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph } = Typography;

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpenModal = () => {
    setOpen(true);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Newsletter settings',
    };
    
    // Success when modal opens
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Newsletter settings',
    };
  };

  const handleOk = () => {
    setOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'ok',
      modal_instance: 'Newsletter settings',
    };
  };

  return (
    <>
      <Card title="Dialogs" style={{ width: 400 }}>
        <Paragraph>
          Configure your notification preferences and settings.
        </Paragraph>
        <Button
          type="primary"
          onClick={handleOpenModal}
          data-testid="cb-open-newsletter-settings"
        >
          Newsletter settings
        </Button>
      </Card>

      <Modal
        title="Newsletter settings"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        data-testid="modal-newsletter-settings"
      >
        <Paragraph>
          Manage your email subscription preferences. Choose which newsletters 
          you&apos;d like to receive and how often.
        </Paragraph>
      </Modal>
    </>
  );
}
