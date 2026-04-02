'use client';

/**
 * alert_dialog_confirm-antd-T01: Confirm deleting a draft (basic modal confirm)
 *
 * Baseline isolated-card layout centered in the viewport. A single card titled "Drafts" contains one row labeled "Q1 Budget Draft" with a primary action button labeled "Delete draft".
 *
 * When "Delete draft" is clicked, an Ant Design static confirmation modal (Modal.confirm) appears centered with:
 * - Title: "Delete this draft?"
 * - Body text: "This cannot be undone."
 * - Footer buttons: "Cancel" (left) and "Confirm" (right, danger-styled).
 * - Standard close (×) icon in the top-right of the modal.
 *
 * No other dialogs are present. There are no other destructive actions on the page and no other overlays. The modal closes immediately after a button is pressed, and a small non-blocking toast appears ("Action recorded") purely as feedback (toast is NOT used for success).
 */

import React, { useRef } from 'react';
import { Card, Button, Modal, message } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  const handleDeleteClick = () => {
    Modal.confirm({
      title: 'Delete this draft?',
      content: 'This cannot be undone.',
      okText: 'Confirm',
      cancelText: 'Cancel',
      okButtonProps: { danger: true, 'data-testid': 'cb-confirm' } as any,
      cancelButtonProps: { 'data-testid': 'cb-cancel' } as any,
      onOk: () => {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          window.__cbDialogState = {
            dialog_open: false,
            last_action: 'confirm',
            dialog_instance: 'delete_draft_q1_budget_draft',
          };
          message.info('Action recorded');
          onSuccess();
        }
      },
      onCancel: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'cancel',
          dialog_instance: 'delete_draft_q1_budget_draft',
        };
        message.info('Action recorded');
      },
    });

    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'delete_draft_q1_budget_draft',
    };
  };

  return (
    <Card title="Drafts" style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Q1 Budget Draft</span>
        <Button
          danger
          onClick={handleDeleteClick}
          data-testid="cb-open-delete-draft"
        >
          Delete draft
        </Button>
      </div>
    </Card>
  );
}
