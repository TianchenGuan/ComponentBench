'use client';

/**
 * dialog_modal-antd-v2-T09: Primary token row → Reissue now (async) only
 */

import React, { useRef, useState } from 'react';
import { Button, Card, Modal, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [which, setWhich] = useState<'primary' | 'backup' | null>(null);
  const successCalledRef = useRef(false);

  const openFor = (row: 'primary' | 'backup') => {
    setWhich(row);
    setOpen(true);
    setLoading(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Reissue token',
      last_opened_instance: 'Reissue token',
    };
  };

  const closeCancel = () => {
    setOpen(false);
    setLoading(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Reissue token',
      last_opened_instance: 'Reissue token',
    };
  };

  return (
    <Card size="small" title="Access" style={{ maxWidth: 480 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div>
            <Text strong>Primary token</Text>
            <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 12 }}>
              API access · rotated 14d ago
            </Paragraph>
          </div>
          <Button size="small" onClick={() => openFor('primary')} data-testid="cb-reissue-primary">
            Reissue…
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div>
            <Text strong>Backup token</Text>
            <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 12 }}>
              Failover · rotated 30d ago
            </Paragraph>
          </div>
          <Button size="small" onClick={() => openFor('backup')} data-testid="cb-reissue-backup">
            Reissue…
          </Button>
        </div>
      </Space>
      <Modal
        title="Reissue token"
        open={open}
        closable
        maskClosable={false}
        keyboard={false}
        footer={[
          <Button key="c" onClick={closeCancel}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={loading}
            onClick={() => {
              if (which !== 'primary') return;
              setLoading(true);
              window.setTimeout(() => {
                setOpen(false);
                setLoading(false);
                window.__cbModalState = {
                  open: false,
                  close_reason: 'primary_confirm_button',
                  modal_instance: 'Reissue token',
                  last_opened_instance: 'Reissue token',
                };
                if (!successCalledRef.current) {
                  successCalledRef.current = true;
                  setTimeout(() => onSuccess(), 100);
                }
              }, 600);
            }}
            data-testid="cb-reissue-now"
          >
            Reissue now
          </Button>,
        ]}
        data-testid="modal-reissue-token"
      >
        <Paragraph style={{ marginBottom: 0 }}>
          {which === 'primary'
            ? 'Reissue the primary token for this workspace.'
            : 'Reissue the backup token for this workspace.'}
        </Paragraph>
      </Modal>
    </Card>
  );
}
