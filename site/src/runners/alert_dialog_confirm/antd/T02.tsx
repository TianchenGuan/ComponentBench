'use client';

/**
 * alert_dialog_confirm-antd-T02: Cancel removing a payment method (dark theme)
 *
 * Same simple single-card page as baseline, but using a dark theme.
 *
 * A card titled "Payment methods" shows one item: "Visa •••• 4242" with a button labeled "Remove card". Clicking it opens an Ant Design Modal.confirm dialog centered on screen:
 * - Title: "Remove this payment method?"
 * - Body: "You can add it again later."
 * - Buttons: "Cancel" (left) and "Remove" (right, danger-styled).
 * - A × close icon is present.
 *
 * For consistency in the UI copy, the right button is labeled "Remove", but the task requires pressing "Cancel" and closing the dialog without confirming removal.
 */

import React, { useRef } from 'react';
import { Card, Button, Modal, message } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  const handleRemoveClick = () => {
    Modal.confirm({
      title: 'Remove this payment method?',
      content: 'You can add it again later.',
      okText: 'Remove',
      cancelText: 'Cancel',
      okButtonProps: { danger: true, 'data-testid': 'cb-confirm' } as any,
      cancelButtonProps: { 'data-testid': 'cb-cancel' } as any,
      onOk: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'confirm',
          dialog_instance: 'remove_payment_visa_4242',
        };
        message.info('Action recorded');
      },
      onCancel: (close) => {
        // Distinguish between explicit Cancel click and dismiss
        // AntD onCancel is called for both, but we check if it's the button
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          window.__cbDialogState = {
            dialog_open: false,
            last_action: 'cancel',
            dialog_instance: 'remove_payment_visa_4242',
          };
          message.info('Action recorded');
          onSuccess();
        }
      },
    });

    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'remove_payment_visa_4242',
    };
  };

  return (
    <Card title="Payment methods" style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Visa •••• 4242</span>
        <Button
          danger
          onClick={handleRemoveClick}
          data-testid="cb-open-remove-card"
        >
          Remove card
        </Button>
      </div>
    </Card>
  );
}
