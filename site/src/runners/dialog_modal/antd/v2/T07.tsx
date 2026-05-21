'use client';

/**
 * dialog_modal-antd-v2-T07: Nested — child Details closed via header × only
 */

import React, { useRef, useState } from 'react';
import { Button, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
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
            modal_instance: 'Layout settings',
            last_opened_instance: 'Layout settings',
            related_instances: { 'Layout settings': { open: true } },
          };
        }}
        data-testid="cb-open-layout-settings"
      >
        Open layout settings
      </Button>
      <Modal
        title="Layout settings"
        open={parentOpen}
        onCancel={() => {
          setParentOpen(false);
          setChildOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'cancel',
            modal_instance: 'Layout settings',
            last_opened_instance: 'Layout settings',
            related_instances: { 'Layout settings': { open: false } },
          };
        }}
        zIndex={1000}
        footer={null}
        maskClosable={!childOpen}
        keyboard={!childOpen}
        data-testid="modal-layout-settings"
      >
        <Paragraph>Grid density and panel widths.</Paragraph>
        <Button
          onClick={() => {
            setChildOpen(true);
            window.__cbModalState = {
              open: true,
              close_reason: null,
              modal_instance: 'Details',
              last_opened_instance: 'Details',
              related_instances: { 'Layout settings': { open: true } },
            };
          }}
          data-testid="cb-open-details"
        >
          Open details
        </Button>
      </Modal>
      <Modal
        title="Details"
        open={childOpen}
        closable
        maskClosable={false}
        keyboard={false}
        footer={null}
        zIndex={1100}
        onCancel={() => {
          setChildOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'close_icon',
            modal_instance: 'Details',
            last_opened_instance: 'Details',
            related_instances: { 'Layout settings': { open: parentOpen } },
          };
          if (parentOpen && !successCalledRef.current) {
            successCalledRef.current = true;
            setTimeout(() => onSuccess(), 100);
          }
        }}
        data-testid="modal-details"
      >
        <Paragraph style={{ marginBottom: 0 }}>Read-only layout diagnostics.</Paragraph>
      </Modal>
    </>
  );
}
