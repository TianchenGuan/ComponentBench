'use client';

/**
 * dialog_modal-antd-T02: Cancel and close an open modal
 *
 * Layout: isolated_card centered. The page loads with an Ant Design Modal already open.
 *
 * Modal configuration:
 * - Title: "Delete draft"
 * - Body: static warning text (no inputs)
 * - Footer: "Cancel" and "OK"
 * - Close icon (×) is present in the header.
 *
 * Initial state: the modal is open and focused.
 * Success: The 'Delete draft' modal is closed via the Cancel button (close_reason='cancel').
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph, Text } = Typography;

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Modal starts open
  const [lastAction, setLastAction] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    // Set initial state
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Delete draft',
    };
  }, []);

  const handleCancel = () => {
    setOpen(false);
    setLastAction('canceled');
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Delete draft',
    };
    
    // Success when closed via Cancel
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleOk = () => {
    setOpen(false);
    setLastAction('confirmed');
    window.__cbModalState = {
      open: false,
      close_reason: 'ok',
      modal_instance: 'Delete draft',
    };
  };

  // Handle close via X button or mask - these should NOT count as success
  const handleClose = () => {
    setOpen(false);
    setLastAction('dismissed');
    window.__cbModalState = {
      open: false,
      close_reason: 'close_icon',
      modal_instance: 'Delete draft',
    };
  };

  return (
    <>
      <Card title="Documents" style={{ width: 400 }}>
        <Paragraph>Your documents are managed here.</Paragraph>
      </Card>

      {lastAction && (
        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Last action: {lastAction}
        </Text>
      )}

      <Modal
        title="Delete draft"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancel"
        okText="OK"
        data-testid="modal-delete-draft"
      >
        <Paragraph>
          Are you sure you want to delete this draft? This action cannot be undone.
        </Paragraph>
      </Modal>
    </>
  );
}
