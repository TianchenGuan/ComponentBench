'use client';

/**
 * dialog_modal-antd-v2-T12: Full-screen style child — Done reviewing in custom header
 */

import React, { useRef, useState } from 'react';
import { Button, Modal, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

export default function T12({ onSuccess }: TaskComponentProps) {
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
            modal_instance: 'Asset review',
            last_opened_instance: 'Asset review',
            related_instances: { 'Asset review': { open: true } },
          };
        }}
        data-testid="cb-start-asset-review"
      >
        Start asset review
      </Button>
      <Modal
        title="Asset review"
        open={parentOpen}
        onCancel={() => {
          setParentOpen(false);
          setChildOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'cancel',
            modal_instance: 'Asset review',
            last_opened_instance: 'Asset review',
            related_instances: { 'Asset review': { open: false } },
          };
        }}
        zIndex={1000}
        footer={null}
        maskClosable={!childOpen}
        keyboard={!childOpen}
        data-testid="modal-asset-review"
      >
        <Paragraph>Queued renders and texture packs.</Paragraph>
        <Button
          onClick={() => {
            setChildOpen(true);
            window.__cbModalState = {
              open: true,
              close_reason: null,
              modal_instance: 'Focus preview',
              last_opened_instance: 'Focus preview',
              related_instances: { 'Asset review': { open: true } },
            };
          }}
          data-testid="cb-open-focus-preview"
        >
          Open focus preview
        </Button>
      </Modal>
      <Modal
        title={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              width: '100%',
            }}
          >
            <Text strong>Focus preview</Text>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setChildOpen(false);
                window.__cbModalState = {
                  open: false,
                  close_reason: 'done_button',
                  modal_instance: 'Focus preview',
                  last_opened_instance: 'Focus preview',
                  related_instances: { 'Asset review': { open: parentOpen } },
                };
                if (parentOpen && !successCalledRef.current) {
                  successCalledRef.current = true;
                  setTimeout(() => onSuccess(), 100);
                }
              }}
              data-testid="cb-done-reviewing"
            >
              Done reviewing
            </Button>
          </div>
        }
        open={childOpen}
        closable
        maskClosable={false}
        keyboard={false}
        footer={null}
        width="100%"
        style={{ top: 16, maxWidth: 'calc(100vw - 32px)' }}
        styles={{
          body: { minHeight: 'min(85vh, 640px)' },
        }}
        zIndex={1100}
        data-testid="modal-focus-preview"
      >
        <Paragraph>Full-viewport preview of the selected asset.</Paragraph>
      </Modal>
    </>
  );
}
