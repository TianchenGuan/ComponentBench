'use client';

/**
 * alert_dialog_confirm-antd-T03: Open a reset confirmation dialog and leave it open
 *
 * Baseline isolated-card layout centered in the viewport. A single card titled "Search filters" contains a summary of filters (read-only chips) and one button labeled "Reset filters".
 *
 * Clicking "Reset filters" opens an Ant Design Modal.confirm dialog:
 * - Title: "Reset filters?"
 * - Body: "This will clear all filter chips."
 * - Buttons: "Cancel" and "Reset".
 *
 * The task is ONLY to open the confirmation dialog; do not press Cancel/Reset. The modal should remain visible on screen.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Button, Modal, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);
  const modalOpenRef = useRef(false);

  useEffect(() => {
    // Check if modal is open via MutationObserver
    const checkModal = () => {
      const modal = document.querySelector('.ant-modal-confirm');
      if (modal && modalOpenRef.current && !successCalledRef.current) {
        successCalledRef.current = true;
        onSuccess();
      }
    };

    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  const handleResetClick = () => {
    modalOpenRef.current = true;
    
    Modal.confirm({
      title: 'Reset filters?',
      content: 'This will clear all filter chips.',
      okText: 'Reset',
      cancelText: 'Cancel',
      okButtonProps: { 'data-testid': 'cb-confirm' } as any,
      cancelButtonProps: { 'data-testid': 'cb-cancel' } as any,
      onOk: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'confirm',
          dialog_instance: 'reset_filters',
        };
      },
      onCancel: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'cancel',
          dialog_instance: 'reset_filters',
        };
      },
    });

    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'reset_filters',
    };
  };

  return (
    <Card title="Search filters" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <Tag>Category: Electronics</Tag>
        <Tag>Price: $50-$200</Tag>
        <Tag>In Stock</Tag>
      </div>
      <Button
        onClick={handleResetClick}
        data-testid="cb-open-reset-filters"
      >
        Reset filters
      </Button>
    </Card>
  );
}
