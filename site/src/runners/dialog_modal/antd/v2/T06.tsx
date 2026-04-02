'use client';

/**
 * dialog_modal-antd-v2-T06: Nested — Escape closes child only
 */

import React, { useRef, useState } from 'react';
import { Button, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const successCalledRef = useRef(false);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setParentOpen(true);
          setChildOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: null,
            modal_instance: 'Filters',
            last_opened_instance: 'Filters',
            related_instances: { Filters: { open: true } },
          };
        }}
        data-testid="cb-open-filters"
      >
        Open filters
      </Button>
      <Modal
        title="Filters"
        open={parentOpen}
        onCancel={() => {
          setParentOpen(false);
          setChildOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'cancel',
            modal_instance: 'Filters',
            last_opened_instance: 'Filters',
            related_instances: { Filters: { open: false } },
          };
        }}
        zIndex={1000}
        footer={null}
        maskClosable={!childOpen}
        keyboard={!childOpen}
        data-testid="modal-filters"
      >
        <Paragraph>Saved filter sets for this view.</Paragraph>
        <Button
          onClick={() => {
            setChildOpen(true);
            window.__cbModalState = {
              open: true,
              close_reason: null,
              modal_instance: 'Discard draft',
              last_opened_instance: 'Discard draft',
              related_instances: { Filters: { open: true } },
            };
          }}
          data-testid="cb-discard-draft"
        >
          Discard draft…
        </Button>
      </Modal>
      <Modal
        title="Discard draft"
        open={childOpen}
        closable={false}
        maskClosable={false}
        keyboard
        footer={null}
        zIndex={1100}
        onCancel={() => {
          setChildOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'escape_key',
            modal_instance: 'Discard draft',
            last_opened_instance: 'Discard draft',
            related_instances: { Filters: { open: parentOpen } },
          };
          if (parentOpen && !successCalledRef.current) {
            successCalledRef.current = true;
            setTimeout(() => onSuccess(), 100);
          }
        }}
        data-testid="modal-discard-draft"
      >
        <Paragraph style={{ marginBottom: 0 }}>
          Press Escape to close this confirmation and return to Filters.
        </Paragraph>
      </Modal>
    </>
  );
}
