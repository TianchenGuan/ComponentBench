'use client';

/**
 * dialog_modal-mantine-T01: Open a basic modal
 *
 * Layout: isolated_card centered. The page shows a card titled "Files" with one button: "Create folder".
 *
 * Clicking "Create folder" opens a Mantine Modal with:
 * - Title: "Create folder"
 * - Content: short static description (no inputs)
 * - Default close button (×) in the header
 *
 * Initial state: modal closed.
 * Success: The Mantine Modal titled 'Create folder' is open/visible.
 */

import React, { useState, useRef } from 'react';
import { Card, Button, Text, Modal, Group, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpen = () => {
    setOpened(true);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Create folder',
    };
    
    // Success when modal opens
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleClose = () => {
    setOpened(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'close_button',
      modal_instance: 'Create folder',
    };
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="lg" mb="md">Files</Text>
        <Text size="sm" c="dimmed" mb="md">
          Organize your documents and files in folders.
        </Text>
        <Button onClick={handleOpen} data-testid="cb-open-create-folder">
          Create folder
        </Button>
      </Card>

      <Modal
        opened={opened}
        onClose={handleClose}
        title="Create folder"
        centered
        data-testid="modal-create-folder"
      >
        <Text size="sm">
          Create a new folder to organize your files. You can move existing files
          into this folder after it&apos;s created.
        </Text>
      </Modal>
    </>
  );
}
