'use client';

/**
 * alert_dialog_confirm-mantine-T03: Open a leave-page confirmation modal and keep it open
 *
 * Baseline isolated-card layout. A card titled "Unsaved changes" has one button labeled "Back to list".
 *
 * Clicking "Back to list" opens a Mantine confirm modal:
 * - Title: "Leave this page?"
 * - Body: "You have unsaved changes."
 * - Buttons: "Stay" and "Leave"
 *
 * The task is to open the modal and leave it visible (do not choose Stay/Leave).
 */

import React, { useRef, useState, useEffect } from 'react';
import { Card, Button, Text, Modal, Group } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (opened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [opened, onSuccess]);

  const handleBackClick = () => {
    setOpened(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'leave_page',
    };
  };

  const handleConfirm = () => {
    setOpened(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'confirm',
      dialog_instance: 'leave_page',
    };
  };

  const handleCancel = () => {
    setOpened(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'leave_page',
    };
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="lg" mb="md">Unsaved changes</Text>
        <Text size="sm" c="dimmed" mb="md">
          Your document has been modified.
        </Text>
        <Button
          variant="outline"
          onClick={handleBackClick}
          data-testid="cb-open-back-to-list"
        >
          Back to list
        </Button>
      </Card>

      <Modal
        opened={opened}
        onClose={handleCancel}
        title="Leave this page?"
        centered
        data-testid="modal-leave-page"
      >
        <Text size="sm" mb="lg">
          You have unsaved changes. If you leave now, your changes will be lost.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleCancel} data-testid="cb-cancel">
            Stay
          </Button>
          <Button color="red" onClick={handleConfirm} data-testid="cb-confirm">
            Leave
          </Button>
        </Group>
      </Modal>
    </>
  );
}
