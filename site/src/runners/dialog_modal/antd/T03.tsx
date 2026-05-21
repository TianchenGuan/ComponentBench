'use client';

/**
 * dialog_modal-antd-T03: Close modal using the header X
 *
 * Layout: isolated_card centered. The page loads with one Ant Design Modal open.
 *
 * Modal configuration:
 * - Title: "Help"
 * - Body: short help text and a link-styled line (non-interactive)
 * - Footer: hidden (no OK/Cancel buttons) so the primary close affordance is the header close icon (×).
 *
 * Initial state: modal is open; background is dimmed.
 * Success: The 'Help' modal is closed via the close icon (×) (close_reason='close_icon').
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph, Text, Link } = Typography;

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Modal starts open
  const [lastClose, setLastClose] = useState<string | null>(null);
  const successCalledRef = useRef(false);
  const closeReasonRef = useRef<string | null>(null);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Help',
    };
  }, []);

  const handleClose = (e?: React.MouseEvent) => {
    // Determine close reason
    let reason: 'close_icon' | 'mask_click' | 'escape_key' = 'close_icon';
    
    if (e) {
      const target = e.target as HTMLElement;
      // Check if clicked on mask
      if (target.classList.contains('ant-modal-wrap')) {
        reason = 'mask_click';
      }
    }
    
    closeReasonRef.current = reason;
    setOpen(false);
    setLastClose(`header-x`);
    
    window.__cbModalState = {
      open: false,
      close_reason: reason,
      modal_instance: 'Help',
    };
    
    // Success only when closed via close icon
    if (reason === 'close_icon' && !successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <>
      <Card title="Support" style={{ width: 400 }}>
        <Paragraph>Need assistance? Click the help button above.</Paragraph>
      </Card>

      {lastClose && (
        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Last close: {lastClose}
        </Text>
      )}

      <Modal
        title="Help"
        open={open}
        onCancel={handleClose}
        footer={null}
        maskClosable={false}
        keyboard={false}
        data-testid="modal-help"
      >
        <Paragraph>
          Welcome to the help center. Here you can find answers to common questions 
          and learn how to use our platform effectively.
        </Paragraph>
        <Text type="secondary">
          <Link>Visit our documentation</Link> for more detailed guides.
        </Text>
      </Modal>
    </>
  );
}
