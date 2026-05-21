'use client';

/**
 * dialog_modal-antd-v2-T03: Release notes — scroll body, Close preview at bottom
 */

import React, { useRef, useState } from 'react';
import { Button, Card, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

const LOREM = `Version 3.2 adds batch exports, tighter RBAC defaults, and faster cold starts for edge workers.
We rewrote the scheduler to reduce tail latency when many jobs share the same dependency graph.
Deprecation: legacy token format sunset is scheduled for Q4; rotate keys using the new issuer flow.
Operator note: enable audit streaming before upgrading production clusters.`;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  const longBody = (
    <>
      {[0, 1, 2, 3].map((i) => (
        <Paragraph key={i}>{LOREM}</Paragraph>
      ))}
      <Button
        type="primary"
        style={{ marginTop: 16 }}
        onClick={() => {
          setOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'close_preview_button',
            modal_instance: 'Release notes',
            last_opened_instance: 'Release notes',
          };
          if (!successCalledRef.current) {
            successCalledRef.current = true;
            setTimeout(() => onSuccess(), 100);
          }
        }}
        data-testid="cb-close-preview"
      >
        Close preview
      </Button>
    </>
  );

  return (
    <Card size="small" title="Product updates" style={{ maxWidth: 440 }}>
      <Paragraph type="secondary" style={{ fontSize: 13 }}>
        Read what shipped this week.
      </Paragraph>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          window.__cbModalState = {
            open: true,
            close_reason: null,
            modal_instance: 'Release notes',
            last_opened_instance: 'Release notes',
          };
        }}
        data-testid="cb-open-release-notes"
      >
        Open Release notes
      </Button>
      <Modal
        title="Release notes"
        open={open}
        onCancel={() => {
          setOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'close_icon',
            modal_instance: 'Release notes',
            last_opened_instance: 'Release notes',
          };
        }}
        footer={null}
        maskClosable={false}
        keyboard={false}
        styles={{
          body: { maxHeight: 'min(70vh, 420px)', overflowY: 'auto' },
        }}
        data-testid="modal-release-notes"
      >
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
          Scroll inside this panel — page scroll does not count.
        </Text>
        {longBody}
      </Modal>
    </Card>
  );
}
