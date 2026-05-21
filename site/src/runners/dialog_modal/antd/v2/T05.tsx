'use client';

/**
 * dialog_modal-antd-v2-T05: Nested — backdrop dismiss child only, parent stays open
 */

import React, { useRef, useState } from 'react';
import { Button, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
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
            modal_instance: 'Settings',
            last_opened_instance: 'Settings',
            related_instances: { Settings: { open: true } },
          };
        }}
        data-testid="cb-open-settings"
      >
        Open settings
      </Button>
      <Modal
        title="Settings"
        open={parentOpen}
        onCancel={() => {
          setParentOpen(false);
          setChildOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'cancel',
            modal_instance: 'Settings',
            last_opened_instance: 'Settings',
            related_instances: { Settings: { open: false } },
          };
        }}
        zIndex={1000}
        footer={null}
        maskClosable={!childOpen}
        keyboard={!childOpen}
        data-testid="modal-settings"
      >
        <Paragraph>Automation rules and schedules.</Paragraph>
        <Button
          danger
          onClick={() => {
            setChildOpen(true);
            window.__cbModalState = {
              open: true,
              close_reason: null,
              modal_instance: 'Delete automation',
              last_opened_instance: 'Delete automation',
              related_instances: { Settings: { open: true } },
            };
          }}
          data-testid="cb-delete-automation"
        >
          Delete automation…
        </Button>
      </Modal>
      <Modal
        title="Delete automation"
        open={childOpen}
        closable
        maskClosable
        keyboard={false}
        footer={null}
        zIndex={1100}
        onCancel={() => {
          setChildOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'backdrop_click',
            modal_instance: 'Delete automation',
            last_opened_instance: 'Delete automation',
            related_instances: { Settings: { open: parentOpen } },
          };
          if (parentOpen && !successCalledRef.current) {
            successCalledRef.current = true;
            setTimeout(() => onSuccess(), 100);
          }
        }}
        data-testid="modal-delete-automation"
      >
        <Paragraph style={{ marginBottom: 0 }}>
          This removes the selected automation. This action cannot be undone.
        </Paragraph>
      </Modal>
    </>
  );
}
