'use client';

/**
 * dialog_modal-mantine-T03: Dismiss modal by clicking on the overlay
 *
 * Layout: isolated_card centered. A Mantine Modal is open on page load.
 *
 * Modal configuration:
 * - Title: "Preview"
 * - Content: short static preview text
 * - withCloseButton=false (no header close button)
 * - closeOnEscape=false (Escape does not close)
 * - closeOnClickOutside=true (overlay click closes)
 *
 * Initial state: modal open.
 * Success: The 'Preview' modal is closed via overlay click (close_reason='overlay_click').
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Modal } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(true); // Modal starts open
  const [closedBy, setClosedBy] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Preview',
    };
  }, []);

  const handleClose = () => {
    // Since withCloseButton=false and closeOnEscape=false,
    // this can only be triggered by overlay click
    setOpened(false);
    setClosedBy('overlay');
    
    window.__cbModalState = {
      open: false,
      close_reason: 'overlay_click' as any,
      modal_instance: 'Preview',
    };
    
    // Success when closed via overlay click
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="lg" mb="md">Documents</Text>
        <Text size="sm" c="dimmed">
          Preview your documents before sharing.
        </Text>
      </Card>

      {closedBy && (
        <Text size="xs" c="dimmed" mt="xs">
          Closed by: {closedBy}
        </Text>
      )}

      <Modal
        opened={opened}
        onClose={handleClose}
        title="Preview"
        centered
        withCloseButton={false}
        closeOnEscape={false}
        closeOnClickOutside={true}
        data-testid="modal-preview"
      >
        <Text size="sm">
          This is a preview of your document. The content looks great and is 
          ready for review. Click outside this modal to close it.
        </Text>
      </Modal>
    </>
  );
}
