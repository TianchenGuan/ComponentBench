'use client';

/**
 * progress_bar-antd-T04: Open export dialog and finish to 100%
 *
 * Layout: modal_flow. The main page shows a centered card titled "Report export" 
 * with a single button "Open export details".
 *
 * Target component: an Ant Design line Progress bar labeled "Export progress" that is NOT 
 * visible until a modal dialog is opened.
 *
 * Overlay behavior:
 * - Clicking "Open export details" opens an AntD Modal titled "Export details".
 * - Inside the modal, the Progress bar appears at 0% and begins filling automatically.
 * - The modal also contains secondary text ("Preparing data…") and two buttons in the footer: 
 *   "Close" and "Cancel export" (distractors).
 *
 * Success: Progress bar inside modal reaches 100% and status becomes "success".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Button, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState<'normal' | 'active' | 'success' | 'exception'>('normal');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (percent >= 100 && status === 'success') {
      onSuccess();
    }
  }, [percent, status, onSuccess]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setPercent(0);
    setStatus('active');
    intervalRef.current = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          setStatus('success');
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <Card title="Report export" style={{ width: 350 }}>
        <Button type="primary" onClick={handleOpenModal}>
          Open export details
        </Button>
      </Card>
      <Modal
        title="Export details"
        open={isModalOpen}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
          <Button key="cancel" danger>
            Cancel export
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Preparing data…</Text>
        </div>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Export progress</Text>
          <Progress
            percent={percent}
            status={status}
            data-testid="export-progress"
          />
        </div>
      </Modal>
    </>
  );
}
