'use client';

/**
 * dialog_modal-antd-v2-T04: Migration warning — scroll, pick Apply update
 */

import React, { useRef, useState } from 'react';
import { Button, Card, Modal, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

const BLOCK =
  'This migration rewrites stored job metadata. Take a backup before applying. Downtime window is estimated under two minutes.';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  const closeWrong = (reason: 'cancel' | 'close_icon') => {
    setOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: reason,
      modal_instance: 'Migration warning',
      last_opened_instance: 'Migration warning',
    };
  };

  return (
    <Card size="small" title="Deployments" style={{ maxWidth: 460 }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Schema migration pending on staging.
        </Paragraph>
        <Button
          onClick={() => {
            setOpen(true);
            window.__cbModalState = {
              open: true,
              close_reason: null,
              modal_instance: 'Migration warning',
              last_opened_instance: 'Migration warning',
            };
          }}
          data-testid="cb-review-migration"
        >
          Review Migration warning
        </Button>
        <Space wrap>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Build 4821
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Rollout 12%
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Errors 0.02%
          </Text>
        </Space>
      </Space>
      <Modal
        title="Migration warning"
        open={open}
        onCancel={() => closeWrong('close_icon')}
        closable
        maskClosable={false}
        keyboard={false}
        footer={null}
        styles={{
          body: { maxHeight: 'min(65vh, 380px)', overflowY: 'auto' },
        }}
        data-testid="modal-migration-warning"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Paragraph key={i}>{BLOCK}</Paragraph>
        ))}
        <Space style={{ marginTop: 16 }} wrap>
          <Button onClick={() => closeWrong('cancel')}>View later</Button>
          <Button onClick={() => closeWrong('cancel')}>Ask admin</Button>
          <Button
            type="primary"
            onClick={() => {
              setOpen(false);
              window.__cbModalState = {
                open: false,
                close_reason: 'apply_update_button',
                modal_instance: 'Migration warning',
                last_opened_instance: 'Migration warning',
              };
              if (!successCalledRef.current) {
                successCalledRef.current = true;
                setTimeout(() => onSuccess(), 100);
              }
            }}
            data-testid="cb-apply-update"
          >
            Apply update
          </Button>
        </Space>
      </Modal>
    </Card>
  );
}
