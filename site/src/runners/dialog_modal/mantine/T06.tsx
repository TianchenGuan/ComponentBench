'use client';

/**
 * dialog_modal-mantine-T06: Close a locked modal using the footer button
 *
 * Layout: isolated_card centered with SMALL scale.
 * A Mantine Modal is open on page load.
 *
 * Modal configuration:
 * - Title: "Connectivity check"
 * - Content: short static status text
 * - closeOnClickOutside=false (overlay click does not close)
 * - closeOnEscape=false (Escape does not close)
 * - withCloseButton=false (no header close button)
 * - A single footer button labeled "Close dialog"
 *
 * Initial state: modal open.
 * Success: The 'Connectivity check' modal is closed via footer button (close_reason='footer_close_button').
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Text, Modal, Group, Stack, ThemeIcon } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(true); // Modal starts open
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Connectivity check',
    };
  }, []);

  const handleCloseDialog = () => {
    setOpened(false);
    
    window.__cbModalState = {
      open: false,
      close_reason: 'footer_close_button',
      modal_instance: 'Connectivity check',
    };
    
    // Success when closed via footer button
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <>
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 350 }}>
        <Text fw={500} size="sm" mb="xs">Network Status</Text>
        <Text size="xs" c="dimmed">
          Checking connectivity to all services.
        </Text>
      </Card>

      <Modal
        opened={opened}
        onClose={() => {}} // No-op, can only close via button
        title="Connectivity check"
        centered
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        size="sm"
        data-testid="modal-connectivity-check"
      >
        <Stack gap="sm">
          <Text size="sm">
            All services are connected and responding normally.
          </Text>
          
          <Group justify="flex-end" mt="md">
            <Button 
              size="xs"
              onClick={handleCloseDialog}
              data-testid="cb-close-dialog"
            >
              Close dialog
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
