'use client';

/**
 * dialog_modal-mantine-T05: Close a modal with Escape
 *
 * Layout: isolated_card, but the modal panel is positioned toward the BOTTOM-LEFT of the viewport.
 * A Mantine Modal is open on page load.
 *
 * Modal configuration:
 * - Title: "Command palette"
 * - Content: static list of commands (non-interactive)
 * - withCloseButton=false (no header close button)
 * - closeOnClickOutside=false (overlay click does not close)
 * - closeOnEscape=true (Escape closes)
 *
 * Initial state: modal open.
 * Success: The 'Command palette' modal is closed via Escape key (close_reason='escape_key').
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Modal, Kbd, Stack, Group, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(true); // Modal starts open
  const [closedBy, setClosedBy] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Command palette',
    };
  }, []);

  const handleClose = () => {
    // Since withCloseButton=false and closeOnClickOutside=false,
    // this can only be triggered by Escape key
    setOpened(false);
    setClosedBy('escape');
    
    window.__cbModalState = {
      open: false,
      close_reason: 'escape_key',
      modal_instance: 'Command palette',
    };
    
    // Success when closed via Escape
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const commands = [
    { keys: ['Ctrl', 'P'], action: 'Quick open file' },
    { keys: ['Ctrl', 'Shift', 'P'], action: 'Command palette' },
    { keys: ['Ctrl', 'S'], action: 'Save' },
    { keys: ['Ctrl', 'Z'], action: 'Undo' },
    { keys: ['Esc'], action: 'Close modal' },
  ];

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="lg" mb="md">Quick Actions</Text>
        <Text size="sm" c="dimmed">
          Use keyboard shortcuts to navigate quickly.
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
        title="Command palette"
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={true}
        styles={{
          inner: {
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            padding: 24,
          },
        }}
        data-testid="modal-command-palette"
      >
        <Stack gap="xs">
          {commands.map((cmd, index) => (
            <Group key={index} justify="space-between">
              <Group gap={4}>
                {cmd.keys.map((key, i) => (
                  <Kbd key={i} size="xs">{key}</Kbd>
                ))}
              </Group>
              <Text size="sm" c="dimmed">{cmd.action}</Text>
            </Group>
          ))}
        </Stack>
      </Modal>
    </>
  );
}
