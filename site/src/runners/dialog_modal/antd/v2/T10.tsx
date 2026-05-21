'use client';

/**
 * dialog_modal-antd-v2-T10: Nested child scroll → Return to settings
 */

import React, { useRef, useState } from 'react';
import { Button, Modal, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

const TXT =
  'This guide lists breaking changes, migration steps, and rollout order for the next platform update.';

export default function T10({ onSuccess }: TaskComponentProps) {
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
            modal_instance: 'Project settings',
            last_opened_instance: 'Project settings',
            related_instances: { 'Project settings': { open: true } },
          };
        }}
        data-testid="cb-open-project-settings"
      >
        Open project settings
      </Button>
      <Modal
        title="Project settings"
        open={parentOpen}
        onCancel={() => {
          setParentOpen(false);
          setChildOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'cancel',
            modal_instance: 'Project settings',
            last_opened_instance: 'Project settings',
            related_instances: { 'Project settings': { open: false } },
          };
        }}
        zIndex={1000}
        footer={null}
        maskClosable={!childOpen}
        keyboard={!childOpen}
        data-testid="modal-project-settings"
      >
        <Paragraph>Repository and build targets.</Paragraph>
        <Button
          onClick={() => {
            setChildOpen(true);
            window.__cbModalState = {
              open: true,
              close_reason: null,
              modal_instance: 'Update guide',
              last_opened_instance: 'Update guide',
              related_instances: { 'Project settings': { open: true } },
            };
          }}
          data-testid="cb-open-update-guide"
        >
          Open update guide
        </Button>
      </Modal>
      <Modal
        title="Update guide"
        open={childOpen}
        onCancel={() => {
          setChildOpen(false);
          window.__cbModalState = {
            open: false,
            close_reason: 'close_icon',
            modal_instance: 'Update guide',
            last_opened_instance: 'Update guide',
            related_instances: { 'Project settings': { open: parentOpen } },
          };
        }}
        footer={null}
        maskClosable={false}
        keyboard={false}
        zIndex={1100}
        styles={{
          body: { maxHeight: 'min(60vh, 360px)', overflowY: 'auto' },
        }}
        data-testid="modal-update-guide"
      >
        <Text type="secondary" style={{ fontSize: 12 }}>
          Scroll to the bottom of this dialog.
        </Text>
        {[0, 1, 2, 3, 4].map((i) => (
          <Paragraph key={i}>{TXT}</Paragraph>
        ))}
        <Button
          type="primary"
          style={{ marginTop: 12 }}
          onClick={() => {
            setChildOpen(false);
            window.__cbModalState = {
              open: false,
              close_reason: 'return_to_settings_button',
              modal_instance: 'Update guide',
              last_opened_instance: 'Update guide',
              related_instances: { 'Project settings': { open: parentOpen } },
            };
            if (parentOpen && !successCalledRef.current) {
              successCalledRef.current = true;
              setTimeout(() => onSuccess(), 100);
            }
          }}
          data-testid="cb-return-to-settings"
        >
          Return to settings
        </Button>
      </Modal>
    </>
  );
}
