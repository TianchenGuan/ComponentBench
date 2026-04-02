'use client';

/**
 * dialog_modal-antd-v2-T08: Scroll dialog body (not page) → Acknowledge
 */

import React, { useRef, useState } from 'react';
import { Button, Card, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

const CHUNK =
  'Policy covers data retention, subprocessors, and breach notification timelines. Review each section before acknowledging.';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  return (
    <div style={{ maxHeight: 480, overflowY: 'auto', paddingRight: 8 }}>
      {[0, 1, 2].map((i) => (
        <Card key={i} size="small" style={{ marginBottom: 8 }} title={`Section ${i + 1}`}>
          <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
            {CHUNK}
          </Paragraph>
        </Card>
      ))}
      <Card size="small" title="Compliance" style={{ marginBottom: 12 }}>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
            window.__cbModalState = {
              open: true,
              close_reason: null,
              modal_instance: 'Review policy',
              last_opened_instance: 'Review policy',
            };
          }}
          data-testid="cb-open-review-policy"
        >
          Open Review policy
        </Button>
      </Card>
      {[3, 4].map((i) => (
        <Card key={i} size="small" style={{ marginBottom: 8 }} title={`Appendix ${i}`}>
          <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
            {CHUNK}
          </Paragraph>
        </Card>
      ))}
      <Modal
        title="Review policy"
        open={open}
        onCancel={() => {
          setOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'close_icon',
            modal_instance: 'Review policy',
            last_opened_instance: 'Review policy',
          };
        }}
        footer={null}
        maskClosable={false}
        keyboard={false}
        styles={{
          body: { maxHeight: 'min(55vh, 320px)', overflowY: 'auto' },
        }}
        data-testid="modal-review-policy"
      >
        <Text type="secondary" style={{ fontSize: 12 }}>
          Scroll inside this dialog only.
        </Text>
        {[0, 1, 2, 3, 4].map((i) => (
          <Paragraph key={i}>{CHUNK}</Paragraph>
        ))}
        <Button
          type="primary"
          style={{ marginTop: 12 }}
          onClick={() => {
            setOpen(false);
            window.__cbModalState = {
              open: false,
              close_reason: 'acknowledge_button',
              modal_instance: 'Review policy',
              last_opened_instance: 'Review policy',
            };
            if (!successCalledRef.current) {
              successCalledRef.current = true;
              setTimeout(() => onSuccess(), 100);
            }
          }}
          data-testid="cb-acknowledge"
        >
          Acknowledge
        </Button>
      </Modal>
    </div>
  );
}
