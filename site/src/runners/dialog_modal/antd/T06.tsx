'use client';

/**
 * dialog_modal-antd-T06: Close a non-dismissible modal by clicking OK
 *
 * Layout: isolated_card centered, with COMPACT spacing.
 * One Ant Design Modal is open on load.
 *
 * Modal configuration:
 * - Title: "Session timeout"
 * - Body: static message
 * - Footer: "OK" (primary) and "Cancel" (secondary) buttons
 * - maskClosable=false (clicking outside does NOT close)
 * - keyboard=false (Escape does NOT close)
 * - Header close icon (×) is hidden (closable=false)
 *
 * Initial state: modal is open.
 * Success: The 'Session timeout' modal is closed via OK button (close_reason='ok').
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Modal, Typography, ConfigProvider } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph } = Typography;

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Modal starts open
  const [loading, setLoading] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Session timeout',
    };
  }, []);

  const handleOk = () => {
    setLoading(true);
    
    // Simulate brief loading state
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      
      window.__cbModalState = {
        open: false,
        close_reason: 'ok',
        modal_instance: 'Session timeout',
      };
      
      // Success when closed via OK
      if (!successCalledRef.current) {
        successCalledRef.current = true;
        setTimeout(() => onSuccess(), 100);
      }
    }, 300);
  };

  const handleCancel = () => {
    setOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Session timeout',
    };
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          padding: 12,
          paddingLG: 16,
        },
      }}
    >
      <Card title="Dashboard" style={{ width: 380 }} size="small">
        <Paragraph style={{ marginBottom: 0 }}>
          Welcome to your dashboard. Your session is being monitored.
        </Paragraph>
      </Card>

      <Modal
        title="Session timeout"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="OK"
        cancelText="Cancel"
        confirmLoading={loading}
        maskClosable={false}
        keyboard={false}
        closable={false}
        data-testid="modal-session-timeout"
      >
        <Paragraph>
          Your session is about to expire.
        </Paragraph>
      </Modal>
    </ConfigProvider>
  );
}
