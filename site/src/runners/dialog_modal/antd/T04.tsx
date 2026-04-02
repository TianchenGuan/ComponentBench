'use client';

/**
 * dialog_modal-antd-T04: Dismiss modal by clicking outside on the mask
 *
 * Layout: isolated_card centered. One Ant Design Modal is open on page load.
 *
 * Modal configuration:
 * - Title: "Quick preview"
 * - Body: a short preview paragraph
 * - Footer: no buttons (footer hidden)
 * - Header close icon (×) is hidden (closable=false) to ensure the intended dismissal is mask click.
 * - maskClosable=true (clicking the mask / dimmed background closes the modal)
 *
 * Initial state: modal is open; background is dimmed by the mask.
 * Success: The 'Quick preview' modal is closed via mask click (close_reason='mask_click').
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph, Text } = Typography;

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Modal starts open
  const [lastClose, setLastClose] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Quick preview',
    };
  }, []);

  const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Check if this is an escape key press
    if ('key' in e && e.key === 'Escape') {
      setOpen(false);
      setLastClose('escape');
      window.__cbModalState = {
        open: false,
        close_reason: 'escape_key',
        modal_instance: 'Quick preview',
      };
      return;
    }

    // Otherwise it's a mask click
    setOpen(false);
    setLastClose('mask');
    window.__cbModalState = {
      open: false,
      close_reason: 'mask_click',
      modal_instance: 'Quick preview',
    };
    
    // Success when closed via mask click
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <>
      <Card title="Preview" style={{ width: 400 }}>
        <Paragraph>
          A quick preview modal is available. Click outside to close it.
        </Paragraph>
      </Card>

      {lastClose && (
        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Last close: {lastClose}
        </Text>
      )}

      <Modal
        title="Quick preview"
        open={open}
        onCancel={handleClose}
        footer={null}
        closable={false}
        maskClosable={true}
        keyboard={true}
        data-testid="modal-quick-preview"
      >
        <Paragraph>
          This is a quick preview of your content. The document looks great and 
          is ready for publication. Review the details below.
        </Paragraph>
      </Modal>
    </>
  );
}
