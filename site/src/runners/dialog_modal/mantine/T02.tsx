'use client';

/**
 * dialog_modal-mantine-T02: Close a modal using the header close button
 *
 * Layout: isolated_card centered. A Mantine Modal is open on page load.
 *
 * Modal configuration:
 * - Title: "What's new"
 * - Content: short changelog text (non-interactive)
 * - withCloseButton=true so a close (×) button appears in the header.
 * - closeOnClickOutside=true and closeOnEscape=true are enabled but should not count as success.
 *
 * Initial state: modal open.
 * Success: The 'What's new' modal is closed via the close button (×) (close_reason='close_button').
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Modal, List } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(true); // Modal starts open
  const [closedBy, setClosedBy] = useState<string | null>(null);
  const successCalledRef = useRef(false);
  const closeReasonRef = useRef<string>('');

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: "What's new",
    };
  }, []);

  const handleClose = () => {
    // Determine close reason based on how it was triggered
    // The close button click is the default if not from overlay or escape
    const reason = closeReasonRef.current || 'close_button';
    
    setOpened(false);
    setClosedBy(reason === 'close_button' ? 'header-close' : reason);
    
    window.__cbModalState = {
      open: false,
      close_reason: reason as any,
      modal_instance: "What's new",
    };
    
    // Success only when closed via close button
    if (reason === 'close_button' && !successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
    
    closeReasonRef.current = '';
  };

  // Custom close handler to track reason
  const handleCloseWithReason = (reason: string) => {
    closeReasonRef.current = reason;
    handleClose();
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="lg" mb="md">Updates</Text>
        <Text size="sm" c="dimmed">
          Check out the latest updates and improvements.
        </Text>
      </Card>

      {closedBy && (
        <Text size="xs" c="dimmed" mt="xs">
          Closed by: {closedBy}
        </Text>
      )}

      <Modal
        opened={opened}
        onClose={() => handleCloseWithReason('close_button')}
        title="What's new"
        centered
        closeOnClickOutside={true}
        closeOnEscape={true}
        data-testid="modal-whats-new"
      >
        <Text size="sm" mb="md">
          Here are the latest updates to our platform:
        </Text>
        <List size="sm" spacing="xs">
          <List.Item>Improved performance across all pages</List.Item>
          <List.Item>New dark mode support</List.Item>
          <List.Item>Enhanced accessibility features</List.Item>
          <List.Item>Bug fixes and stability improvements</List.Item>
        </List>
      </Modal>
    </>
  );
}
